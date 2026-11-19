import { SITEMAP_URLS_MEDIA_TYPE } from '../types/index.js';
import type {
  DiscoveryRequest,
  DiscoveryResponse,
  SitemapIndexResponse,
  SitemapRequest,
  UrlExtractionResponse,
} from '../types/index.js';

type SitemapApi = {
  '/sitemap/discovery': { body: DiscoveryRequest; result: DiscoveryResponse };
  '/sitemap/extract': {
    body: SitemapRequest;
    result: UrlExtractionResponse | SitemapIndexResponse;
  };
};

type ToolState = 'idle' | 'loading' | 'error' | 'empty' | 'success';

const form = getElement('discovery-form', HTMLFormElement);
const website = getElement('website-url', HTMLInputElement);
const discoverButton = getElement('discover-button', HTMLButtonElement);
const discoverLabel = getElement('discover-label', HTMLSpanElement);
const discoveryStatus = getElement('discovery-status', HTMLParagraphElement);
const sitemapList = getElement('sitemaps', HTMLUListElement);
const extractStatus = getElement('extract-status', HTMLParagraphElement);
const urlOutput = getElement('urls', HTMLTextAreaElement);
const keywordResults = getElement('keyword-results', HTMLDivElement);
const keywordOutput = getElement('keywords', HTMLTextAreaElement);
const keywordEmpty = getElement('keyword-empty', HTMLParagraphElement);

const initialDiscoveryStatus = discoveryStatus.textContent ?? '';
const initialExtractStatus = extractStatus.textContent ?? '';
const sitemapFeedback = document.createElement('p');
sitemapFeedback.className = 'tool-status sitemap-feedback';
let selectedSitemap: HTMLButtonElement | undefined;
let pendingExtraction: AbortController | undefined;

discoverButton.disabled = false;

website.addEventListener('input', () => {
  if (website.readOnly || discoveryStatus.dataset.state === 'idle') return;
  website.removeAttribute('aria-invalid');
  resetResults();
  setStatus(discoveryStatus, 'idle', initialDiscoveryStatus);
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (discoverButton.getAttribute('aria-disabled') === 'true') return;
  resetResults();

  let domain: string;
  try {
    domain = websiteUrl(website.value.trim());
  } catch {
    website.setAttribute('aria-invalid', 'true');
    setStatus(discoveryStatus, 'error', 'Enter a website URL or domain, such as example.com.');
    website.focus();
    return;
  }

  setStatus(discoveryStatus, 'loading', 'Checking robots.txt and common sitemap paths…');
  website.readOnly = true;
  discoverButton.setAttribute('aria-disabled', 'true');
  discoverLabel.textContent = 'Discovering…';

  try {
    const { sitemaps } = await post('/sitemap/discovery', { domain });
    const count = showSitemaps(sitemapList, sitemaps);
    if (count === 0) {
      setStatus(
        discoveryStatus,
        'empty',
        'No sitemaps found. Check the address or try another website.'
      );
      return;
    }
    const summary = count === 1 ? '1 sitemap found.' : `${count} sitemaps found.`;
    setStatus(discoveryStatus, 'success', `${summary} Choose one to extract its URLs.`);
  } catch (error) {
    setStatus(
      discoveryStatus,
      'error',
      errorMessage(error, 'Discovery failed. Check the address and try again.')
    );
  } finally {
    website.readOnly = false;
    discoverButton.removeAttribute('aria-disabled');
    discoverLabel.textContent = 'Discover sitemaps';
  }
});

function showSitemaps(
  list: HTMLUListElement,
  sitemaps: string[],
  ancestors: string[] = []
): number {
  const entries = [...new Set(sitemaps)].filter((url) => !ancestors.includes(url));
  const items = document.createDocumentFragment();

  for (const url of entries) {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sitemap-choice';

    const label = document.createElement('span');
    label.textContent = url;
    const arrow = document.createElement('span');
    arrow.className = 'arrow-mark';
    arrow.setAttribute('aria-hidden', 'true');
    button.append(label, arrow);
    button.addEventListener('click', () => void extract(url, button, ancestors));
    item.append(button);
    items.append(item);
  }

  list.replaceChildren(items);
  list.hidden = entries.length === 0;
  return entries.length;
}

