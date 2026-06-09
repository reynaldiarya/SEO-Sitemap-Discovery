/**
 * Utility function to extract keywords from a URL slug.
 */
export function extractKeywords(pathUrl: string | null | undefined): string | null {
  if (!pathUrl || pathUrl === '/') return null; // Ignore homepage

  try {
    pathUrl = decodeURIComponent(pathUrl);
  } catch {
    return null;
  }

  // 1. Remove file extensions (e.g., .html, .php, etc.)
  pathUrl = pathUrl.replace(/\.(html|php|htm|xml|aspx)$/i, '');

  // 2. Split path by slash '/'
  const segments = pathUrl.split('/').filter(Boolean);

  // 3. Retrieve the LAST segment that is not pure numeric (typically representing the article/page title)
  let targetSlug = '';

  for (let i = segments.length - 1; i >= 0; i--) {
    const s = segments[i];
    if (!s) continue;
    // If the segment is numeric (e.g., year /2023/ or ID), skip it and check the preceding segment
    if (!/^\d+$/.test(s)) {
      targetSlug = s;
      break;
    }
  }

  // If no valid slug is found, return null
  if (!targetSlug) return null;

  // 4. Clean the slug to construct a readable phrase
  // Replace symbols (-_+) with spaces
  let readablePhrase = targetSlug.replace(/[-_+?=&]+/g, ' ');
  readablePhrase = readablePhrase.trim().toLowerCase();

  // Filter out common system words that do not represent content keywords
  const ignoreList = new Set(['index', 'default', 'home']);
  if (ignoreList.has(readablePhrase)) return null;

  return readablePhrase;
}
