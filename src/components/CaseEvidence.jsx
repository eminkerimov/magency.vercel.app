import { useId, useRef, useState } from "react";

const CaseEvidence = ({ items = [], projectName }) => {
  const sectionId = useId();
  const tabRefs = useRef([]);
  const [activeKey, setActiveKey] = useState(items[0]?.key || "");

  if (!items.length) return null;

  const activeIndex = Math.max(
    items.findIndex((item) => item.key === activeKey),
    0
  );
  const activeItem = items[activeIndex];

  const selectTab = (index, moveFocus = false) => {
    const normalizedIndex = (index + items.length) % items.length;

    setActiveKey(items[normalizedIndex].key);

    if (moveFocus) {
      window.requestAnimationFrame(() => {
        tabRefs.current[normalizedIndex]?.focus();
      });
    }
  };

  const handleTabKeyDown = (event, index) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectTab(index + 1, true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectTab(index - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectTab(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      selectTab(items.length - 1, true);
    }
  };

  return (
    <div className="case-evidence">
      <div className="case-evidence__intro">
        <div>
          <span className="case-evidence__eyebrow">Inspect the build</span>
          <h3 id={`${sectionId}-title`}>Where the frontend work shows up.</h3>
        </div>
        <p>
          Explore the decisions behind {projectName}, grouped by the parts of
          the experience a reviewer can inspect.
        </p>
      </div>

      <div
        className="case-evidence__tabs"
        role="tablist"
        aria-label={`${projectName} implementation evidence`}
      >
        {items.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              aria-controls={`${sectionId}-panel-${item.key}`}
              aria-selected={isActive}
              className={isActive ? "is-active" : ""}
              id={`${sectionId}-tab-${item.key}`}
              key={item.key}
              onClick={() => selectTab(index)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              <span aria-hidden="true"></span>
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`${sectionId}-tab-${activeItem.key}`}
        className="case-evidence__panel"
        id={`${sectionId}-panel-${activeItem.key}`}
        key={activeItem.key}
        role="tabpanel"
        tabIndex="0"
      >
        <div className="case-evidence__panel-copy">
          <span>{activeItem.label}</span>
          <h4>{activeItem.title}</h4>
          <p>{activeItem.summary}</p>
        </div>

        <ul className="case-evidence__points">
          {activeItem.points.map((point) => (
            <li key={point}>
              <span aria-hidden="true"></span>
              <p>{point}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CaseEvidence;
