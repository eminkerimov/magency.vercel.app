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
              Software Product Agency
            </span>
            <h1>
              We design and build <span>software that delivers.</span>
            </h1>
            <p>
              M-Agency helps ambitious teams turn complex ideas into clear,
              reliable digital products—from interface to infrastructure.
            </p>
            <div className="hero__actions">
              <Link className="hero__button hero__button--primary" to="/#contact">
                Start a project
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="hero__button hero__button--secondary" to="/#services">
                Explore services
              </Link>
            </div>
          </div>

          <div className="hero-visual" role="img" aria-label="Digital product delivery dashboard mockup">
            <div className="hero-visual__glow" aria-hidden="true"></div>
            <div className="hero-code-card">
              <div className="hero-code-card__header">
                <div className="hero-code-card__dots" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>product.tsx</span>
                <span className="hero-code-card__status">Shipping</span>
              </div>
              <div className="hero-code-card__body">
                <span className="code-line">
                  <span className="code-keyword">const</span> product = <span className="code-keyword">await</span> build({"{"}
                </span>
                <span className="code-line code-line--indent">
                  experience: <span className="code-string">&quot;focused&quot;</span>,
                </span>
                <span className="code-line code-line--indent">
                  foundation: <span className="code-string">&quot;scalable&quot;</span>,
                </span>
                <span className="code-line">{"}"});</span>
                <span className="code-line code-line--empty">&nbsp;</span>
                <span className="code-line">
                  <span className="code-keyword">return</span> <span className="code-tag">&lt;Product</span>
                </span>
                <span className="code-line code-line--indent">
                  ready <span className="code-tag">/&gt;</span>;
                </span>
              </div>
              <div className="hero-code-card__footer">
                <div>
                  <span>Delivery standard</span>
                  <strong>Production-ready</strong>
                </div>
                <span className="hero-code-card__published">Shipped</span>
              </div>
            </div>

            <div className="hero-metric-card">
              <div className="hero-metric-card__top">
                <span>Product quality</span>
                <strong>Measured</strong>
              </div>
              <b>Ready</b>
              <div className="hero-metric-card__bars" aria-hidden="true">
                <span></span><span></span><span></span><span></span><span></span><span></span>
              </div>
            </div>

            <div className="hero-topic-card">
              <span className="hero-topic-card__icon" aria-hidden="true">&lt;/&gt;</span>
              <div>
                <span>Core capability</span>
                <strong>Product Engineering</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainSlider;
