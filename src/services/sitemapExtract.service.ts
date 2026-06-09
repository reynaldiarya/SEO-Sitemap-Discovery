import axios from 'axios';
import * as xml2js from 'xml2js';
import { URL } from 'url';

import { extractKeywords } from '../utils';
import type { ExtractionResponse, KeywordResult, SitemapIndexResponse } from '../types';

interface SitemapUrlEntry {
  loc: string[];
}

interface SitemapIndexEntry {
  loc: string[];
}

interface ParsedSitemap {
  urlset?: {
    url?: SitemapUrlEntry[];
  };
  sitemapindex?: {
    sitemap?: SitemapIndexEntry[];
  };
}

export class SitemapService {
  // Helper function to parse XML data into a JavaScript object
  private parseXml(xmlData: string): Promise<unknown> {
    const parser = new xml2js.Parser();
    return new Promise((resolve, reject) => {
      parser.parseString(xmlData, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  /**
   * Extracts data from a sitemap URL.
   * Handles standard sitemaps (urlset) or sitemap indexes (list of sitemaps).
   */
  public async extractSitemap(
    sitemapUrl: string
  ): Promise<ExtractionResponse | SitemapIndexResponse> {
    const response = await axios.get(sitemapUrl);
    const result = (await this.parseXml(response.data)) as ParsedSitemap;

    // If the sitemap is a sitemap index (a collection of other sitemaps)
    if (result.sitemapindex && result.sitemapindex.sitemap) {
      return {
        message: 'This is a sitemap index.',
        type: 'sitemapindex',
        sitemaps: result.sitemapindex.sitemap.map((s) => s.loc[0]).filter((s): s is string => !!s),
      };
    }

    // If the sitemap is a standard sitemap (containing page/article URLs)
    if (result.urlset && result.urlset.url) {
      return this.processUrlSet(result.urlset.url);
    }

    throw new Error('Invalid sitemap format');
  }

  /**
   * Processes a list of URLs from a sitemap to extract keywords.
   */
  private processUrlSet(entries: SitemapUrlEntry[]): ExtractionResponse {
    const urls: string[] = [];
    entries.forEach((entry) => {
      // Extract the URL from the <loc> tag
      if (entry.loc && entry.loc[0]) {
        urls.push(entry.loc[0]);
      }
    });

    const phraseCounts: Record<string, number> = {};
    let ignoredCount = 0;

    urls.forEach((u) => {
      try {
        const parsedUrl = new URL(u);
        const path = parsedUrl.pathname;

        // Extract keywords from the URL slug
        if (path) {
          const phrase = extractKeywords(path);

          if (phrase) {
            // Calculate keyword frequency
            phraseCounts[phrase] = (phraseCounts[phrase] || 0) + 1;
          } else {
            ignoredCount++;
          }
        }
      } catch {
        ignoredCount++;
      }
    });

    // Sort keywords by frequency in descending order
    const sortedPhrases: KeywordResult[] = Object.entries(phraseCounts)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count);

    const keywordList = sortedPhrases.map((k) => k.keyword);

    return {
      type: 'extraction',
      totalUrls: urls.length,
      extractedKeywords: sortedPhrases.length,
      ignoredUrls: ignoredCount,
      keywordLists: keywordList,
    };
  }
}

export const sitemapService = new SitemapService();
