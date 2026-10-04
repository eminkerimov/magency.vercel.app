import React from "react";
import { Link } from "react-router-dom";
import { engagements } from "../data/engagements";

const Engagements = () => (
  <section
    className="engagements"
    id="engagements"
    aria-labelledby="engagements-title"
  >
    <div className="container">
      <header className="engagements__heading">
        <div>
          <span>Ways to work together</span>
          <h2 id="engagements-title">Choose the right shape for the work</h2>
        </div>
        <p>
          Start with clarity, deliver a focused milestone, or keep improving an
          existing product. Scope and timing are agreed after discovery.
        </p>
      </header>

      <div className="engagements__grid">
        {engagements.map((engagement, index) => (
          <article
            className={
              "engagement-card" +
              (engagement.badge ? " engagement-card--featured" : "")
            }
            key={engagement.id}
          >
            {engagement.badge && (
              <span className="engagement-card__badge">
                {engagement.badge}
              </span>
            )}

            <header className="engagement-card__header">
              <span className="engagement-card__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <span className="engagement-card__type">{engagement.type}</span>
                <h3>{engagement.title}</h3>
              </div>
            </header>

            <div className="engagement-card__summary">
              <span>Best for</span>
              <p>{engagement.bestFor}</p>
            </div>

            <div className="engagement-card__format">
              <span>Typical format</span>
              <strong>{engagement.format}</strong>
            </div>

            <p className="engagement-card__outcome">{engagement.outcome}</p>

            <ul className="engagement-card__features">
              {engagement.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <Link
              className="engagement-card__cta"
              to={{
                pathname: "/",
                search: `?interest=${engagement.id}`,
                hash: "#contact",
              }}
            >
              {engagement.cta}
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Engagements;
