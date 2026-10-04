import { useRef } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useCaseStudiesQuery } from "../features/caseStudies/queries";
import ContentState from "./ContentState";

export const CasePreview = ({ visual }) => {
  if (visual === "cinema") {
    return (
      <div
        className="case-preview case-preview--cinema"
        aria-hidden="true"
      >
        <div className="case-preview__topbar">
          <span className="case-preview__dot" />
          <span className="case-preview__dot" />
          <span className="case-preview__dot" />
        </div>
        <div className="case-preview__screen">
          <div className="case-preview__sidebar">
            <span className="case-preview__nav-item">Discover</span>
            <span className="case-preview__nav-item">Movies</span>
            <span className="case-preview__nav-item">TV series</span>
            <span className="case-preview__nav-item">My library</span>
          </div>
          <div className="case-preview__main">
            <div className="case-preview__hero">
              <span>FEATURED THIS WEEK</span>
              <strong>Cinematic stories, made discoverable.</strong>
              <p>Search, explore, save, and keep watching.</p>
            </div>
            <div className="case-preview__poster-grid">
              <span className="case-preview__poster" />
              <span className="case-preview__poster" />
              <span className="case-preview__poster" />
              <span className="case-preview__poster" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (visual === "archive") {
    return (
      <div
        className="case-preview case-preview--archive"
        aria-hidden="true"
      >
        <div className="case-preview__topbar">
          <span className="case-preview__dot" />
          <span className="case-preview__dot" />
          <span className="case-preview__dot" />
        </div>
        <div className="case-preview__masthead">
          <span>FASHION ARCHIVE</span>
          <span className="case-preview__edition">
            DIGITAL MUSEUM / 2026
          </span>
        </div>
        <h4 className="case-preview__archive-title">
          The body is the archive.
        </h4>
        <div className="case-preview__rule" />
        <div className="case-preview__story-grid">
          <div className="case-preview__story">
            <h4>Silhouette and social change</h4>
            <span className="case-preview__caption">
              TIMELINE / OBJECT STUDY
            </span>
          </div>
          <div className="case-preview__story">
            <h4>Designers who shifted the frame</h4>
            <span className="case-preview__caption">
              PEOPLE / 01
            </span>
          </div>
          <div className="case-preview__story">
            <h4>Objects with connected histories</h4>
            <span className="case-preview__caption">
              COLLECTION / 04
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="case-preview case-preview--stays"
      aria-hidden="true"
    >
      <div className="case-preview__browser-bar">
        <span className="case-preview__dot" />
        <span className="case-preview__dot" />
        <span className="case-preview__dot" />
      </div>
      <div className="case-preview__browser">
        <div className="case-preview__search">
          <span>Where do you want to slow down?</span>
          <span>Search</span>
        </div>
        <div className="case-preview__stay-hero">
          <span>STAYS IN NATURE</span>
          <strong>Find room to breathe.</strong>
        </div>
        <div className="case-preview__filter-row">
          <span>Forest</span>
          <span>Cabins</span>
          <span>By the water</span>
        </div>
        <div className="case-preview__stay-grid">
          <div className="case-preview__stay-card">
            <strong>Pine House</strong>
            <span>Forest retreat</span>
          </div>
          <div className="case-preview__stay-card">
            <strong>Lake Cabin</strong>
            <span>Waterfront stay</span>
          </div>
          <div className="case-preview__stay-card">
            <strong>Hill Studio</strong>
            <span>Mountain view</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SelectedWork = () => {
  const {
    data,
    isPending,
    isError,
    refetch,
  } = useCaseStudiesQuery();
  const location = useLocation();
  const navigate = useNavigate();
  const tabRefs = useRef([]);
  const cases = Array.isArray(data)
    ? data
    : Array.isArray(data?.cases)
      ? data.cases
      : [];
  const requestedSlug = new URLSearchParams(location.search).get(
    "work"
  );
  const activeIndex = Math.max(
    0,
    cases.findIndex((study) => study.slug === requestedSlug)
  );
  const activeCase = cases[activeIndex];

  const selectCase = (index) => {
    const study = cases[index];

    if (!study || study.slug === requestedSlug) {
      return;
    }

    const params = new URLSearchParams(location.search);
    params.set("work", study.slug);
    navigate(
      {
        pathname: location.pathname,
        search: `?${params.toString()}`,
        hash: "#work",
      },
      {
        state: {
          ...location.state,
          preserveScroll: true,
        },
        preventScrollReset: true,
      }
    );
  };

  const handleTabKeyDown = (event, index) => {
    let nextIndex;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % cases.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + cases.length) % cases.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = cases.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
    selectCase(nextIndex);
  };

  return (
    <section
      className="selected-work"
      id="work"
      aria-labelledby="selected-work-heading"
    >
      <div className="container">
        <div className="selected-work__heading">
          <div>
            <span className="selected-work__eyebrow">
              Proof in the product
            </span>
            <h2 id="selected-work-heading">Selected Work</h2>
          </div>
          <p>
            Focused frontend work, shaped around the experience each
            product needed.
          </p>
        </div>

        {isPending ? (
          <ContentState
            label="Loading selected work"
            count={3}
          />
        ) : isError ? (
          <ContentState
            status="error"
            title="Selected work is unavailable"
            message="The case studies could not be loaded. Please try again."
            onRetry={() => refetch()}
          />
        ) : !activeCase ? (
          <ContentState
            status="empty"
            eyebrow="Selected work"
            title="No case studies yet"
            message="There are no projects to display right now."
          />
        ) : (
          <>
            <div
              className="selected-work__tabs"
              role="tablist"
              aria-label="Choose a case study"
            >
              {cases.map((study, index) => (
                <button
                  key={study.slug}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`selected-work-tab-${index}`}
                  className={
                    "selected-work__tab" +
                    (index === activeIndex ? " is-active" : "")
                  }
                  role="tab"
                  type="button"
                  aria-controls="selected-work-panel"
                  aria-selected={index === activeIndex}
                  tabIndex={index === activeIndex ? 0 : -1}
                  onClick={() => selectCase(index)}
                  onKeyDown={(event) =>
                    handleTabKeyDown(event, index)
                  }
                >
                  <span className="selected-work__tab-index">
                    {study.index ||
                      String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="selected-work__tab-copy">
                    <strong>{study.name || study.title}</strong>
                    <small>{study.type}</small>
                  </span>
                  <span
                    className="selected-work__tab-arrow"
                    aria-hidden="true"
                  >
                    &#8599;
                  </span>
                </button>
              ))}
            </div>

            <div
              key={activeCase.slug}
              id="selected-work-panel"
              className={`selected-work__panel selected-work__panel--${activeCase.visual}`}
              role="tabpanel"
              aria-labelledby={`selected-work-tab-${activeIndex}`}
              tabIndex={0}
            >
              <div className="selected-work__visual">
                <CasePreview visual={activeCase.visual} />
              </div>

              <div className="selected-work__content">
                <div className="selected-work__meta">
                  <span>{activeCase.type}</span>
                  <span>
                    {activeCase.index ||
                      String(activeIndex + 1).padStart(2, "0")}{" "}
                    / {String(cases.length).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="selected-work__title">
                  {activeCase.title}
                </h3>
                <p className="selected-work__summary">
                  {activeCase.summary}
                </p>

                <div className="selected-work__details">
                  <div className="selected-work__detail selected-work__detail--wide">
                    <h4>The challenge</h4>
                    <p>{activeCase.challenge}</p>
                  </div>
                  <div className="selected-work__detail">
                    <h4>Delivered</h4>
                    <ul>
                      {activeCase.delivered?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="selected-work__detail">
                    <h4>Frontend decisions</h4>
                    <ul>
                      {activeCase.decisions?.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  className="selected-work__stack"
                  aria-label="Technology stack"
                >
                  {activeCase.stack?.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <div className="selected-work__outcome">
                  <h4>Outcome</h4>
                  <p>{activeCase.outcome}</p>
                </div>

                <div className="selected-work__actions">
                  <Link
                    className="selected-work__case-link"
                    to={`/work/${activeCase.slug}`}
                  >
                    View full case study
                    <span aria-hidden="true">&#8594;</span>
                  </Link>
                  <Link
                    className="selected-work__cta"
                    to={`/?interest=${activeCase.engagement || "focused-build"}#contact`}
                  >
                    Build something together
                    <span aria-hidden="true">&#8599;</span>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SelectedWork;
