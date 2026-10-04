import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  getComments,
} from "../../api/comments";
import { articleQueryKeys } from "../articles/queries";
import { bookmarkQueryKeys } from "../bookmarks/queries";

export const COMMENTS_STORAGE_KEY = "magency:v1:comments";

export const commentQueryKeys = {
  all: ["comments"],
  article: (articleId) => ["comments", "article", String(articleId)],
};

export const commentMutationKeys = {
  all: ["comments", "write"],
  article: (articleId) => ["comments", "write", String(articleId)],
};

const normalizeArticleId = (articleId) => String(articleId ?? "").trim();

const patchArticle = (article, articleId, commentCount) => {
  if (!article || Number(article.id) !== Number(articleId)) return article;

  return {
    ...article,
    commentCount,
  };
};

const patchArticleEnvelope = (response, articleId, commentCount) => {
  if (!response || !Number.isFinite(commentCount)) return response;

  const patchItem = (item) => {
    if (!item || typeof item !== "object") return item;

    if (item.latestArticle) {
      return {
        ...item,
        latestArticle: patchArticle(
          item.latestArticle,
          articleId,
          commentCount
        ),
      };
    }

    return patchArticle(item, articleId, commentCount);
  };
  const currentMeta = response.meta || {};
  const nextMeta = { ...currentMeta };

  if ("previousArticle" in currentMeta) {
    nextMeta.previousArticle = patchArticle(
      currentMeta.previousArticle,
      articleId,
      commentCount
    );
  }

  if ("nextArticle" in currentMeta) {
    nextMeta.nextArticle = patchArticle(
      currentMeta.nextArticle,
      articleId,
      commentCount
    );
  }

  if (Array.isArray(currentMeta.relatedArticles)) {
    nextMeta.relatedArticles = currentMeta.relatedArticles.map((article) =>
      patchArticle(article, articleId, commentCount)
    );
  }

  return {
    ...response,
    data: Array.isArray(response.data)
      ? response.data.map(patchItem)
      : patchItem(response.data),
    meta: nextMeta,
  };
};

const patchBookmarkEnvelope = (response, articleId, commentCount) => {
  if (!response || !Number.isFinite(commentCount)) return response;

  return {
    ...response,
    data: Array.isArray(response.data)
      ? response.data.map((bookmark) => ({
          ...bookmark,
          article: patchArticle(
            bookmark.article,
            articleId,
            commentCount
          ),
        }))
      : response.data,
  };
};

const patchArticleCaches = (queryClient, articleId, commentCount) => {
  if (!Number.isFinite(commentCount)) return;

  queryClient.setQueriesData(
    { queryKey: articleQueryKeys.all },
    (response) =>
      patchArticleEnvelope(response, articleId, commentCount)
  );
  queryClient.setQueryData(bookmarkQueryKeys.all, (response) =>
    patchBookmarkEnvelope(response, articleId, commentCount)
  );
};

const addCommentToResponse = (current, response) => {
  if (!current) return current;

  const currentComments = Array.isArray(current.data) ? current.data : [];
  const nextComments = [
    response.data,
    ...currentComments.filter((comment) => comment.id !== response.data.id),
  ];

  return {
    ...current,
    data: nextComments,
    meta: {
      ...(current.meta || {}),
      ...(response.meta || {}),
      returned: nextComments.length,
    },
  };
};

const removeCommentFromResponse = (
  current,
  commentId,
  authoritativeMeta
) => {
  if (!current) return current;

  const currentComments = Array.isArray(current.data) ? current.data : [];
  const nextComments = currentComments.filter(
    (comment) => String(comment.id) !== String(commentId)
  );

  return {
    ...current,
    data: nextComments,
    meta: {
      ...(current.meta || {}),
      ...(authoritativeMeta || {}),
      returned: nextComments.length,
    },
  };
};

const createOptimisticDeleteResponse = (current, commentId) => {
  if (!current || !Array.isArray(current.data)) {
    return { response: current, removed: false, total: null };
  }

  const comment = current.data.find(
    (item) => String(item.id) === String(commentId)
  );

  if (!comment?.viewerOwned) {
    return { response: current, removed: false, total: null };
  }

  const baselineTotal = Number(current.meta?.baselineTotal) || 0;
  const currentTotal = Number(current.meta?.total);
  const total = Number.isFinite(currentTotal)
    ? Math.max(baselineTotal, currentTotal - 1)
    : null;
  const localTotal = Number(current.meta?.localTotal);
  const nextResponse = removeCommentFromResponse(current, commentId, {
    ...(current.meta || {}),
    total: total ?? current.meta?.total,
    localTotal: Number.isFinite(localTotal)
      ? Math.max(0, localTotal - 1)
      : current.meta?.localTotal,
  });

  return { response: nextResponse, removed: true, total };
};

