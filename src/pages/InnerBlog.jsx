import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { articles } from "../data/data";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

const InnerBlog = () => {
  const { id } = useParams();
  const [readingProgress, setReadingProgress] = useState(0);
  const [comment, setComment] = useState("");
  const [commentSent, setCommentSent] = useState(false);

  const articleIndex = articles.findIndex(
    (item) => String(item.id) === String(id)
  );

  const article = articles[articleIndex];

  useEffect(() => {
    setComment("");
    setCommentSent(false);
  }, [id]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];

    const matchingArticles = articles.filter(
      (item) =>
        item.id !== article.id &&
        (item.category === article.category ||
          item.tags?.some((tag) => article.tags?.includes(tag)))
    );

    const fallbackArticles = articles.filter(
      (item) =>
        item.id !== article.id &&
        !matchingArticles.some((match) => match.id === item.id)
    );

    return [...matchingArticles, ...fallbackArticles].slice(0, 3);
  }, [article]);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop =
        window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      setReadingProgress(
        scrollHeight > 0 ? Math.min((scrollTop / scrollHeight) * 100, 100) : 0
      );
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  if (!article) {
    return <Navigate to="/blogs" replace />;
  }

  const previousArticle =
    articleIndex > 0 ? articles[articleIndex - 1] : null;
  const nextArticle =
    articleIndex < articles.length - 1
      ? articles[articleIndex + 1]
      : null;

  const handleComment = (event) => {
    event.preventDefault();

    if (!comment.trim()) return;

    setCommentSent(true);
    setComment("");
  };

  return (
    <main className="article-page">
      <div
        className="article-progress"
        style={{ width: `${readingProgress}%` }}
        aria-hidden="true"
      />

      <section className="article-hero">
        <div className="container">
          <Link className="article-hero__back" to="/blogs">
            ← Back to articles
          </Link>

          <div className="article-hero__content">
            <span className="article-hero__category">
              {article.category}
            </span>

            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>

            <div className="article-hero__meta">
              <div>
                <strong>{article.author}</strong>
                <span>Engineering author</span>
              </div>

              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>

              <span>{article.readingTime} min read</span>
              <span>{article.commentCount} comments</span>
            </div>
          </div>
        </div>
      </section>

      <section className="article-cover">
        <div className="container">
          <img src={article.image} alt={article.title} />
        </div>
      </section>

      <section className="article-content">
        <div className="container article-content__layout">
          <aside className="article-toc">
            <span>On this page</span>
            <nav>
              <a href="#overview">Overview</a>
              <a href="#architecture">Architecture decisions</a>
              <a href="#implementation">Implementation</a>
              <a href="#observability">Observability</a>
              <a href="#conclusion">Conclusion</a>
            </nav>
          </aside>

          <article className="article-body">
            <section id="overview">
              <p className="article-body__lead">
                Production software fails in ways that are rarely visible in
                small demos. A useful engineering approach starts by separating
                expected failure states from unexpected faults and deciding
                exactly where recovery belongs.
              </p>

              <p>
                The goal is not to eliminate every error. The goal is to contain
                impact, preserve useful context, and give both users and
                engineers enough information to recover quickly.
              </p>
            </section>

            <section id="architecture">
              <h2>Architecture decisions should follow product boundaries</h2>

              <p>
                Technical boundaries work best when they match meaningful user
                tasks. A dashboard widget, editor, billing panel, or search
                result area can often fail independently without replacing the
                entire application.
              </p>

              <blockquote>
                Recovery UI is part of the product experience, not a fallback
                added after implementation.
              </blockquote>

              <p>
                Keep server state, local interaction state, route state, and
                long-lived application state separate. This makes failures
                easier to reason about and prevents a single dependency from
                controlling unrelated areas of the interface.
              </p>
            </section>

            <section id="implementation">
              <h2>Make failure paths explicit in the implementation</h2>

              <p>
                Error handling becomes easier to maintain when each layer has a
                clear responsibility. Components render states, services
                normalize external responses, and monitoring captures enough
                context to explain what happened.
              </p>

              <pre>
                <code>{`async function loadArticle(id) {
  const response = await fetch(\`/api/articles/\${id}\`);

  if (!response.ok) {
    throw new Error("Article request failed");
  }

  return response.json();
}`}</code>
              </pre>

              <p>
                Avoid hiding failures behind generic catch blocks. Handle known
                states directly and reserve unexpected errors for boundaries
                that can report and isolate them.
              </p>
            </section>

            <section id="observability">
              <h2>Observability must explain impact, not only errors</h2>

              <p>
                Useful reports include route, release version, affected feature,
                correlation identifier, and the boundary that handled the
                failure. Do not collect private user data unless it is strictly
                necessary.
              </p>

              <ul>
                <li>Track failure frequency by feature and release.</li>
                <li>Measure successful recovery after retry actions.</li>
                <li>Connect client errors with backend traces.</li>
                <li>Review recurring fallbacks as product defects.</li>
              </ul>
            </section>

            <section id="conclusion">
              <h2>Conclusion</h2>

              <p>
                Reliable interfaces are designed around containment, recovery,
                and visibility. When these decisions are made early, the
                application stays useful during failure and the engineering
                team receives actionable signals instead of vague reports.
              </p>
            </section>
          </article>

          <aside className="article-share">
            <span>Share</span>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
            >
              Copy link
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                article.title
              )}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
            >
              X / Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                window.location.href
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </aside>
        </div>

        <div className="container article-content__end">
          <div className="article-content__end-inner">
            <div className="article-tags">
              {article.tags?.map((tag) => (
                <Link key={tag} to={`/blogs?q=${encodeURIComponent(tag)}`}>
                  {tag}
                </Link>
              ))}
            </div>

            <div className="article-author">
              <div className="article-author__avatar">
                {article.author
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>

              <div>
                <span>Written by</span>
                <h2>{article.author}</h2>
                <p>
                  Engineering author focused on production architecture,
                  reliability, and practical frontend systems.
                </p>
              </div>
            </div>

            <form className="article-comment" onSubmit={handleComment}>
              <div>
                <span>Discussion</span>
                <h2>Leave a comment</h2>
              </div>

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share a useful technical observation..."
                rows="5"
                required
              />

              <button type="submit">Post comment</button>

              {commentSent && (
                <small>Your comment was added to the demo state.</small>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="article-navigation">
        <div className="container">
          {previousArticle ? (
            <Link to={`/blog/${previousArticle.id}`}>
              <span>Previous article</span>
              <strong>{previousArticle.title}</strong>
            </Link>
          ) : (
            <div />
          )}

          {nextArticle ? (
            <Link to={`/blog/${nextArticle.id}`}>
              <span>Next article</span>
              <strong>{nextArticle.title}</strong>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>

      {relatedArticles.length > 0 && (
        <section className="article-related">
          <div className="container">
            <div className="article-related__heading">
              <span>Continue reading</span>
              <h2>Related articles</h2>
            </div>

            <div className="article-related__grid">
              {relatedArticles.map((item) => (
                <article key={item.id}>
                  <Link to={`/blog/${item.id}`}>
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </Link>

                  <div>
                    <span>{item.category}</span>
                    <h3>
                      <Link to={`/blog/${item.id}`}>{item.title}</Link>
                    </h3>
                    <p>{item.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default InnerBlog;
