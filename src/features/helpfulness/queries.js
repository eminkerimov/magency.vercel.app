import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getArticleHelpfulness,
  putArticleHelpfulness,
} from "../../api/helpfulness";

export const HELPFULNESS_STORAGE_KEY =
  "magency:v1:article-helpfulness";

export const helpfulnessQueryKeys = {
  all: ["article-helpfulness"],
  article: (articleId) => [
    "article-helpfulness",
    String(articleId ?? ""),
  ],
};

export const helpfulnessMutationKeys = {
  article: (articleId) => [
    "article-helpfulness",
    "write",
    String(articleId ?? ""),
  ],
};

const normalizeArticleId = (articleId) =>
  String(articleId ?? "").trim();

const emptyEnvelope = (articleId) => ({
  data: {
    articleId: Number(articleId),
    response: null,
    updatedAt: null,
  },
  meta: {
    persistence: "browser-local",
  },
});

export const useArticleHelpfulnessQuery = (articleId) => {
  const normalizedArticleId = normalizeArticleId(articleId);

  return useQuery({
    queryKey: helpfulnessQueryKeys.article(normalizedArticleId),
    queryFn: ({ signal }) =>
      getArticleHelpfulness(normalizedArticleId, signal),
    enabled: Boolean(normalizedArticleId),
    retry: (failureCount, error) =>
      !(error?.status >= 400 && error?.status < 500) &&
      failureCount < 1,
    refetchOnWindowFocus: true,
    select: (result) => result.data,
  });
};

export const useSetArticleHelpfulnessMutation = (articleId) => {
  const queryClient = useQueryClient();
  const normalizedArticleId = normalizeArticleId(articleId);
  const queryKey = helpfulnessQueryKeys.article(normalizedArticleId);
  const mutationKey =
    helpfulnessMutationKeys.article(normalizedArticleId);

  return useMutation({
    mutationKey,
    mutationFn: (response) =>
      putArticleHelpfulness(normalizedArticleId, response),
    onMutate: async (response) => {
      await queryClient.cancelQueries({ queryKey });

      const previousResponse = queryClient.getQueryData(queryKey);
      const currentResponse =
        previousResponse || emptyEnvelope(normalizedArticleId);

      queryClient.setQueryData(queryKey, {
        ...currentResponse,
        data: {
          articleId: Number(normalizedArticleId),
          response,
          updatedAt: new Date().toISOString(),
        },
        meta: {
          ...(currentResponse.meta || {}),
          optimistic: true,
        },
      });

      return { previousResponse };
    },
    onError: (_error, _response, context) => {
      queryClient.setQueryData(
        queryKey,
        context?.previousResponse ||
          emptyEnvelope(normalizedArticleId)
      );
    },
    onSuccess: (response) => {
      queryClient.setQueryData(queryKey, response);
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey }) === 1) {
        return queryClient.invalidateQueries({ queryKey });
      }
    },
    scope: {
      id: "article-helpfulness:" + normalizedArticleId,
    },
  });
};
