export const COMMENTS_STORAGE_KEY = "magency:v1:comments";
export const MAX_LOCAL_COMMENTS_PER_ARTICLE = 25;

const STORAGE_VERSION = 1;
const MAX_AUTHOR_LENGTH = 50;
const MAX_BODY_LENGTH = 1000;
const STORAGE_LOCK_NAME = "magency:comments-storage";
let memoryValue = null;
let shouldUseMemoryFallback = false;

const emptySnapshot = () => ({
  version: STORAGE_VERSION,
  comments: [],
});

const readValue = () => {
  if (shouldUseMemoryFallback) return memoryValue;

  if (typeof window === "undefined") {
    shouldUseMemoryFallback = true;
    return memoryValue;
  }

  try {
    const storedValue = window.localStorage.getItem(COMMENTS_STORAGE_KEY);

    memoryValue = storedValue;
    return storedValue;
  } catch {
    shouldUseMemoryFallback = true;
    return memoryValue;
  }
};

const writeValue = (value) => {
  memoryValue = value;

  if (shouldUseMemoryFallback || typeof window === "undefined") {
    shouldUseMemoryFallback = true;
    return;
  }

  try {
    window.localStorage.setItem(COMMENTS_STORAGE_KEY, value);
  } catch {
    shouldUseMemoryFallback = true;
    // The in-memory copy keeps comments usable in restricted browsers.
  }
};

const normalizeText = (value) =>
  typeof value === "string" ? value.trim() : "";

const normalizeStoredComment = (value) => {
  const id = normalizeText(value?.id);
  const articleId = Number(value?.articleId);
  const author = normalizeText(value?.author);
  const body = normalizeText(value?.body);
  const createdAt = normalizeText(value?.createdAt);

  if (
    !id ||
    id.length > 128 ||
    !Number.isInteger(articleId) ||
    articleId < 1 ||
    author.length < 2 ||
    author.length > MAX_AUTHOR_LENGTH ||
    body.length < 10 ||
    body.length > MAX_BODY_LENGTH ||
    !createdAt ||
    Number.isNaN(Date.parse(createdAt))
  ) {
    return null;
  }

  return {
    id,
    articleId,
    author,
    body,
    createdAt: new Date(createdAt).toISOString(),
  };
};

const normalizeComments = (comments) => {
  if (!Array.isArray(comments)) return [];

  const seenIds = new Set();
  const countsByArticle = new Map();

  return comments
    .map(normalizeStoredComment)
    .filter(Boolean)
    .sort((a, b) => {
      const timeDifference =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      return timeDifference || a.id.localeCompare(b.id);
    })
    .filter((comment) => {
      if (seenIds.has(comment.id)) return false;
      seenIds.add(comment.id);

      const articleCount = countsByArticle.get(comment.articleId) || 0;

      if (articleCount >= MAX_LOCAL_COMMENTS_PER_ARTICLE) return false;
      countsByArticle.set(comment.articleId, articleCount + 1);
      return true;
    });
};

const readSnapshot = () => {
  const value = readValue();

  if (!value) return emptySnapshot();

  try {
    const parsedValue = JSON.parse(value);

    if (
      !parsedValue ||
      parsedValue.version !== STORAGE_VERSION ||
      !Array.isArray(parsedValue.comments)
    ) {
      return emptySnapshot();
    }

    return {
      version: STORAGE_VERSION,
      comments: normalizeComments(parsedValue.comments),
    };
  } catch {
    return emptySnapshot();
  }
};

const writeSnapshot = (comments) => {
  writeValue(
    JSON.stringify({
      version: STORAGE_VERSION,
      comments: normalizeComments(comments),
    })
  );
};

const createCommentId = (existingIds) => {
  let id;

  do {
    const randomPart =
      typeof globalThis.crypto?.randomUUID === "function"
        ? globalThis.crypto.randomUUID()
        : `${Date.now().toString(36)}_${Math.random()
            .toString(36)
            .slice(2, 12)}`;

    id = `comment_${randomPart}`;
  } while (existingIds.has(id));

  return id;
};

const runStorageMutation = (mutation) => {
  const lockManager = globalThis.navigator?.locks;

  if (typeof lockManager?.request === "function") {
    return lockManager.request(STORAGE_LOCK_NAME, mutation);
  }

  return Promise.resolve().then(mutation);
};

export const listStoredComments = (articleId) => {
  const comments = readSnapshot().comments;

  if (articleId === undefined || articleId === null) {
    return comments.map((comment) => ({ ...comment }));
  }

  const normalizedArticleId = Number(articleId);

  return comments
    .filter((comment) => comment.articleId === normalizedArticleId)
    .map((comment) => ({ ...comment }));
};

export const countStoredComments = (articleId) =>
  listStoredComments(articleId).length;

export const createStoredComment = ({ articleId, author, body }) =>
  runStorageMutation(() => {
    const normalizedArticleId = Number(articleId);
    const comments = listStoredComments();
    const articleComments = comments.filter(
      (comment) => comment.articleId === normalizedArticleId
    );

    if (
      !Number.isInteger(normalizedArticleId) ||
      normalizedArticleId < 1 ||
      articleComments.length >= MAX_LOCAL_COMMENTS_PER_ARTICLE
    ) {
      return {
        comment: null,
        limitReached:
          articleComments.length >= MAX_LOCAL_COMMENTS_PER_ARTICLE,
        total: articleComments.length,
      };
    }

    const comment = normalizeStoredComment({
      id: createCommentId(new Set(comments.map((item) => item.id))),
      articleId: normalizedArticleId,
      author,
      body,
      createdAt: new Date().toISOString(),
    });

    if (!comment) {
      return {
        comment: null,
        limitReached: false,
        total: articleComments.length,
      };
    }

    writeSnapshot([comment, ...comments]);

    return {
      comment: { ...comment },
      limitReached: false,
      total: articleComments.length + 1,
    };
  });

export const removeStoredComment = (articleId, commentId) =>
  runStorageMutation(() => {
    const normalizedArticleId = Number(articleId);
    const normalizedCommentId = normalizeText(commentId);
    const comments = listStoredComments();
    const removedComment = comments.find(
      (comment) =>
        comment.articleId === normalizedArticleId &&
        comment.id === normalizedCommentId
    );

    if (!removedComment) {
      return {
        removed: false,
        comment: null,
        total: countStoredComments(normalizedArticleId),
      };
    }

    const nextComments = comments.filter(
      (comment) => comment.id !== removedComment.id
    );

    writeSnapshot(nextComments);

    return {
      removed: true,
      comment: { ...removedComment },
      total: nextComments.filter(
        (comment) => comment.articleId === normalizedArticleId
      ).length,
    };
  });

export const getCommentsPersistence = () =>
  shouldUseMemoryFallback ? "memory" : "browser-local";
