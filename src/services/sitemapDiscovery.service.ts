import axios from 'axios';
import { URL } from 'url';

import { logger } from '../utils';
import type { DiscoveryResponse } from '../types';

export class SitemapDiscoveryService {
  private commonPaths = [
    '/sitemap.xml',
    '/sitemap_index.xml',
    '/sitemap-index.xml',
    '/sitemap/sitemap.xml',
    '/sitemap/index.xml',
    '/wp-sitemap.xml',
    '/sitemap.txt',
    '/sitemap.php',
    '/feed',
    '/rss',
    '/atom',
  ];

  /**
   * Discovers sitemaps for a given domain or URL.
   */
  public async discoverSitemaps(input: string): Promise<DiscoveryResponse> {
    const targetUrl = this.normalizeUrl(input);
    const parsedUrl = new URL(targetUrl);
    const rootUrl = parsedUrl.origin;

    const foundSitemaps = new Set<string>();
    const checkedPaths: DiscoveryResponse['checkedPaths'] = [];

    // 1. Check robots.txt (Always at root)
    await this.checkRobotsTxt(rootUrl, foundSitemaps, checkedPaths);

    // 2. Check common paths at Root
    await this.checkCommonPaths(rootUrl, foundSitemaps, checkedPaths);

    // 3. Check common paths at Target URL (if different from root)
    // E.g. input is example.com/blog -> we checked example.com/sitemap.xml above
    // Now check example.com/blog/sitemap.xml
    if (targetUrl !== rootUrl) {
      logger.info(`Checking additional paths for subdirectory: ${targetUrl}`);
      await this.checkCommonPaths(targetUrl, foundSitemaps, checkedPaths);
    }

    return {
      domain: targetUrl,
      sitemaps: Array.from(foundSitemaps),
      checkedPaths,
    };
  }

  private async checkRobotsTxt(
    baseUrl: string,
    foundSitemaps: Set<string>,
    checkedPaths: DiscoveryResponse['checkedPaths']
  ) {
    try {
      const robotsUrl = new URL('/robots.txt', baseUrl).toString();
      logger.info(`Checking robots.txt at: ${robotsUrl}`);

      const response = await axios.get(robotsUrl, {
        timeout: 10000,
        validateStatus: () => true,
      });

      checkedPaths.push({
        url: robotsUrl,
        found: response.status === 200,
        status: response.status,
      });

      if (response.status === 200 && typeof response.data === 'string') {
        const robotsSitemaps = this.parseRobotsTxt(response.data);
        robotsSitemaps.forEach((s) => foundSitemaps.add(s));
      }
    } catch (error) {
      logger.error(
        `Error checking robots.txt: ${error instanceof Error ? error.message : String(error)}`
      );
      checkedPaths.push({
        url: `${baseUrl}/robots.txt`,
        found: false,
        status: 0,
      });
    }
  }

  private async checkCommonPaths(
    baseUrl: string,
    foundSitemaps: Set<string>,
    checkedPaths: DiscoveryResponse['checkedPaths']
  ) {
    await Promise.all(
      this.commonPaths.map(async (path) => {
        // Ensure path starts with / if we are appending to a base that doesn't end with /
        // URL constructor handles this well usually, but let's be safe.
        // new URL('/sitemap.xml', 'https://example.com/blog') -> https://example.com/sitemap.xml (ROOT relative if starts with /)
        // Wait, if we want https://example.com/blog/sitemap.xml, we need correct relative resolution.

        let sitemapUrl: string;
        if (path.startsWith('/')) {
          // If path is absolute path like /sitemap.xml, URL(path, baseUrl) will go to root.
          // If baseUrl is https://example.com/blog and path is /sitemap.xml -> https://example.com/sitemap.xml
          // If we want relative to directory, we shouldn't start with /.
          // HOWEVER, existing commonPaths all start with /.
          // So we must handle string concatenation manually to ensure it appends to the full baseUrl path

          const cleanBase = baseUrl.replace(/\/$/, '');
          sitemapUrl = `${cleanBase}${path}`;
        } else {
          sitemapUrl = new URL(path, baseUrl).toString();
        }

        // Skip if we already found this exactly
        if (foundSitemaps.has(sitemapUrl)) return;

        try {
          const response = await axios.head(sitemapUrl, {
            timeout: 5000,
            validateStatus: (status) => status === 200,
          });

          const isFound = response.status === 200;

          checkedPaths.push({
            url: sitemapUrl,
            found: isFound,
            status: response.status,
          });

          if (isFound) {
            foundSitemaps.add(sitemapUrl);
          }
        } catch {
          checkedPaths.push({
            url: sitemapUrl,
            found: false,
            status: 0,
          });
        }
      })
    );
  }

  private normalizeUrl(input: string): string {
    let url = input.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    // Remove trailing slash if present
    return url.replace(/\/$/, '');
  }

  private parseRobotsTxt(content: string): string[] {
    const sitemaps: string[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      // Case insensitive check for "Sitemap:"
      if (/^sitemap:\s*/i.test(trimmed)) {
        // Extract the URL part
        const parts = trimmed.split(/:\s+/);
        if (parts.length >= 2) {
          // Join back the rest parts in case URL has colons (it does)
          // Actually, 'Sitemap: http://...' -> parts=['Sitemap', 'http://...']
          // But wait, split by ': ' might be fragile if there are multiple spaces or tab.
          // Better regex extraction.
          const match = trimmed.match(/^sitemap:\s*(.+)$/i);
          if (match && match[1]) {
            sitemaps.push(match[1].trim());
          }
        }
      }
    }
    return sitemaps;
  }
}

export const sitemapDiscoveryService = new SitemapDiscoveryService();
