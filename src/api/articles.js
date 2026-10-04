import { apiRequest } from "./client";

export const getArticles = (signal) =>
  apiRequest("/api/articles", {
    method: "GET",
    signal,
  });

export const getArticle = (id, signal) =>
  apiRequest(`/api/articles/${encodeURIComponent(String(id))}`, {
    method: "GET",
    signal,
  });

export const getCategories = (signal) =>
  apiRequest("/api/categories", {
    method: "GET",
    signal,
  });
