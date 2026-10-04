const SUBSCRIBERS_KEY = "magency:v1:newsletter";
const RECEIPTS_KEY = "magency:v1:contact-receipts";
const memoryStorage = new Map();

const readValue = (key) => {
  try {
    return window.localStorage.getItem(key) ?? memoryStorage.get(key) ?? null;
  } catch {
    return memoryStorage.get(key) ?? null;
  }
};

const writeValue = (key, value) => {
  memoryStorage.set(key, value);

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The in-memory fallback keeps the demo usable when storage is unavailable.
  }
};

const readList = (key) => {
  try {
    const value = JSON.parse(readValue(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const fingerprint = (value) => {
  let hash = 2166136261;

  for (const character of value.trim().toLowerCase()) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
};

export const addNewsletterSubscriber = (email) => {
  const subscribers = readList(SUBSCRIBERS_KEY);
  const emailFingerprint = fingerprint(email);

  if (subscribers.includes(emailFingerprint)) {
    return false;
  }

  writeValue(
    SUBSCRIBERS_KEY,
    JSON.stringify([...subscribers, emailFingerprint])
  );

  return true;
};

export const saveContactReceipt = (receipt) => {
  const receipts = readList(RECEIPTS_KEY).slice(-4);
  writeValue(RECEIPTS_KEY, JSON.stringify([...receipts, receipt]));
};
