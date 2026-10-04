import React from "react";

const normalizeProgress = (progress) => {
  const numericProgress = Number(progress);

  if (!Number.isFinite(numericProgress)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(numericProgress)));
};

const ReadingProgress = ({
  progress = 0,
  compact = false,
  articleTitle,
  ariaLabel,
}) => {
  const normalizedProgress = normalizeProgress(progress);
  const isComplete = normalizedProgress === 100;
  const valueLabel = isComplete ? "Completed" : `${normalizedProgress}%`;
  const accessibleLabel =
    ariaLabel ||
    (articleTitle
      ? `Reading progress for ${articleTitle}`
      : isComplete
        ? "Article completed"
        : "Article reading progress");

  return (
    <div
      className={`reading-progress${compact ? " reading-progress--compact" : ""}${
        isComplete ? " is-complete" : ""
      }`}
      role="progressbar"
      aria-label={accessibleLabel}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={normalizedProgress}
      aria-valuetext={valueLabel}
    >
      <span className="reading-progress__meta">
        {!compact && <span className="reading-progress__label">Reading progress</span>}
        <strong className="reading-progress__value">{valueLabel}</strong>
      </span>
      <span className="reading-progress__track" aria-hidden="true">
        <span
          className="reading-progress__fill"
          style={{ width: `${normalizedProgress}%` }}
        />
      </span>
    </div>
  );
};

export default ReadingProgress;
