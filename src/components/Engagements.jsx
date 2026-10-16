import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { engagements } from "../data/engagements";

const initialEngagement =
  engagements.find((engagement) => engagement.badge)?.id || engagements[0]?.id;

const Engagements = () => {
  const [activeId, setActiveId] = useState(initialEngagement);
  const tabRefs = useRef([]);
  const activeIndex = Math.max(
    engagements.findIndex((engagement) => engagement.id === activeId),
    0
  );
  const activeEngagement = engagements[activeIndex];

  const activateTab = (nextIndex) => {
    const index = (nextIndex + engagements.length) % engagements.length;
    tabRefs.current[index]?.focus();
    setActiveId(engagements[index].id);
  };

  const handleTabKeyDown = (event, index) => {
    const directions = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: engagements.length - 1,
    };

    if (!(event.key in directions)) return;
    event.preventDefault();
    activateTab(directions[event.key]);
  };

  return (
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

      <div className="engagements__workspace">
        <div
          className="engagements__rail"
          role="tablist"
          aria-label="Engagement formats"
        >
          {engagements.map((engagement, index) => {
            const isActive = engagement.id === activeEngagement.id;

            return (
              <button
                ref={(element) => { tabRefs.current[index] = element; }}
                className={"engagement-tab" + (isActive ? " is-active" : "")}
                id={`engagement-tab-${engagement.id}`}
                type="button"
                role="tab"
                aria-controls={`engagement-panel-${engagement.id}`}
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                key={engagement.id}
                onClick={() => setActiveId(engagement.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
              >
                <span className="engagement-tab__mark" aria-hidden="true"></span>
                <span className="engagement-tab__copy">
                  <small>{engagement.type}</small>
                  <strong>{engagement.title}</strong>
                </span>
                <span className="engagement-tab__arrow" aria-hidden="true">&#8594;</span>
              </button>
            );
          })}
        </div>
        <article
          className={`engagement-panel engagement-panel--${activeEngagement.id}`}
          id={`engagement-panel-${activeEngagement.id}`}
          role="tabpanel"
          aria-labelledby={`engagement-tab-${activeEngagement.id}`}
          key={activeEngagement.id}
        >
          <header className="engagement-panel__header">
            <div>
              <span>{activeEngagement.type}</span>
              <h3>{activeEngagement.title}</h3>
            </div>
            {activeEngagement.badge && (
              <strong className="engagement-panel__badge">
                {activeEngagement.badge}
              </strong>
            )}
          </header>

          <div className="engagement-panel__overview">
            <div>
              <span>Best for</span>
              <p>{activeEngagement.bestFor}</p>
            </div>
            <div>
              <span>Typical format</span>
              <p>{activeEngagement.format}</p>
            </div>
          </div>

          <div className="engagement-panel__details">
            <div className="engagement-panel__outcome">
              <span>Expected outcome</span>
              <p>{activeEngagement.outcome}</p>
            </div>
            <div className="engagement-panel__included">
              <span>Included focus</span>
              <ul>
                {activeEngagement.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            className="engagement-panel__cta"
            to={{
              pathname: "/start-project",
              search: `?interest=${activeEngagement.id}`,
            }}
          >
            {activeEngagement.cta}
            <span aria-hidden="true">&#8594;</span>
          </Link>
        </article>
      </div>
      </div>
    </section>
  );
};

export default Engagements;
