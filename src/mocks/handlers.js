import { delay, http, HttpResponse } from "msw";
import {
  getArticleContent,
  getArticleReadingTime,
} from "../data/articleContent";
import { getAuthorProfile } from "../data/authors";
import { caseStudies } from "../data/caseStudies";
import { getRecentComments } from "../data/comments";
import { articles } from "../data/data";
import { getEngagement } from "../data/engagements";
import {
  addNewsletterSubscriber,
  saveContactReceipt,
} from "./repositories/demoStorage";
import {
  listStoredBookmarks,
  removeStoredBookmark,
  upsertStoredBookmark,
} from "./repositories/bookmarksRepository";
import {
  countStoredComments,
  createStoredComment,
  getCommentsPersistence,
  listStoredComments,
  MAX_LOCAL_COMMENTS_PER_ARTICLE,
  removeStoredComment,
} from "./repositories/commentsRepository";
import {
  getHelpfulnessPersistence,
  getStoredHelpfulness,
  isValidHelpfulnessResponse,
  upsertStoredHelpfulness,
} from "./repositories/helpfulnessRepository";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_PAGE_SIZE = articles.length;
const MAX_PAGE_SIZE = 24;
const API_LATENCY_MS = {
  articles: 320,
  article: 220,
  categories: 180,
  caseStudies: 220,
  bookmarks: 160,
  bookmarkMutation: 220,
  comments: 220,
  commentMutation: 360,
  helpfulness: 160,
  helpfulnessMutation: 260,
};

const toPositiveInteger = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
};

const normalizeCategory = (value) => String(value || "").trim().toLowerCase();

const sortArticles = (items, sort) => {
  const sortedItems = [...items];

  if (sort === "oldest") {
    return sortedItems.sort(
      (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt)
    );
  }

  if (sort === "popular") {
    return sortedItems.sort((a, b) => b.commentCount - a.commentCount);
  }

  if (sort === "readingTime") {
    return sortedItems.sort((a, b) => a.readingTime - b.readingTime);
  }

  if (sort === "title") {
    return sortedItems.sort((a, b) => a.title.localeCompare(b.title));
  }

  return sortedItems.sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
};

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const validationError = (fields) =>
  HttpResponse.json(
    {
      error: {
        code: "VALIDATION_ERROR",
        message: "Please check the highlighted information.",
        fields,
      },
    },
    { status: 422 }
  );

const readBody = async (request) => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

const readJsonPayload = async (request) => {
  try {
    return {
      parsed: true,
      value: await request.json(),
    };
  } catch {
    return {
      parsed: false,
      value: null,
    };
  }
};

const findArticle = (value) => {
  const articleId = Number(value);

  if (!Number.isInteger(articleId) || articleId < 1) return null;
  return articles.find((article) => article.id === articleId) || null;
};

const articleNotFound = (articleId) =>
  HttpResponse.json(
    {
      error: {
        code: "ARTICLE_NOT_FOUND",
        message: `Article ${articleId} was not found.`,
      },
    },
    { status: 404 }
  );

const commentNotFound = (commentId) =>
  HttpResponse.json(
    {
      error: {
        code: "COMMENT_NOT_FOUND",
        message: `Comment ${commentId} was not found.`,
      },
    },
    { status: 404 }
  );

const commentNotOwned = () =>
  HttpResponse.json(
    {
      error: {
        code: "COMMENT_NOT_OWNED",
        message: "Only comments created in this browser can be deleted.",
      },
    },
    { status: 403 }
  );

const toArticleResource = (article) =>
  article
    ? {
        ...article,
        readingTime: getArticleReadingTime(
          article.id,
          article.readingTime
        ),
        commentCount:
          article.commentCount + countStoredComments(article.id),
      }
    : null;

const toBookmarkResource = (bookmark, article) => ({
  articleId: bookmark.articleId,
  savedAt: bookmark.savedAt,
  article: toArticleResource(article),
});

const toLocalCommentResource = (comment) => ({
  ...comment,
  viewerOwned: true,
});

const createCommentsMeta = (article, localTotal, returned) => ({
  articleId: article.id,
  total: article.commentCount + localTotal,
  ...(returned === undefined ? {} : { returned }),
  baselineTotal: article.commentCount,
  localTotal,
  persistence: getCommentsPersistence(),
});

const toHelpfulnessResource = (articleId, entry) => ({
  articleId: Number(articleId),
  response: entry?.response || null,
  updatedAt: entry?.updatedAt || null,
});

