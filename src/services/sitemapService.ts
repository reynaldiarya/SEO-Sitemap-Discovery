import axios from 'axios';
import * as xml2js from 'xml2js';
import { URL } from 'url';

import { extractKeywords } from '../utils/extractor';
import type {
  ExtractionResponse,
  KeywordResult,
  SitemapIndexResponse,
} from '../types/sitemapTypes';

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
  // Fungsi helper untuk mengubah XML menjadi Object JavaScript
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
   * Mengekstrak data dari URL sitemap.
   * Bisa menghandle sitemap biasa (urlset) atau sitemap index (list of sitemaps).
   */
  public async extractSitemap(
    sitemapUrl: string
  ): Promise<ExtractionResponse | SitemapIndexResponse> {
    const response = await axios.get(sitemapUrl);
    const result = (await this.parseXml(response.data)) as ParsedSitemap;

    // Jika ini adalah sitemap index (kumpulan sitemap lain)
    if (result.sitemapindex && result.sitemapindex.sitemap) {
      return {
        message: 'This is a sitemap index.',
        type: 'sitemapindex',
        sitemaps: result.sitemapindex.sitemap.map((s) => s.loc[0]).filter((s): s is string => !!s),
      };
    }

    // Jika ini sitemap standar (berisi URL artikel/halaman)
    if (result.urlset && result.urlset.url) {
      return this.processUrlSet(result.urlset.url);
    }

    throw new Error('Invalid sitemap format');
  }

  /**
   * Memproses daftar URL dari sitemap untuk mengambil keyword.
   */
  private processUrlSet(entries: SitemapUrlEntry[]): ExtractionResponse {
    const urls: string[] = [];
    entries.forEach((entry) => {
      // Ambil URL dari tag <loc>
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

        // Ekstrak keyword dari slug URL
        if (path) {
          const phrase = extractKeywords(path);

          if (phrase) {
            // Hitung frekuensi keyword
            phraseCounts[phrase] = (phraseCounts[phrase] || 0) + 1;
          } else {
            ignoredCount++;
          }
        }
      } catch {
        ignoredCount++;
      }
    });

    // Urutkan keyword berdasarkan frekuensi terbanyak
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
