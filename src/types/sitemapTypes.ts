export interface KeywordResult {
  keyword: string;
  count: number;
}

export interface SitemapIndexResponse {
  message: string;
  type: 'sitemapindex';
  sitemaps: string[];
}

export interface ExtractionResponse {
  type: 'extraction';
  totalUrls: number;
  extractedKeywords: number;
  ignoredUrls: number;
  keywordLists?: string | string[];
  error?: string;
  details?: string;
}

export interface SitemapRequest {
  sitemapUrl: string;
  format?: 'json' | 'text';
}
