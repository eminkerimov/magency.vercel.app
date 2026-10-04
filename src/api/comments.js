import { apiRequest } from "./client";

const commentsPath = (articleId) =>
  `/api/articles/${encodeURIComponent(String(articleId))}/comments`;

export const getComments = (articleId, signal) =>
  apiRequest(commentsPath(articleId), {
    method: "GET",
    signal,
  });

export const createComment = (articleId, comment, signal) =>
  apiRequest(commentsPath(articleId), {
    method: "POST",
    body: JSON.stringify(comment),
    signal,
  });

export const deleteComment = (articleId, commentId, signal) =>
  apiRequest(
    `${commentsPath(articleId)}/${encodeURIComponent(String(commentId))}`,
    {
      method: "DELETE",
      signal,
    }
  );
