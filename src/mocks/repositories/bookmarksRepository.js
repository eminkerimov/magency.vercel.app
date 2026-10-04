const BOOKMARKS_KEY = "magency:v1:bookmarks";
let memoryValue = null;
let shouldUseMemoryFallback = false;

const readValue = () => {
  if (shouldUseMemoryFallback) return memoryValue;

  try {
    const storedValue = window.localStorage.getItem(BOOKMARKS_KEY);

    memoryValue = storedValue;
    return storedValue;
  } catch {
    shouldUseMemoryFallback = true;
    return memoryValue;
  }
};

const writeValue = (value) => {
  memoryValue = value;

  if (shouldUseMemoryFallback) return;

  try {
    window.localStorage.setItem(BOOKMARKS_KEY, value);
  } catch {
    shouldUseMemoryFallback = true;
    // The in-memory fallback keeps bookmarks usable in restricted browsers.
  }
};

const normalizeBookmarks = (value) => {
  if (!Array.isArray(value)) return [];

  const seenArticleIds = new Set();

  return value
    .filter((bookmark) => {
      const articleId = Number(bookmark?.articleId);
      const isValid =
        Number.isInteger(articleId) &&
        articleId > 0 &&
        typeof bookmark?.savedAt === "string" &&
        !Number.isNaN(Date.parse(bookmark.savedAt)) &&
        !seenArticleIds.has(articleId);

      if (isValid) seenArticleIds.add(articleId);
      return isValid;
    })
    .map((bookmark) => ({
      articleId: Number(bookmark.articleId),
      savedAt: bookmark.savedAt,
    }))
    .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
};

export const listStoredBookmarks = () => {
  try {
    return normalizeBookmarks(JSON.parse(readValue() || "[]"));
  } catch {
    return [];
  }
};

export const upsertStoredBookmark = (articleId) => {
  const bookmarks = listStoredBookmarks();
  const existingBookmark = bookmarks.find(
    (bookmark) => bookmark.articleId === articleId
  );

  if (existingBookmark) {
    return {
      bookmark: existingBookmark,
      created: false,
      total: bookmarks.length,
    };
  }

  const bookmark = {
    articleId,
    savedAt: new Date().toISOString(),
  };
  const nextBookmarks = [bookmark, ...bookmarks];

  writeValue(JSON.stringify(nextBookmarks));

  return {
    bookmark,
    created: true,
    total: nextBookmarks.length,
  };
};

export const removeStoredBookmark = (articleId) => {
  const bookmarks = listStoredBookmarks();
  const nextBookmarks = bookmarks.filter(
    (bookmark) => bookmark.articleId !== articleId
  );
  const removed = nextBookmarks.length !== bookmarks.length;

  if (removed) writeValue(JSON.stringify(nextBookmarks));

  return {
    removed,
    total: nextBookmarks.length,
  };
};
