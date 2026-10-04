import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  useCommentsQuery,
  useCommentsMutationsPending,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "./queries";

const LIMITS = {
  author: { min: 2, max: 50 },
  body: { min: 10, max: 1000 },
};

const absoluteDateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
  year: "numeric",
});

const relativeDateFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});

const getInitials = (name) =>
  String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?";

const getAbsoluteTimestamp = (value) => {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Recently"
    : absoluteDateFormatter.format(date);
};

const getRelativeTimestamp = (value, now) => {
  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) return "Recently";

  const difference = Math.round((timestamp - now) / 1000);
  const absoluteDifference = Math.abs(difference);

  if (absoluteDifference < 60) return "Just now";
  if (absoluteDifference < 60 * 60) {
    return relativeDateFormatter.format(Math.round(difference / 60), "minute");
  }
  if (absoluteDifference < 60 * 60 * 24) {
    return relativeDateFormatter.format(
      Math.round(difference / (60 * 60)),
      "hour"
    );
  }
  if (absoluteDifference < 60 * 60 * 24 * 7) {
    return relativeDateFormatter.format(
      Math.round(difference / (60 * 60 * 24)),
      "day"
    );
  }

  return getAbsoluteTimestamp(value);
};

const getValidationErrors = (author, body) => {
  const errors = {};
  const normalizedAuthor = author.trim();
  const normalizedBody = body.trim();

  if (normalizedAuthor.length < LIMITS.author.min) {
    errors.author = "Enter at least 2 characters.";
  } else if (normalizedAuthor.length > LIMITS.author.max) {
    errors.author = "Use 50 characters or fewer.";
  }

  if (normalizedBody.length < LIMITS.body.min) {
    errors.body = "Write at least 10 characters.";
  } else if (normalizedBody.length > LIMITS.body.max) {
    errors.body = "Use 1,000 characters or fewer.";
  }

  return errors;
};

const getServerFieldMessage = (value) => {
  if (Array.isArray(value)) return value[0] || "Check this field.";
  return typeof value === "string" ? value : "Check this field.";
};

