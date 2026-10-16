import React, { useRef } from "react";
import { Link } from "react-router-dom";

const MainSlider = () => {
  const visualRef = useRef(null);

  const handleVisualPointerMove = (event) => {
    if (
      !visualRef.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const bounds = visualRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    visualRef.current.style.setProperty("--hero-shift-x", `${x * 10}px`);
    visualRef.current.style.setProperty("--hero-shift-y", `${y * 8}px`);
    visualRef.current.style.setProperty("--hero-rotate-x", `${y * -3}deg`);
    visualRef.current.style.setProperty("--hero-rotate-y", `${x * 5}deg`);
    visualRef.current.style.setProperty("--hero-glow-x", `${x * -18}px`);
    visualRef.current.style.setProperty("--hero-glow-y", `${y * -14}px`);
  };

  const resetVisualPosition = () => {
    if (!visualRef.current) return;

    [
      "--hero-shift-x",
      "--hero-shift-y",
      "--hero-rotate-x",
      "--hero-rotate-y",
      "--hero-glow-x",
      "--hero-glow-y",
    ].forEach((property) => visualRef.current.style.removeProperty(property));
  };

  return (
    <section className="hero">
      <div className="hero__shape hero__shape--one" aria-hidden="true"></div>
      <div className="hero__shape hero__shape--two" aria-hidden="true"></div>
      <div className="container">
        <div className="hero__grid">
          <div className="hero__content">
            <span className="hero__badge">
              <span aria-hidden="true"></span>
              Senior Frontend Product Engineer
            </span>
            <h1>
              I design and build <span>software that delivers.</span>
            </h1>
            <p>
              M-Agency is a portfolio of product-minded frontend work, turning
              complex ideas into clear, reliable digital experiences from
              interface architecture through delivery.
            </p>
            <div className="hero__actions">
              <Link className="hero__button hero__button--primary" to="/work">
                View selected work
                <span aria-hidden="true">→</span>
              </Link>
              <Link className="hero__button hero__button--secondary" to="/#services">
                Explore services
              </Link>
            </div>

            <ul className="hero__capabilities" aria-label="Core delivery capabilities">
              <li>
                <span aria-hidden="true"></span>
                <div>
                  <strong>Product UI</strong>
                  <small>Clear interfaces</small>
                </div>
              </li>
              <li>
                <span aria-hidden="true"></span>
                <div>
                  <strong>Frontend systems</strong>
                  <small>Built to scale</small>
                </div>
              </li>
              <li>
                <span aria-hidden="true"></span>
                <div>
                  <strong>Delivery</strong>
                  <small>Ready to ship</small>
                </div>
              </li>
            </ul>
          </div>

          <div
            ref={visualRef}
            className="hero-visual"
            role="img"
            aria-label="Digital product delivery dashboard mockup"
            onPointerMove={handleVisualPointerMove}
            onPointerLeave={resetVisualPosition}
          >
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
