import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  getReadingProgressServerSnapshot,
  getReadingProgressSnapshot,
  recordReadingProgress,
  selectReadingProgressSummaries,
  selectReadingProgressSummary,
  subscribeToReadingProgress,
} from "./storage";

const useReadingProgressSnapshot = () =>
  useSyncExternalStore(
    subscribeToReadingProgress,
    getReadingProgressSnapshot,
    getReadingProgressServerSnapshot
  );

export const useReadingProgress = (articleId) => {
  const snapshot = useReadingProgressSnapshot();
  const normalizedId =
    articleId === null || articleId === undefined
      ? ""
      : String(articleId).trim();
  const summary = useMemo(
    () => selectReadingProgressSummary(snapshot, normalizedId),
    [normalizedId, snapshot]
  );
  const recordProgress = useCallback(
    (progress) => recordReadingProgress(normalizedId, progress),
    [normalizedId]
  );
  const markComplete = useCallback(
    () => recordReadingProgress(normalizedId, 100),
    [normalizedId]
  );

  return useMemo(
    () => ({ ...summary, recordProgress, markComplete }),
    [markComplete, recordProgress, summary]
  );
};

export const useReadingProgressSummaries = (articleIds = []) => {
  const snapshot = useReadingProgressSnapshot();

  return useMemo(
    () => selectReadingProgressSummaries(snapshot, articleIds),
    [articleIds, snapshot]
  );
};
