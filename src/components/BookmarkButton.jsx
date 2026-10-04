import React from "react";

const BookmarkIcon = ({ filled }) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.75 4.75c0-.97.78-1.75 1.75-1.75h7c.97 0 1.75.78 1.75 1.75v15.1L12 16.63l-5.25 3.22V4.75Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    />
  </svg>
);

const BookmarkButton = ({
  isBookmarked = false,
  isPending = false,
  isDisabled = false,
  pendingAction = "save",
  onToggle,
  variant = "card",
  articleTitle = "this article",
}) => {
  const safeVariant = variant === "hero" ? "hero" : "card";
  const accessibleLabel = `Save ${articleTitle || "this article"}`;
  const pendingLabel = pendingAction === "remove" ? "Removing\u2026" : "Saving\u2026";

  return (
    <button
      className={`bookmark-button bookmark-button--${safeVariant}${
        isBookmarked ? " is-bookmarked" : ""
      }${isPending ? " is-pending" : ""}`}
      type="button"
      aria-busy={isPending || undefined}
      aria-label={accessibleLabel}
      aria-pressed={isBookmarked}
      disabled={isPending || isDisabled}
      onClick={onToggle}
    >
      <span className="bookmark-button__icon">
        <BookmarkIcon filled={isBookmarked} />
      </span>
      {safeVariant === "hero" && (
        <span className="bookmark-button__label">
          {isPending ? pendingLabel : isBookmarked ? "Saved" : "Save article"}
        </span>
      )}
    </button>
  );
};

export default BookmarkButton;