const ArticleDiscussion = ({ article }) => {
  const articleId = article?.id;
  const discussionHeadingRef = useRef(null);
  const deleteButtonRefs = useRef(new Map());
  const authorInputRef = useRef(null);
  const bodyInputRef = useRef(null);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [timestampNow, setTimestampNow] = useState(() => Date.now());
  const commentsQuery = useCommentsQuery(articleId);
  const createComment = useCreateCommentMutation(articleId);
  const deleteComment = useDeleteCommentMutation(articleId);
  const comments = commentsQuery.data?.comments;
  const meta = commentsQuery.data?.meta;
  const hasCommentsData = Boolean(commentsQuery.data);
  const sortedComments = useMemo(
    () =>
      [...(comments || [])].sort((first, second) => {
        const firstTimestamp = new Date(first.createdAt).getTime() || 0;
        const secondTimestamp = new Date(second.createdAt).getTime() || 0;
        return secondTimestamp - firstTimestamp;
      }),
    [comments]
  );
  const metaTotal = Number(meta?.total);
  const articleTotal = Number(article?.commentCount);
  const totalComments = Number.isFinite(metaTotal)
    ? metaTotal
    : Number.isFinite(articleTotal)
      ? articleTotal
      : sortedComments.length;
  const hasPendingMutation = useCommentsMutationsPending(articleId);
  const isPosting = createComment.isPending;
  const deletingCommentId = deleteComment.isPending
    ? String(deleteComment.variables)
    : "";
  const discussionTitleId = `discussion-title-${articleId}`;
  const authorInputId = `comment-author-${articleId}`;
  const authorErrorId = `${authorInputId}-error`;
  const bodyInputId = `comment-body-${articleId}`;
  const bodyHelpId = `${bodyInputId}-help`;
  const bodyErrorId = `${bodyInputId}-error`;

  useEffect(() => {
    const intervalId = window.setInterval(
      () => setTimestampNow(Date.now()),
      60 * 1000
    );

    return () => window.clearInterval(intervalId);
  }, []);

  const clearTransientFeedback = () => {
    setSubmitError("");
    setStatusMessage("");
  };

  const focusFirstInvalidField = (errors) => {
    const fieldRef = errors.author ? authorInputRef : bodyInputRef;

    window.requestAnimationFrame(() => fieldRef.current?.focus());
  };

  const handleAuthorChange = (event) => {
    const nextAuthor = event.target.value;
    setAuthor(nextAuthor);
    clearTransientFeedback();

    if (fieldErrors.author) {
      setFieldErrors((current) => ({
        ...current,
        author: getValidationErrors(nextAuthor, body).author,
      }));
    }
  };

  const handleBodyChange = (event) => {
    const nextBody = event.target.value;
    setBody(nextBody);
    clearTransientFeedback();

    if (fieldErrors.body) {
      setFieldErrors((current) => ({
        ...current,
        body: getValidationErrors(author, nextBody).body,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (hasPendingMutation) return;

    clearTransientFeedback();

    const validationErrors = getValidationErrors(author, body);
    setFieldErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      focusFirstInvalidField(validationErrors);
      return;
    }

    try {
      await createComment.mutateAsync({
        author: author.trim(),
        body: body.trim(),
      });
      setBody("");
      setFieldErrors({});
      setStatusMessage("Comment posted.");
    } catch (error) {
      const serverErrors = {};

      if (error?.fields?.author) {
        serverErrors.author = getServerFieldMessage(error.fields.author);
      }
      if (error?.fields?.body) {
        serverErrors.body = getServerFieldMessage(error.fields.body);
      }

      if (Object.keys(serverErrors).length > 0) {
        setFieldErrors(serverErrors);
        focusFirstInvalidField(serverErrors);
      } else {
        setSubmitError(
          error?.message || "Your comment could not be posted. Try again."
        );
      }
    }
  };

  const handleDelete = (commentId) => {
    if (hasPendingMutation) return;

    clearTransientFeedback();
    deleteComment.mutate(commentId, {
      onSuccess: () => {
        setStatusMessage("Comment deleted.");
        discussionHeadingRef.current?.focus();
      },
      onError: () => {
        window.requestAnimationFrame(() => {
          deleteButtonRefs.current
            .get(String(commentId))
            ?.focus({ preventScroll: true });
        });
      },
    });
  };

  const getDiscussionSummary = () => {
    if (commentsQuery.isPending) return "Loading recent reader perspectives.";
    if (sortedComments.length === 0) {
      return "Add a thoughtful question or a useful engineering perspective.";
    }
    if (totalComments > sortedComments.length) {
      return `Showing ${sortedComments.length} recent of ${totalComments} comments.`;
    }
    return "Practical notes and questions from readers.";
  };

  return (
    <section className="article-discussion" aria-labelledby={discussionTitleId}>
      <header className="article-discussion__header">
        <div>
          <span className="article-discussion__eyebrow">Discussion</span>
          <h2
            id={discussionTitleId}
            ref={discussionHeadingRef}
            tabIndex="-1"
          >
            Recent discussion
          </h2>
          <p>{getDiscussionSummary()}</p>
        </div>
        <span
          className="article-discussion__count"
          aria-live="polite"
          aria-label={`${totalComments} ${
            totalComments === 1 ? "comment" : "comments"
          }`}
        >
          {totalComments} {totalComments === 1 ? "comment" : "comments"}
        </span>
      </header>

      <form
        className="comment-composer"
        aria-busy={hasPendingMutation}
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="comment-composer__heading">
          <h3>Add to the conversation</h3>
          <p>Share a specific question, tradeoff, or practical observation.</p>
        </div>

        <div className="comment-composer__field comment-composer__identity">
          <label htmlFor={authorInputId}>Display name</label>
          <input
            ref={authorInputRef}
            id={authorInputId}
            type="text"
            autoComplete="name"
            value={author}
            minLength={LIMITS.author.min}
            maxLength={LIMITS.author.max}
            required
            disabled={hasPendingMutation}
            aria-invalid={Boolean(fieldErrors.author)}
            aria-describedby={fieldErrors.author ? authorErrorId : undefined}
            placeholder="Your name"
            onChange={handleAuthorChange}
          />
          {fieldErrors.author && (
            <small className="comment-composer__field-error" id={authorErrorId}>
              {fieldErrors.author}
            </small>
          )}
        </div>

        <div className="comment-composer__field">
          <label htmlFor={bodyInputId}>Comment</label>
          <textarea
            ref={bodyInputRef}
            id={bodyInputId}
            value={body}
            rows="5"
            minLength={LIMITS.body.min}
            maxLength={LIMITS.body.max}
            required
            disabled={hasPendingMutation}
            aria-invalid={Boolean(fieldErrors.body)}
            aria-describedby={`${bodyHelpId}${
              fieldErrors.body ? ` ${bodyErrorId}` : ""
            }`}
            placeholder="Share a useful technical observation..."
            onChange={handleBodyChange}
          />
          <div className="comment-composer__field-meta" id={bodyHelpId}>
            <span>10-1,000 characters</span>
            <span aria-label={`${body.length} of 1000 characters used`}>
              {body.length}/1,000
            </span>
          </div>
          {fieldErrors.body && (
            <small className="comment-composer__field-error" id={bodyErrorId}>
              {fieldErrors.body}
            </small>
          )}
        </div>

        <div className="comment-composer__footer">
          <p className="comment-composer__privacy">
            Your display name and comment are stored in this browser.
          </p>
          <button
            className="comment-composer__submit"
            type="submit"
            disabled={hasPendingMutation}
          >
            {isPosting ? "Posting..." : "Post comment"}
          </button>
        </div>

        {submitError && (
          <p className="comment-composer__feedback is-error" role="alert">
            {submitError}
          </p>
        )}
        <p
          className="comment-composer__feedback is-success"
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      </form>

      {commentsQuery.isError && hasCommentsData && (
        <div
          className="article-discussion__state is-error is-compact"
          role="status"
        >
          <strong>Recent comments may be out of date</strong>
          <p>
            {commentsQuery.error?.message ||
              "The latest discussion could not be refreshed."}
          </p>
          <button
            type="button"
            disabled={commentsQuery.isFetching}
            onClick={() => commentsQuery.refetch()}
          >
            {commentsQuery.isFetching ? "Refreshing..." : "Refresh comments"}
          </button>
        </div>
      )}

      {commentsQuery.isPending ? (
        <div
          className="article-discussion__skeleton-list"
          role="status"
          aria-busy="true"
          aria-live="polite"
        >
          <span className="article-discussion__sr-only">Loading comments</span>
          {Array.from({ length: 3 }, (_, index) => (
            <div className="comment-skeleton" aria-hidden="true" key={index}>
              <span className="comment-skeleton__avatar" />
              <span className="comment-skeleton__line is-short" />
              <span className="comment-skeleton__line" />
              <span className="comment-skeleton__line is-medium" />
            </div>
          ))}
        </div>
      ) : commentsQuery.isError && !hasCommentsData ? (
        <div className="article-discussion__state is-error" role="alert">
          <strong>Comments could not be loaded</strong>
          <p>
            {commentsQuery.error?.message ||
              "The discussion is temporarily unavailable."}
          </p>
          <button
            type="button"
            disabled={commentsQuery.isFetching}
            onClick={() => commentsQuery.refetch()}
          >
            {commentsQuery.isFetching ? "Retrying..." : "Try again"}
          </button>
        </div>
      ) : sortedComments.length === 0 ? (
        <div className="article-discussion__state is-empty">
          <span aria-hidden="true">+</span>
          <strong>Start the discussion</strong>
          <p>Be the first reader to add a useful perspective.</p>
        </div>
      ) : (
        <ol className="comment-list" aria-label="Recent comments">
          {sortedComments.map((comment) => {
            const isDeleting =
              deleteComment.isPending &&
              deletingCommentId === String(comment.id);
            const hasDeleteError =
              deleteComment.isError &&
              String(deleteComment.variables) === String(comment.id);

            return (
              <li key={comment.id}>
                <article className="comment-card">
                  <div className="comment-card__avatar" aria-hidden="true">
                    {getInitials(comment.author)}
                  </div>
                  <div className="comment-card__content">
                    <header className="comment-card__header">
                      <div>
                        <div className="comment-card__identity">
                          <strong>{comment.author}</strong>
                          {comment.viewerOwned && (
                            <span className="comment-card__badge">You</span>
                          )}
                        </div>
                        <time
                          dateTime={comment.createdAt}
                          title={getAbsoluteTimestamp(comment.createdAt)}
                        >
                          {getRelativeTimestamp(
                            comment.createdAt,
                            timestampNow
                          )}
                        </time>
                      </div>
                      {comment.viewerOwned && (
                        <button
                          ref={(node) => {
                            const commentKey = String(comment.id);

                            if (node) {
                              deleteButtonRefs.current.set(commentKey, node);
                            } else {
                              deleteButtonRefs.current.delete(commentKey);
                            }
                          }}
                          className="comment-card__delete"
                          type="button"
                          disabled={hasPendingMutation}
                          aria-label={`Delete comment by ${comment.author}`}
                          onClick={() => handleDelete(comment.id)}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      )}
                    </header>
                    <p className="comment-card__body">{comment.body}</p>
                    {hasDeleteError && (
                      <p className="comment-card__error" role="alert">
                        {deleteComment.error?.message ||
                          "This comment could not be deleted. Try again."}
                      </p>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
};

export default ArticleDiscussion;
