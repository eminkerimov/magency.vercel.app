import { apiRequest } from "./client";

export const getArticleHelpfulness = (articleId, signal) =>
  apiRequest(
    `/api/articles/${encodeURIComponent(String(articleId))}/helpfulness`,
    {
      method: "GET",
      signal,
    }
  );

export const putArticleHelpfulness = (articleId, response, signal) =>
  apiRequest(
    `/api/articles/${encodeURIComponent(String(articleId))}/helpfulness`,
    {
      method: "PUT",
      body: JSON.stringify({ response }),
      signal,
    }
  );