export const handlers = [
  http.get("/api/case-studies", async () => {
    await delay(API_LATENCY_MS.caseStudies);

    return HttpResponse.json({
      data: caseStudies,
      meta: { total: caseStudies.length },
    });
  }),

  http.get("/api/articles", async ({ request }) => {
    await delay(API_LATENCY_MS.articles);

    const url = new URL(request.url);
    const query = String(url.searchParams.get("q") || "").trim().toLowerCase();
    const category = String(url.searchParams.get("category") || "").trim();
    const sort = url.searchParams.get("sort") || "newest";
    const page = toPositiveInteger(url.searchParams.get("page"), 1);
    const pageSize = Math.min(
      toPositiveInteger(url.searchParams.get("pageSize"), DEFAULT_PAGE_SIZE),
      MAX_PAGE_SIZE
    );
    const normalizedCategory = normalizeCategory(category);

    const articleResources = articles.map(toArticleResource);
    const matchingArticles = articleResources.filter((article) => {
      const matchesCategory =
        !normalizedCategory ||
        normalizedCategory === "all" ||
        normalizedCategory === "all categories" ||
        normalizeCategory(article.category) === normalizedCategory;

      const searchableText = [
        article.title,
        article.excerpt,
        article.author,
        article.category,
        ...(Array.isArray(article.tags) ? article.tags : []),
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!query || searchableText.includes(query));
    });

    const sortedArticles = sortArticles(matchingArticles, sort);
    const total = sortedArticles.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const offset = (page - 1) * pageSize;

    return HttpResponse.json({
      data: sortedArticles.slice(offset, offset + pageSize),
      meta: {
        page,
        pageSize,
        total,
        totalPages,
        query,
        category: category || null,
        sort,
      },
    });
  }),

  http.get("/api/articles/:id", async ({ params }) => {
    await delay(API_LATENCY_MS.article);

    const articleId = Number(params.id);
    const articleIndex = articles.findIndex((item) => item.id === articleId);
    const article = articles[articleIndex];

    if (!article) {
      return HttpResponse.json(
        {
          error: {
            code: "ARTICLE_NOT_FOUND",
            message: `Article ${params.id} was not found.`,
          },
        },
        { status: 404 }
      );
    }

    const matchingArticles = articles.filter(
      (item) =>
        item.id !== article.id &&
        (item.category === article.category ||
          item.tags?.some((tag) => article.tags?.includes(tag)))
    );
    const fallbackArticles = articles.filter(
      (item) =>
        item.id !== article.id &&
        !matchingArticles.some((match) => match.id === item.id)
    );

    return HttpResponse.json({
      data: {
        ...toArticleResource(article),
        content: getArticleContent(article.id),
        authorProfile: getAuthorProfile(article.author),
      },
      meta: {
        previousArticle:
          articleIndex > 0
            ? toArticleResource(articles[articleIndex - 1])
            : null,
        nextArticle:
          articleIndex < articles.length - 1
            ? toArticleResource(articles[articleIndex + 1])
            : null,
        relatedArticles: [...matchingArticles, ...fallbackArticles]
          .slice(0, 3)
          .map(toArticleResource),
      },
    });
  }),

  http.get("/api/categories", async () => {
    await delay(API_LATENCY_MS.categories);

    const categoryGroups = articles
      .map(toArticleResource)
      .reduce((groups, article) => {
        const currentGroup = groups.get(article.category) || [];
        currentGroup.push(article);
        groups.set(article.category, currentGroup);
        return groups;
      }, new Map());

    const categories = Array.from(categoryGroups, ([name, categoryArticles]) => {
      const latestArticle = sortArticles(categoryArticles, "newest")[0];

      return {
        name,
        slug: slugify(name),
        count: categoryArticles.length,
        totalReadingTime: categoryArticles.reduce(
          (total, article) => total + article.readingTime,
          0
        ),
        latestArticle,
      };
    });

    return HttpResponse.json({
      data: categories,
      meta: {
        totalCategories: categories.length,
        totalArticles: articles.length,
      },
    });
  }),

  http.get(
    "/api/articles/:articleId/helpfulness",
    async ({ params }) => {
      await delay(API_LATENCY_MS.helpfulness);

      const article = findArticle(params.articleId);
      if (!article) return articleNotFound(params.articleId);

      const entry = getStoredHelpfulness(article.id);

      return HttpResponse.json({
        data: toHelpfulnessResource(article.id, entry),
        meta: {
          persistence: getHelpfulnessPersistence(),
        },
      });
    }
  ),

  http.put(
    "/api/articles/:articleId/helpfulness",
    async ({ params, request }) => {
      await delay(API_LATENCY_MS.helpfulnessMutation);

      const article = findArticle(params.articleId);
      if (!article) return articleNotFound(params.articleId);

      const payload = await readJsonPayload(request);

      if (!payload.parsed) {
        return HttpResponse.json(
          {
            error: {
              code: "INVALID_JSON",
              message: "The request body is not valid JSON.",
            },
          },
          { status: 400 }
        );
      }

      const requestBody =
        payload.value &&
        typeof payload.value === "object" &&
        !Array.isArray(payload.value)
          ? payload.value
          : {};
      const response =
        typeof requestBody.response === "string"
          ? requestBody.response.trim()
          : "";

      if (!isValidHelpfulnessResponse(response)) {
        return validationError({
          response: "Choose a valid article response.",
        });
      }

      const result = await upsertStoredHelpfulness(
        article.id,
        response
      );

      if (!result.entry) {
        return HttpResponse.json(
          {
            error: {
              code: "HELPFULNESS_NOT_SAVED",
              message: "The response could not be saved.",
            },
          },
          { status: 500 }
        );
      }

      return HttpResponse.json(
        {
          data: toHelpfulnessResource(article.id, result.entry),
          meta: {
            created: result.created,
            changed: result.changed,
            persistence: getHelpfulnessPersistence(),
          },
        },
        { status: result.created ? 201 : 200 }
      );
    }
  ),

  http.get("/api/articles/:articleId/comments", async ({ params }) => {
    await delay(API_LATENCY_MS.comments);

    const article = findArticle(params.articleId);
    if (!article) return articleNotFound(params.articleId);

    const localComments = listStoredComments(article.id).map(
      toLocalCommentResource
    );
    const comments = [
      ...localComments,
      ...getRecentComments(article.id),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    return HttpResponse.json({
      data: comments,
      meta: createCommentsMeta(
        article,
        localComments.length,
        comments.length
      ),
    });
  }),

  http.post(
    "/api/articles/:articleId/comments",
    async ({ params, request }) => {
      await delay(API_LATENCY_MS.commentMutation);

      const article = findArticle(params.articleId);
      if (!article) return articleNotFound(params.articleId);

      const payload = await readJsonPayload(request);

      if (!payload.parsed) {
        return HttpResponse.json(
          {
            error: {
              code: "INVALID_JSON",
              message: "The request body is not valid JSON.",
            },
          },
          { status: 400 }
        );
      }

      const requestBody =
        payload.value &&
        typeof payload.value === "object" &&
        !Array.isArray(payload.value)
          ? payload.value
          : {};

      const author =
        typeof requestBody.author === "string"
          ? requestBody.author.trim().replace(/\s+/g, " ")
          : "";
      const commentBody =
        typeof requestBody.body === "string"
          ? requestBody.body.trim()
          : "";
      const fields = {};

      if (author.length < 2) {
        fields.author = "Enter at least 2 characters.";
      } else if (author.length > 50) {
        fields.author = "Use 50 characters or fewer.";
      }

      if (commentBody.length < 10) {
        fields.body = "Add at least 10 characters.";
      } else if (commentBody.length > 1000) {
        fields.body = "Use 1000 characters or fewer.";
      }

      if (Object.keys(fields).length) {
        return validationError(fields);
      }

      const result = await createStoredComment({
        articleId: article.id,
        author,
        body: commentBody,
      });

      if (result.limitReached) {
        return HttpResponse.json(
          {
            error: {
              code: "COMMENT_LIMIT_REACHED",
              message:
                "This browser has reached the local comment limit for this article.",
            },
            meta: {
              ...createCommentsMeta(article, result.total),
              limit: MAX_LOCAL_COMMENTS_PER_ARTICLE,
            },
          },
          { status: 409 }
        );
      }

      if (!result.comment) {
        return HttpResponse.json(
          {
            error: {
              code: "COMMENT_NOT_CREATED",
              message: "The comment could not be created.",
            },
          },
          { status: 500 }
        );
      }

      return HttpResponse.json(
        {
          data: toLocalCommentResource(result.comment),
          meta: createCommentsMeta(article, result.total),
        },
        { status: 201 }
      );
    }
  ),

  http.delete(
    "/api/articles/:articleId/comments/:commentId",
    async ({ params }) => {
      await delay(API_LATENCY_MS.commentMutation);

      const article = findArticle(params.articleId);
      if (!article) return articleNotFound(params.articleId);

      const commentId = String(params.commentId || "").trim();
      const isSeedComment = getRecentComments(article.id).some(
        (comment) => comment.id === commentId
      );

      if (isSeedComment) return commentNotOwned();

      const result = await removeStoredComment(article.id, commentId);

      if (!result.removed) return commentNotFound(commentId);

      return HttpResponse.json({
        data: {
          id: result.comment.id,
          articleId: article.id,
          deleted: true,
        },
        meta: createCommentsMeta(article, result.total),
      });
    }
  ),

  http.get("/api/bookmarks", async () => {
    await delay(API_LATENCY_MS.bookmarks);

    const bookmarks = listStoredBookmarks().flatMap((bookmark) => {
      const article = findArticle(bookmark.articleId);
      return article ? [toBookmarkResource(bookmark, article)] : [];
    });

    return HttpResponse.json({
      data: bookmarks,
      meta: {
        total: bookmarks.length,
        persistence: "browser-local",
      },
    });
  }),

  http.put("/api/bookmarks/:articleId", async ({ params }) => {
    await delay(API_LATENCY_MS.bookmarkMutation);

    const article = findArticle(params.articleId);
    if (!article) return articleNotFound(params.articleId);

    const result = upsertStoredBookmark(article.id);

    return HttpResponse.json(
      {
        data: toBookmarkResource(result.bookmark, article),
        meta: {
          created: result.created,
          total: result.total,
          persistence: "browser-local",
        },
      },
      { status: result.created ? 201 : 200 }
    );
  }),

  http.delete("/api/bookmarks/:articleId", async ({ params }) => {
    await delay(API_LATENCY_MS.bookmarkMutation);

    const article = findArticle(params.articleId);
    if (!article) return articleNotFound(params.articleId);

    const result = removeStoredBookmark(article.id);

    return HttpResponse.json({
      data: {
        articleId: article.id,
        bookmarked: false,
      },
      meta: {
        removed: result.removed,
        total: result.total,
        persistence: "browser-local",
      },
    });
  }),

  http.post("/api/contact", async ({ request }) => {
    await delay(650);
    const body = await readBody(request);

    if (!body) {
      return HttpResponse.json(
        {
          error: {
            code: "INVALID_JSON",
            message: "The request body is not valid JSON.",
          },
        },
        { status: 400 }
      );
    }

    if (body.website) {
      return HttpResponse.json(
        { requestId: "MAG-AUTO", status: "accepted" },
        { status: 202 }
      );
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const message = String(body.message || "").trim();
    const requestedEngagement = String(body.engagement || "").trim();
    const engagement = requestedEngagement
      ? getEngagement(requestedEngagement)
      : null;
    const fields = {};

    if (name.length < 2) fields.name = "Enter at least 2 characters.";
    if (!emailPattern.test(email)) fields.email = "Enter a valid email address.";
    if (message.length < 20) fields.message = "Add at least 20 characters.";
    if (requestedEngagement && !engagement) {
      fields.engagement = "Choose a valid engagement.";
    }

    if (Object.keys(fields).length) {
      return validationError(fields);
    }

    const requestId = `MAG-${Date.now().toString(36).toUpperCase()}`;
    const receivedAt = new Date().toISOString();

    saveContactReceipt({
      requestId,
      receivedAt,
      engagement: engagement?.id || null,
    });

    return HttpResponse.json(
      {
        requestId,
        receivedAt,
        engagement: engagement?.id || null,
        status: "accepted",
      },
      { status: 202 }
    );
  }),

  http.post("/api/newsletter", async ({ request }) => {
    await delay(450);
    const body = await readBody(request);
    const email = String(body?.email || "").trim().toLowerCase();

    if (!emailPattern.test(email)) {
      return validationError({
        email: "Enter a valid email address.",
      });
    }

    if (!addNewsletterSubscriber(email)) {
      return HttpResponse.json(
        {
          error: {
            code: "ALREADY_SUBSCRIBED",
            message: "This email is already on the list.",
          },
        },
        { status: 409 }
      );
    }

    return HttpResponse.json(
      {
        status: "subscribed",
        subscribedAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),
];
