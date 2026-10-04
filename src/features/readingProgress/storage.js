const STORAGE_VERSION = 1;

export const READING_PROGRESS_STORAGE_KEY =
  `magency:reading-progress:v${STORAGE_VERSION}`;

const EMPTY_ARTICLES = Object.freeze({});
const EMPTY_SNAPSHOT = Object.freeze({
  version: STORAGE_VERSION,
  articles: EMPTY_ARTICLES,
});

let snapshot = EMPTY_SNAPSHOT;
let hasLoaded = false;
let shouldUseMemoryFallback = false;
const listeners = new Set();

const normalizeArticleId = (articleId) => {
  if (articleId === null || articleId === undefined) return "";

  return String(articleId).trim();
};

export const clampReadingProgress = (value) => {
  const progress = Number(value);

  if (!Number.isFinite(progress)) return 0;

  return Math.min(100, Math.max(0, Math.round(progress)));
};

const normalizeUpdatedAt = (value) => {
  const timestamp = Number(value);

  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : null;
};

const createSnapshot = (value) => {
  if (
    !value ||
    typeof value !== "object" ||
    value.version !== STORAGE_VERSION ||
    !value.articles ||
    typeof value.articles !== "object"
  ) {
    return EMPTY_SNAPSHOT;
  }

  const articles = {};

  Object.entries(value.articles).forEach(([articleId, entry]) => {
    const normalizedId = normalizeArticleId(articleId);
    const progress = clampReadingProgress(entry?.progress);

    if (!normalizedId || progress <= 0) return;

    articles[normalizedId] = Object.freeze({
      progress,
      updatedAt: normalizeUpdatedAt(entry?.updatedAt),
    });
  });

  if (Object.keys(articles).length === 0) return EMPTY_SNAPSHOT;

  return Object.freeze({
    version: STORAGE_VERSION,
    articles: Object.freeze(articles),
  });
};

const getLocalStorage = () => {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const readStoredSnapshot = () => {
  if (shouldUseMemoryFallback) return null;

  const storage = getLocalStorage();

  if (!storage) return null;

  try {
    const storedValue = storage.getItem(READING_PROGRESS_STORAGE_KEY);

    return storedValue ? createSnapshot(JSON.parse(storedValue)) : EMPTY_SNAPSHOT;
  } catch {
    shouldUseMemoryFallback = true;
    return null;
  }
};

const ensureLoaded = () => {
  if (hasLoaded) return;

  const storedSnapshot = readStoredSnapshot();

  if (storedSnapshot) snapshot = storedSnapshot;
  hasLoaded = true;
};

const mergeSnapshots = (first, second) => {
  const articles = { ...first.articles };
  let hasChanges = false;

  Object.entries(second.articles).forEach(([articleId, entry]) => {
    const currentEntry = articles[articleId];

    if (!currentEntry || entry.progress > currentEntry.progress) {
      articles[articleId] = entry;
      hasChanges = true;
    }
  });

  return hasChanges
    ? createSnapshot({ version: STORAGE_VERSION, articles })
    : first;
};

const persistSnapshot = (nextSnapshot) => {
  if (shouldUseMemoryFallback) return;

  const storage = getLocalStorage();

  if (!storage) return;

  try {
    storage.setItem(
      READING_PROGRESS_STORAGE_KEY,
      JSON.stringify(nextSnapshot)
    );
  } catch {
    shouldUseMemoryFallback = true;
    // The in-memory snapshot remains usable when storage is unavailable.
  }
};

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const replaceSnapshot = (nextSnapshot) => {
  if (nextSnapshot === snapshot) return;

  snapshot = nextSnapshot;
  emitChange();
};

const handleStorage = (event) => {
  if (
    event.key !== READING_PROGRESS_STORAGE_KEY &&
    event.key !== null
  ) {
    return;
  }

  if (!event.newValue) {
    replaceSnapshot(EMPTY_SNAPSHOT);
    return;
  }

  try {
    const incomingSnapshot = createSnapshot(JSON.parse(event.newValue));

    replaceSnapshot(mergeSnapshots(snapshot, incomingSnapshot));
  } catch {
    // Ignore invalid external values and keep the last valid progress.
  }
};

export const subscribeToReadingProgress = (listener) => {
  ensureLoaded();
  listeners.add(listener);

  if (listeners.size === 1 && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
};

export const getReadingProgressSnapshot = () => {
  ensureLoaded();

  return snapshot;
};

export const getReadingProgressServerSnapshot = () => EMPTY_SNAPSHOT;

const createSummary = (articleId, entry) => {
  const progress = entry?.progress || 0;

  return Object.freeze({
    articleId,
    progress,
    isStarted: progress > 0,
    isComplete: progress >= 100,
    updatedAt: entry?.updatedAt || null,
  });
};

export const selectReadingProgressSummary = (
  currentSnapshot,
  articleId
) => {
  const normalizedId = normalizeArticleId(articleId);

  return createSummary(
    normalizedId,
    normalizedId ? currentSnapshot.articles[normalizedId] : undefined
  );
};

export const selectReadingProgressSummaries = (
  currentSnapshot,
  articleIds = []
) => {
  return Object.freeze(
    [...new Set(articleIds.map(normalizeArticleId).filter(Boolean))].reduce(
      (summaries, articleId) => {
        summaries[articleId] = createSummary(
          articleId,
          currentSnapshot.articles[articleId]
        );
        return summaries;
      },
      {}
    )
  );
};

export const getReadingProgressSummary = (articleId) =>
  selectReadingProgressSummary(getReadingProgressSnapshot(), articleId);

export const getReadingProgressSummaries = (articleIds = []) =>
  selectReadingProgressSummaries(getReadingProgressSnapshot(), articleIds);

export const recordReadingProgress = (articleId, value) => {
  const normalizedId = normalizeArticleId(articleId);
  const nextProgress = clampReadingProgress(value);

  if (!normalizedId || nextProgress <= 0) {
    return getReadingProgressSummary(normalizedId);
  }

  ensureLoaded();

  const storedSnapshot = readStoredSnapshot();
  const latestSnapshot =
    storedSnapshot === EMPTY_SNAPSHOT
      ? EMPTY_SNAPSHOT
      : storedSnapshot
        ? mergeSnapshots(snapshot, storedSnapshot)
        : snapshot;
  const currentEntry = latestSnapshot.articles[normalizedId];

  if (currentEntry && currentEntry.progress >= nextProgress) {
    if (latestSnapshot !== snapshot) replaceSnapshot(latestSnapshot);

    return createSummary(normalizedId, currentEntry);
  }

  const nextSnapshot = createSnapshot({
    version: STORAGE_VERSION,
    articles: {
      ...latestSnapshot.articles,
      [normalizedId]: {
        progress: nextProgress,
        updatedAt: Date.now(),
      },
    },
  });

  persistSnapshot(nextSnapshot);
  replaceSnapshot(nextSnapshot);

  return createSummary(normalizedId, nextSnapshot.articles[normalizedId]);
};