async function extract(sitemapUrl: string, button: HTMLButtonElement, ancestors: string[]) {
  if (pendingExtraction && selectedSitemap === button) return;
  pendingExtraction?.abort();
  const request = new AbortController();
  pendingExtraction = request;
  selectedSitemap?.removeAttribute('aria-current');
  selectedSitemap = button;
  button.setAttribute('aria-current', 'true');
  clearExtraction();
  button.after(sitemapFeedback);
  setExtractionStatus('loading', 'Reading the selected sitemap…');
  if (matchMedia('(width < 40rem)').matches) {
    sitemapFeedback.scrollIntoView({ block: 'nearest' });
  }

  try {
    const result = await post('/sitemap/extract', { sitemapUrl }, request.signal);
    if (request.signal.aborted) return;

    if (result.type === 'sitemapindex') {
      const branch =
        button.parentElement?.querySelector<HTMLUListElement>(':scope > ul') ??
        document.createElement('ul');
      branch.className = 'sitemap-children';
      sitemapFeedback.after(branch);
      const count = showSitemaps(branch, result.sitemaps, [...ancestors, sitemapUrl]);
      setExtractionStatus(
        count ? 'success' : 'empty',
        count
          ? 'This is a sitemap index. Choose a sitemap from the indented list.'
          : 'This index has no additional sitemaps.'
      );
      return;
    }

    const count = result.urls.length;
    if (count === 0) {
      setExtractionStatus('empty', 'This sitemap lists no page URLs.');
      return;
    }

    urlOutput.value = result.urls.join('\n');
    urlOutput.hidden = false;
    const keywords = Array.isArray(result.keywordLists)
      ? result.keywordLists.join('\n')
      : (result.keywordLists ?? '');
    keywordOutput.value = keywords;
    keywordOutput.hidden = !keywords;
    keywordEmpty.hidden = Boolean(keywords);
    keywordResults.hidden = false;

    const summary =
      count === 1 ? '1 URL extracted.' : `${count.toLocaleString('en')} URLs extracted.`;
    setExtractionStatus('success', summary);

    const link = document.createElement('a');
    link.href = '#urls-heading';
    link.textContent = 'View URLs and keywords';
    sitemapFeedback.replaceChildren(link);
    sitemapFeedback.removeAttribute('aria-hidden');
  } catch (error) {
    if (!request.signal.aborted) {
      setExtractionStatus(
        'error',
        errorMessage(error, 'Could not read this sitemap. Try again or choose another.')
      );
    }
  } finally {
    if (pendingExtraction === request) pendingExtraction = undefined;
  }
}

function resetResults() {
  pendingExtraction?.abort();
  pendingExtraction = undefined;
  selectedSitemap = undefined;
  sitemapList.replaceChildren();
  sitemapList.hidden = true;
  clearExtraction();
  setStatus(extractStatus, 'idle', initialExtractStatus);
}

function clearExtraction() {
  urlOutput.value = '';
  urlOutput.hidden = true;
  keywordOutput.value = '';
  keywordResults.hidden = true;
}

function setExtractionStatus(state: ToolState, message: string) {
  setStatus(extractStatus, state, message);
  setStatus(sitemapFeedback, state, message);
  sitemapFeedback.setAttribute('aria-hidden', 'true');
}

function websiteUrl(value: string): string {
  const hasScheme = /^[a-z][a-z\d+.-]*:\/\//i.test(value);
  const url = new URL(hasScheme ? value : `https://${value}`);
  if (!['http:', 'https:'].includes(url.protocol) || (!hasScheme && !url.hostname.includes('.'))) {
    throw new Error('Invalid website URL');
  }
  return url.href;
}

async function post<Path extends keyof SitemapApi>(
  path: Path,
  body: SitemapApi[Path]['body'],
  signal?: AbortSignal
): Promise<SitemapApi[Path]['result']> {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: path === '/sitemap/extract' ? SITEMAP_URLS_MEDIA_TYPE : 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.ok) throw new ApiError(response.status);
  return response.json() as Promise<SitemapApi[Path]['result']>;
}

class ApiError extends Error {
  constructor(readonly status: number) {
    super(`API returned HTTP ${status}`);
  }
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.status === 504) return 'The request timed out. Try again.';
  if (error instanceof TypeError)
    return 'Could not reach the server. Check your connection and try again.';
  return fallback;
}

function setStatus(element: HTMLParagraphElement, state: ToolState, message: string) {
  element.dataset.state = state;
  element.textContent = message;
}

function getElement<Element extends HTMLElement>(
  id: string,
  elementType: new () => Element
): Element {
  const element = document.getElementById(id);
  if (!(element instanceof elementType)) throw new Error(`Missing or invalid element #${id}`);
  return element;
}
