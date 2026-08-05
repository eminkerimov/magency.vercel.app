import React from "react";
import { Link } from "react-router-dom";

const MainSlider = () => {
  return (
    <section className="hero">
      <div className="hero__shape hero__shape--one" aria-hidden="true"></div>
      <div className="hero__shape hero__shape--two" aria-hidden="true"></div>
      <div className="container">
        <div className="hero__grid">
          <div className="hero__content">
            <span className="hero__badge">
              <span aria-hidden="true"></span>
              Developer Blog
            </span>
            <h1>
              Build better software with <span>ideas that ship.</span>
            </h1>
            <p>
              Practical engineering guides, architecture deep dives, and
              production lessons for developers building modern products.
            </p>
            <div className="hero__actions">
              <Link className="hero__button hero__button--primary" to="/blogs">
                Start Reading
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="hero__button hero__button--secondary" to="/#portfolio">
                Explore Articles
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-label="Developer article publishing dashboard mockup">
            <div className="hero-visual__glow" aria-hidden="true"></div>
            <div className="hero-code-card">
              <div className="hero-code-card__header">
                <div className="hero-code-card__dots" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>article.tsx</span>
                <span className="hero-code-card__status">Live</span>
              </div>
              <div className="hero-code-card__body">
                <span className="code-line">
                  <span className="code-keyword">const</span> article = <span className="code-keyword">await</span> publish({"{"}
                </span>
                <span className="code-line code-line--indent">
                  topic: <span className="code-string">&quot;React architecture&quot;</span>,
                </span>
                <span className="code-line code-line--indent">
                  depth: <span className="code-string">&quot;production&quot;</span>,
                </span>
                <span className="code-line">{"}"});</span>
                <span className="code-line code-line--empty">&nbsp;</span>
                <span className="code-line">
                  <span className="code-keyword">return</span> <span className="code-tag">&lt;ArticleCard</span>
                </span>
                <span className="code-line code-line--indent">
                  article={"{"}article{"}"} <span className="code-tag">/&gt;</span>;
                </span>
              </div>
              <div className="hero-code-card__footer">
                <div>
                  <span>Editorial score</span>
                  <strong>Production-ready</strong>
                </div>
                <span className="hero-code-card__published">Published</span>
              </div>
            </div>

            <div className="hero-metric-card">
              <div className="hero-metric-card__top">
                <span>Weekly readers</span>
                <strong>+12.8%</strong>
              </div>
              <b>24.8K</b>
              <div className="hero-metric-card__bars" aria-hidden="true">
                <span></span><span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>

            <div className="hero-topic-card">
              <span className="hero-topic-card__icon" aria-hidden="true">&lt;/&gt;</span>
              <div>
                <span>Trending topic</span>
                <strong>System Design</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainSlider;
