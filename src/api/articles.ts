import { request } from "./client";
import { MultipleArticlesResponse, SingleArticleResponse } from "./types";

export type ArticleListQuery = {
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
};

function toQuery(params: ArticleListQuery): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getArticles(params: ArticleListQuery = {}): Promise<MultipleArticlesResponse> {
  return request(`/articles${toQuery(params)}`);
}

export function getArticle(slug: string): Promise<SingleArticleResponse> {
  return request(`/articles/${encodeURIComponent(slug)}`);
}

export function favoriteArticle(slug: string): Promise<SingleArticleResponse> {
  return request(`/articles/${encodeURIComponent(slug)}/favorite`, { method: "POST" });
}

export function unfavoriteArticle(slug: string): Promise<SingleArticleResponse> {
  return request(`/articles/${encodeURIComponent(slug)}/favorite`, { method: "DELETE" });
}
