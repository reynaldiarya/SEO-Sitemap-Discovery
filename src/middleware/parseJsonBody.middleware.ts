import { Duplex } from 'node:stream';
import * as zlib from 'node:zlib';
import { parse } from 'content-type';
import { createMiddleware } from 'hono/factory';
import { decode, encodingExists } from 'iconv-lite';

export type JsonBodyEnv = { Variables: { jsonBody: unknown } };

const maxJsonBytes = 100 * 1024;

export const parseJsonBody = createMiddleware<JsonBodyEnv>(async (c, next) => {
  const body = c.req.raw.body;
  const length = c.req.header('Content-Length');
  const charset = getJsonCharset(c.req.header('Content-Type'));

  if (charset && (body || length === '0')) {
    const unsupportedCharset = `unsupported charset "${charset.toUpperCase()}"`;
    if (!charset.startsWith('utf-')) throw new Error(unsupportedCharset);

    const encoding = (c.req.header('Content-Encoding') || 'identity').toLowerCase();
    const decoder = getDecompressor(encoding);
    const expectedSize = !decoder && length !== undefined ? Number(length) : undefined;
    if (expectedSize !== undefined && expectedSize > maxJsonBytes) {
      throw new Error('request entity too large');
    }
    if (!encodingExists(charset)) {
      decoder?.destroy();
      throw new Error(unsupportedCharset);
    }

    const source = body ?? new Blob().stream();
    const stream = decoder
      ? source.pipeThrough(
          Duplex.toWeb(decoder) as unknown as ReadableWritablePair<Uint8Array, Uint8Array>
        )
      : source;
    const bytes = await readLimitedBody(stream, expectedSize);
    if (bytes.length || length !== undefined || c.req.header('Transfer-Encoding') !== undefined) {
      c.set('jsonBody', parseStrictJson(decode(bytes, charset)));
    }
  }

  await next();
});

function getJsonCharset(header: string | undefined): string | undefined {
  if (!header) return;
  try {
    const mediaType = parse(header);
    if (mediaType.type === 'application/json') {
      return mediaType.parameters.charset?.toLowerCase() || 'utf-8';
    }
  } catch {
    return;
  }
}

function getDecompressor(encoding: string) {
  switch (encoding) {
    case 'identity':
      return;
    case 'gzip':
      return zlib.createGunzip();
    case 'deflate':
      return zlib.createInflate();
    case 'br':
      return zlib.createBrotliDecompress();
    case 'zstd':
      if (zlib.createZstdDecompress) return zlib.createZstdDecompress();
  }
  throw new Error(`unsupported content encoding "${encoding}"`);
}

async function readLimitedBody(stream: ReadableStream<Uint8Array>, expectedSize?: number) {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxJsonBytes) {
        void reader.cancel().catch(() => undefined);
        throw new Error('request entity too large');
      }
      chunks.push(value);
    }
  } catch (error) {
    // The stream adapter wraps decompression errors in a TypeError with an empty message.
    if (error instanceof TypeError && !error.message && error.cause instanceof Error) {
      throw error.cause;
    }
    throw error;
  } finally {
    reader.releaseLock();
  }

  if (expectedSize !== undefined && size !== expectedSize) {
    throw new Error('request size did not match content length');
  }
  return Buffer.concat(chunks, size);
}

function parseStrictJson(text: string): unknown {
  if (text.length === 0) return {};

  const first = text.search(/[^ \t\r\n]/);
  if (first === -1 || text[first] === '{' || text[first] === '[') {
    return JSON.parse(text) as unknown;
  }

  // Force a syntax error at the first token to keep the development error message.
  const invalidJson = text.slice(0, first) + '#'.repeat(text.length - first);
  try {
    return JSON.parse(invalidJson) as unknown;
  } catch (error) {
    if (error instanceof SyntaxError) {
      const message = error.message.replace(/#+/g, (match) =>
        text.slice(first, first + match.length)
      );
      throw new SyntaxError(message, { cause: error });
    }
    throw error;
  }
}
