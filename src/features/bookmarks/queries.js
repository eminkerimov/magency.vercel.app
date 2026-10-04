import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getBookmarks,
  removeBookmark,
  saveBookmark,
} from "../../api/bookmarks";

export const bookmarkQueryKeys = {
  all: ["bookmarks"],
};

export const bookmarkMutationKeys = {
  all: ["bookmarks", "write"],
};

export const BOOKMARKS_STORAGE_KEY = "magency:v1:bookmarks";

const emptyBookmarksResponse = () => ({
  data: [],
  meta: { total: 0 },
});

const normalizeBookmarkVariables = (value) => {
  if (value && typeof value === "object" && "articleId" in value) {
    return {
      articleId: Number(value.articleId),
      article: value.article || null,
    };
  }

  if (value && typeof value === "object" && "id" in value) {
    return {
      articleId: Number(value.id),
      article: value,
    };
  }

  return {
    articleId: Number(value),
    article: null,
  };
};

const replaceBookmark = (response, bookmark) => {
  const currentResponse = response || emptyBookmarksResponse();
  const currentBookmarks = Array.isArray(currentResponse.data)
    ? currentResponse.data
    : [];
  const existingIndex = currentBookmarks.findIndex(
    (item) => item.articleId === bookmark.articleId
  );
  const nextBookmarks = [...currentBookmarks];

  if (existingIndex >= 0) {
    nextBookmarks[existingIndex] = bookmark;
  } else {
    nextBookmarks.unshift(bookmark);
  }

  return {
    ...currentResponse,
    data: nextBookmarks,
    meta: {
      ...(currentResponse.meta || {}),
      total: nextBookmarks.length,
    },
  };
};

const excludeBookmark = (response, articleId, total) => {
  const currentResponse = response || emptyBookmarksResponse();
  const nextBookmarks = (currentResponse.data || []).filter(
    (bookmark) => bookmark.articleId !== articleId
  );

  return {
    ...currentResponse,
    data: nextBookmarks,
    meta: {
      ...(currentResponse.meta || {}),
      total: total ?? nextBookmarks.length,
    },
  };
};

const prepareOptimisticUpdate = async (queryClient) => {
  await queryClient.cancelQueries({ queryKey: bookmarkQueryKeys.all });

  return (
    queryClient.getQueryData(bookmarkQueryKeys.all) || emptyBookmarksResponse()
  );
};

export const useBookmarksQuery = () =>
  useQuery({
    queryKey: bookmarkQueryKeys.all,
    queryFn: ({ signal }) => getBookmarks(signal),
    refetchOnWindowFocus: true,
    select: (response) => response.data,
  });

export const useBookmarkMutationsPending = () =>
  useIsMutating({ mutationKey: bookmarkMutationKeys.all }) > 0;

export const useSaveBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: bookmarkMutationKeys.all,
    mutationFn: (value) => {
      const { articleId } = normalizeBookmarkVariables(value);
      return saveBookmark(articleId);
    },
    onMutate: async (value) => {
      const previousBookmarks = await prepareOptimisticUpdate(queryClient);
      const { articleId, article } = normalizeBookmarkVariables(value);

      queryClient.setQueryData(
        bookmarkQueryKeys.all,
        replaceBookmark(previousBookmarks, {
          articleId,
          savedAt: new Date().toISOString(),
          article,
        })
      );

      return { previousBookmarks };
    },
    onError: (_error, _value, context) => {
      queryClient.setQueryData(
        bookmarkQueryKeys.all,
        context?.previousBookmarks || emptyBookmarksResponse()
      );
    },
    onSuccess: (response) => {
      queryClient.setQueryData(bookmarkQueryKeys.all, (current) => {
        const nextResponse = replaceBookmark(current, response.data);

        return {
          ...nextResponse,
          meta: {
            ...nextResponse.meta,
            total: response.meta.total,
          },
        };
      });
    },
    onSettled: () => {
      if (
        queryClient.isMutating({
          mutationKey: bookmarkMutationKeys.all,
        }) === 1
      ) {
        return queryClient.invalidateQueries({
          queryKey: bookmarkQueryKeys.all,
        });
      }
    },
    scope: { id: "bookmarks" },
  });
};

export const useRemoveBookmarkMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: bookmarkMutationKeys.all,
    mutationFn: (value) => {
      const { articleId } = normalizeBookmarkVariables(value);
      return removeBookmark(articleId);
    },
    onMutate: async (value) => {
      const previousBookmarks = await prepareOptimisticUpdate(queryClient);
      const { articleId } = normalizeBookmarkVariables(value);

      queryClient.setQueryData(
        bookmarkQueryKeys.all,
        excludeBookmark(previousBookmarks, articleId)
      );

      return { previousBookmarks };
    },
    onError: (_error, _articleId, context) => {
      queryClient.setQueryData(
        bookmarkQueryKeys.all,
        context?.previousBookmarks || emptyBookmarksResponse()
      );
    },
    onSuccess: (response) => {
      queryClient.setQueryData(bookmarkQueryKeys.all, (current) =>
        excludeBookmark(current, response.data.articleId, response.meta.total)
      );
    },
    onSettled: () => {
      if (
        queryClient.isMutating({
          mutationKey: bookmarkMutationKeys.all,
        }) === 1
      ) {
        return queryClient.invalidateQueries({
          queryKey: bookmarkQueryKeys.all,
        });
      }
    },
    scope: { id: "bookmarks" },
  });
};
