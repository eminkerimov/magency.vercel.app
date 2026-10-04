import { apiRequest } from "./client";

export const getBookmarks = (signal) =>
  apiRequest("/api/bookmarks", {
    method: "GET",
    signal,
  });

export const saveBookmark = (articleId, signal) =>
  apiRequest(`/api/bookmarks/${encodeURIComponent(String(articleId))}`, {
    method: "PUT",
    signal,
  });

export const removeBookmark = (articleId, signal) =>
  apiRequest(`/api/bookmarks/${encodeURIComponent(String(articleId))}`, {
    method: "DELETE",
    signal,
  });
