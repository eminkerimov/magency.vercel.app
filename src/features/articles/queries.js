import { useQuery } from "@tanstack/react-query";
import {
  getArticle,
  getArticles,
  getCategories,
} from "../../api/articles";

export const articleQueryKeys = {
  all: ["articles"],
  detail: (id) => ["articles", "detail", String(id)],
  categories: ["articles", "categories"],
};

export const useArticlesQuery = () =>
  useQuery({
    queryKey: articleQueryKeys.all,
    queryFn: ({ signal }) => getArticles(signal),
    select: (response) => response.data,
  });

export const useArticleQuery = (id) =>
  useQuery({
    queryKey: articleQueryKeys.detail(id),
    queryFn: ({ signal }) => getArticle(id, signal),
    enabled: Boolean(id),
    retry: (failureCount, error) =>
      error?.status !== 404 && failureCount < 1,
    select: ({ data, meta }) => ({
      article: data,
      previousArticle: meta.previousArticle,
      nextArticle: meta.nextArticle,
      relatedArticles: meta.relatedArticles,
    }),
  });

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: articleQueryKeys.categories,
    queryFn: ({ signal }) => getCategories(signal),
    select: (response) => response.data,
  });
