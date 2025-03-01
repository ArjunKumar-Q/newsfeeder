export interface NewsArticle {
  source: {
    id: string | null; // Can be null if the source doesn't have an ID
    name: string;
  };
  author: string | null; // Can be null if author is unknown
  title: string;
  description: string;
  url: string;
  urlToImage: string | null; // Can be null if there's no image
  publishedAt: string; // ISO 8601 date string
  content: string | null; // Can be null if content is not available
}

export type NewsContextState = {
  lang: string;
  search: string;
  category: string | null;
};
