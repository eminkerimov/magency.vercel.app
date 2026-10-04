export const HELPFULNESS_STORAGE_KEY =
  "magency:v1:article-helpfulness";

const STORAGE_VERSION = 1;
const STORAGE_LOCK_NAME = "magency:article-helpfulness-storage";
const VALID_RESPONSES = new Set(["helpful", "not-helpful"]);

let memoryValue = null;
let shouldUseMemoryFallback = false;
let mutationQueue = Promise.resolve();

const emptySnapshot = () => ({
  version: STORAGE_VERSION,
  articles: {},
});

const readValue = () => {
  if (shouldUseMemoryFallback) return memoryValue;

  if (typeof window === "undefined") {
    shouldUseMemoryFallback = true;
    return memoryValue;
  }

  try {
    const storedValue = window.localStorage.getItem(
      HELPFULNESS_STORAGE_KEY
    );

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
    window.localStorage.setItem(HELPFULNESS_STORAGE_KEY, value);
  } catch {
    shouldUseMemoryFallback = true;
    // Keep the in-memory copy usable when browser storage is unavailable.
  }
};

const normalizeArticleId = (value) => {
  const articleId = Number(value);

  return Number.isInteger(articleId) && articleId > 0
    ? articleId
    : null;
};

const normalizeEntry = (articleId, value) => {
  const normalizedArticleId = normalizeArticleId(articleId);
  const response =
    typeof value?.response === "string"
      ? value.response.trim()
      : "";
  const updatedAt =
    typeof value?.updatedAt === "string"
      ? value.updatedAt.trim()
      : "";

  if (
    !normalizedArticleId ||
    !VALID_RESPONSES.has(response) ||
    !updatedAt ||
    Number.isNaN(Date.parse(updatedAt))
  ) {
    return null;
  }

  return {
    articleId: normalizedArticleId,
    response,
    updatedAt: new Date(updatedAt).toISOString(),
  };
};

const normalizeSnapshot = (value) => {
  if (
    !value ||
    value.version !== STORAGE_VERSION ||
    !value.articles ||
    typeof value.articles !== "object" ||
    Array.isArray(value.articles)
  ) {
    return emptySnapshot();
  }

  const articles = {};

  Object.entries(value.articles).forEach(([articleId, entry]) => {
    const normalizedEntry = normalizeEntry(articleId, entry);

    if (!normalizedEntry) return;
    articles[String(normalizedEntry.articleId)] = {
      response: normalizedEntry.response,
      updatedAt: normalizedEntry.updatedAt,
    };
  });

  return {
    version: STORAGE_VERSION,
    articles,
  };
};

const readSnapshot = () => {
  const value = readValue();

  if (!value) return emptySnapshot();

  try {
    return normalizeSnapshot(JSON.parse(value));
  } catch {
    return emptySnapshot();
  }
};

const writeSnapshot = (articles) => {
  const snapshot = normalizeSnapshot({
    version: STORAGE_VERSION,
    articles,
  });

  writeValue(JSON.stringify(snapshot));
};

const runStorageMutation = (mutation) => {
  const lockManager = globalThis.navigator?.locks;

  if (typeof lockManager?.request === "function") {
    return lockManager.request(STORAGE_LOCK_NAME, mutation);
  }

  const result = mutationQueue.then(mutation, mutation);
  mutationQueue = result.then(
    () => undefined,
    () => undefined
  );

  return result;
};

export const isValidHelpfulnessResponse = (value) =>
  VALID_RESPONSES.has(String(value || "").trim());

export const getStoredHelpfulness = (articleId) => {
  const normalizedArticleId = normalizeArticleId(articleId);

  if (!normalizedArticleId) return null;

  const entry =
    readSnapshot().articles[String(normalizedArticleId)];

  return entry
    ? {
        articleId: normalizedArticleId,
        response: entry.response,
        updatedAt: entry.updatedAt,
      }
    : null;
};

export const upsertStoredHelpfulness = (articleId, response) =>
  runStorageMutation(() => {
    const normalizedArticleId = normalizeArticleId(articleId);
    const normalizedResponse = String(response || "").trim();

    if (
      !normalizedArticleId ||
      !isValidHelpfulnessResponse(normalizedResponse)
    ) {
      return {
        entry: null,
        created: false,
        changed: false,
      };
    }

    const snapshot = readSnapshot();
    const key = String(normalizedArticleId);
    const currentEntry = snapshot.articles[key];

    if (currentEntry?.response === normalizedResponse) {
      return {
        entry: {
          articleId: normalizedArticleId,
          ...currentEntry,
        },
        created: false,
        changed: false,
      };
    }

    const entry = {
      articleId: normalizedArticleId,
      response: normalizedResponse,
      updatedAt: new Date().toISOString(),
    };

    writeSnapshot({
      ...snapshot.articles,
      [key]: {
        response: entry.response,
        updatedAt: entry.updatedAt,
      },
    });

    return {
      entry,
      created: !currentEntry,
      changed: true,
    };
  });

export const getHelpfulnessPersistence = () =>
  shouldUseMemoryFallback ? "memory" : "browser-local";