const cancelRelatedQueries = async (queryClient, articleId) => {
  await Promise.all([
    queryClient.cancelQueries({
      queryKey: commentQueryKeys.article(articleId),
    }),
    queryClient.cancelQueries({ queryKey: articleQueryKeys.all }),
    queryClient.cancelQueries({ queryKey: bookmarkQueryKeys.all }),
  ]);
};

const invalidateRelatedQueries = (queryClient, articleId) =>
  Promise.all([
    queryClient.invalidateQueries({
      queryKey: commentQueryKeys.article(articleId),
    }),
    queryClient.invalidateQueries({ queryKey: articleQueryKeys.all }),
    queryClient.invalidateQueries({ queryKey: bookmarkQueryKeys.all }),
  ]);

export const useCommentsQuery = (articleId) => {
  const normalizedArticleId = normalizeArticleId(articleId);

  return useQuery({
    queryKey: commentQueryKeys.article(normalizedArticleId),
    queryFn: ({ signal }) => getComments(normalizedArticleId, signal),
    enabled: Boolean(normalizedArticleId),
    retry: (failureCount, error) =>
      !(error?.status >= 400 && error?.status < 500) &&
      failureCount < 1,
    refetchOnWindowFocus: true,
    select: (response) => ({
      comments: Array.isArray(response.data) ? response.data : [],
      meta: response.meta || {},
    }),
  });
};

export const useCommentsMutationsPending = (articleId) =>
  useIsMutating({
    mutationKey: commentMutationKeys.article(
      normalizeArticleId(articleId)
    ),
  }) > 0;

export const useCreateCommentMutation = (articleId) => {
  const queryClient = useQueryClient();
  const normalizedArticleId = normalizeArticleId(articleId);
  const mutationKey = commentMutationKeys.article(normalizedArticleId);

  return useMutation({
    mutationKey,
    mutationFn: (comment) =>
      createComment(normalizedArticleId, comment),
    onSuccess: (response) => {
      queryClient.setQueryData(
        commentQueryKeys.article(normalizedArticleId),
        (current) => addCommentToResponse(current, response)
      );
      patchArticleCaches(
        queryClient,
        normalizedArticleId,
        Number(response.meta?.total)
      );
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        return invalidateRelatedQueries(
          queryClient,
          normalizedArticleId
        );
      }
    },
    scope: { id: "comments:" + normalizedArticleId },
  });
};

export const useDeleteCommentMutation = (articleId) => {
  const queryClient = useQueryClient();
  const normalizedArticleId = normalizeArticleId(articleId);
  const mutationKey = commentMutationKeys.article(normalizedArticleId);

  return useMutation({
    mutationKey,
    mutationFn: (commentId) =>
      deleteComment(normalizedArticleId, commentId),
    onMutate: async (commentId) => {
      await cancelRelatedQueries(queryClient, normalizedArticleId);

      const commentKey = commentQueryKeys.article(normalizedArticleId);
      const previousComments = queryClient.getQueryData(commentKey);
      const optimistic = createOptimisticDeleteResponse(
        previousComments,
        commentId
      );

      if (optimistic.removed) {
        queryClient.setQueryData(commentKey, optimistic.response);
        patchArticleCaches(
          queryClient,
          normalizedArticleId,
          optimistic.total
        );
      }

      return { previousComments };
    },
    onError: (_error, _commentId, context) => {
      queryClient.setQueryData(
        commentQueryKeys.article(normalizedArticleId),
        context?.previousComments
      );
      patchArticleCaches(
        queryClient,
        normalizedArticleId,
        Number(context?.previousComments?.meta?.total)
      );
    },
    onSuccess: (response) => {
      queryClient.setQueryData(
        commentQueryKeys.article(normalizedArticleId),
        (current) =>
          removeCommentFromResponse(
            current,
            response.data.id,
            response.meta
          )
      );
      patchArticleCaches(
        queryClient,
        normalizedArticleId,
        Number(response.meta?.total)
      );
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        return invalidateRelatedQueries(
          queryClient,
          normalizedArticleId
        );
      }
    },
    scope: { id: "comments:" + normalizedArticleId },
  });
};
