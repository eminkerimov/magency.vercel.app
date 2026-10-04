import React from "react";
import {
  useArticleHelpfulnessQuery,
  useSetArticleHelpfulnessMutation,
} from "./queries";

const choices = [
  { value: "helpful", label: "Yes, useful" },
  { value: "not-helpful", label: "Not quite" },
];

const ArticleHelpfulness = ({ articleId }) => {
  const {
    data,
    error,
    isError,
    isFetching,
    isPending,
    refetch,
  } = useArticleHelpfulnessQuery(articleId);
  const saveResponse =
    useSetArticleHelpfulnessMutation(articleId);
  const selectedResponse = data?.response || null;
  const isSaving = saveResponse.isPending;
  const controlsUnavailable = isPending || isError;
  const titleId = "article-helpfulness-title";
  const statusId = "article-helpfulness-status";

  const handleResponse = (response) => {
    if (
      controlsUnavailable ||
      isSaving ||
      response === selectedResponse
    ) {
      return;
    }

    saveResponse.mutate(response);
  };

  const statusMessage = isPending
    ? "Loading your saved response..."
    : isSaving
      ? "Saving your response..."
      : saveResponse.isError
        ? "We could not save your response. Please try again."
        : saveResponse.isSuccess
          ? "Thanks — your feedback is saved."
          : selectedResponse
            ? "Your feedback is saved. You can change it any time."
            : "Choose one option.";

  return (
    <section
      className="article-helpfulness"
      aria-labelledby={titleId}
    >
      <div className="article-helpfulness__copy">
        <span>Quick feedback</span>
        <h2 id={titleId}>Was this article useful?</h2>
        <p>Your response helps us improve future guides.</p>
      </div>

      <div
        className="article-helpfulness__choices"
        role="group"
        aria-labelledby={titleId}
        aria-describedby={statusId}
        aria-busy={isSaving}
      >
        {choices.map((choice) => {
          const isSelected = selectedResponse === choice.value;

          return (
            <button
              type="button"
              key={choice.value}
              aria-pressed={isSelected}
              aria-disabled={isSaving}
              disabled={controlsUnavailable}
              onClick={() => handleResponse(choice.value)}
            >
              <span>{choice.label}</span>
              <span
                className="article-helpfulness__check"
                aria-hidden="true"
              >
                ✓
              </span>
            </button>
          );
        })}
      </div>

      {isError ? (
        <div
          className="article-helpfulness__status is-error"
          id={statusId}
          role="alert"
        >
          <span>
            {error?.message ||
              "We could not load your saved response."}
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Retrying..." : "Retry"}
          </button>
        </div>
      ) : (
        <p
          className={
            "article-helpfulness__status" +
            (saveResponse.isError ? " is-error" : "") +
            (saveResponse.isSuccess ? " is-success" : "")
          }
          id={statusId}
          role={saveResponse.isError ? "alert" : "status"}
          aria-live="polite"
          aria-atomic="true"
        >
          {statusMessage}
        </p>
      )}
    </section>
  );
};

export default ArticleHelpfulness;
