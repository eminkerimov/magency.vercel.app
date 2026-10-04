import React from "react";
import BookmarkButton from "../../components/BookmarkButton";
import {
  useBookmarkMutationsPending,
  useBookmarksQuery,
  useRemoveBookmarkMutation,
  useSaveBookmarkMutation,
} from "./queries";

const BookmarkToggle = ({ article, onRemove, variant = "card" }) => {
  const {
    data: bookmarks = [],
    error: bookmarksError,
    isPending: isBookmarksPending,
  } = useBookmarksQuery();
  const saveBookmark = useSaveBookmarkMutation();
  const removeBookmark = useRemoveBookmarkMutation();
  const isAnyMutationPending = useBookmarkMutationsPending();
  const articleId = Number(article?.id);
  const isBookmarked = bookmarks.some(
    (bookmark) => bookmark.articleId === articleId
  );
  const isPending =
    isBookmarksPending || saveBookmark.isPending || removeBookmark.isPending;
  const isDisabled = Boolean(
    bookmarksError || isAnyMutationPending
  );
  const mutationError = saveBookmark.error || removeBookmark.error;

  const handleToggle = () => {
    if (!Number.isInteger(articleId) || isPending || isDisabled) return;

    if (isBookmarked) {
      onRemove?.(article);
      removeBookmark.mutate(article);
      return;
    }

    saveBookmark.mutate(article);
  };

  return (
    <>
      <BookmarkButton
        articleTitle={article?.title}
        isBookmarked={isBookmarked}
        isDisabled={isDisabled}
        isPending={isPending}
        onToggle={handleToggle}
        pendingAction={removeBookmark.isPending ? "remove" : "save"}
        variant={variant}
      />
      {mutationError && (
        <span className="bookmark-feedback" role="alert">
          {mutationError.message ||
            "The saved articles list could not be updated."}
        </span>
      )}
      {bookmarksError && variant === "hero" && (
        <span className="bookmark-feedback" role="alert">
          Saved articles are temporarily unavailable.
        </span>
      )}
    </>
  );
};

export default BookmarkToggle;
