import React from "react";

const getSkeletonCount = (count) => {
  if (!Number.isFinite(count)) {
    return 3;
  }

  return Math.min(Math.max(Math.floor(count), 1), 8);
};

const StateIcon = ({ variant }) => (
  <span
    className={`content-state__icon content-state__icon--${variant}`}
    aria-hidden="true"
  >
    <span />
  </span>
);

const ContentLoading = ({ count = 3, label = "Loading articles" }) => (
  <div
    className="content-state content-state--loading"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <span className="content-state__sr-only">{label}</span>

    <div className="content-state__skeleton-grid" aria-hidden="true">
      {Array.from({ length: getSkeletonCount(count) }, (_, index) => (
        <div className="content-skeleton" key={index}>
          <div className="content-skeleton__media" />
          <div className="content-skeleton__body">
            <div className="content-skeleton__meta" />
            <div className="content-skeleton__title" />
            <div className="content-skeleton__title content-skeleton__title--short" />
            <div className="content-skeleton__line" />
            <div className="content-skeleton__line content-skeleton__line--short" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ContentError = ({
  title = "We could not load this content",
  message = "Something interrupted the request. Please try again in a moment.",
  onRetry,
  retryLabel = "Try again",
}) => (
  <div className="content-state content-state--panel content-state--error" role="alert">
    <div className="content-state__body">
      <StateIcon variant="error" />
      <span className="content-state__eyebrow">Request interrupted</span>
      <h2 className="content-state__title">{title}</h2>
      <p className="content-state__message">{message}</p>

      {typeof onRetry === "function" && (
        <button className="content-state__action" type="button" onClick={onRetry}>
          {retryLabel}
          <span aria-hidden="true">↻</span>
        </button>
      )}
    </div>
  </div>
);

const ContentEmpty = ({
  eyebrow = "No results",
  title = "Nothing to show yet",
  message = "Try changing the filters or check back when new content is published.",
  action,
}) => (
  <div className="content-state content-state--panel content-state--empty" role="status">
    <div className="content-state__body">
      <StateIcon variant="empty" />
      <span className="content-state__eyebrow">{eyebrow}</span>
      <h2 className="content-state__title">{title}</h2>
      <p className="content-state__message">{message}</p>
      {action && <div className="content-state__custom-action">{action}</div>}
    </div>
  </div>
);

const ContentState = ({ status = "loading", ...props }) => {
  if (status === "error") {
    return <ContentError {...props} />;
  }

  if (status === "empty") {
    return <ContentEmpty {...props} />;
  }

  return <ContentLoading {...props} />;
};

export { ContentEmpty, ContentError, ContentLoading };
export default ContentState;
