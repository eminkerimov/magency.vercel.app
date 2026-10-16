import { Link } from "react-router-dom";
import ContentState from "../components/ContentState";
import { CasePreview } from "../components/SelectedWork";
import Seo from "../components/Seo";
import { useCaseStudiesQuery } from "../features/caseStudies/queries";

const Work = () => {
  const { data, error, isError, isPending, refetch } = useCaseStudiesQuery();
  const cases = Array.isArray(data) ? data : [];

  const handleCardPointerMove = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const pointerY = ((event.clientY - bounds.top) / bounds.height) * 100;

    event.currentTarget.style.setProperty("--pointer-x", `${pointerX}%`);
    event.currentTarget.style.setProperty("--pointer-y", `${pointerY}%`);
  };

  const resetCardPointer = (event) => {
    event.currentTarget.style.removeProperty("--pointer-x");
    event.currentTarget.style.removeProperty("--pointer-y");
  };

  return (
    <main className="work-page">
      <Seo
        title="Frontend Case Studies | M-Agency"
        description="Explore three frontend portfolio case studies spanning media discovery, editorial archives, and nature-stay booking experiences."
        path="/work"
      />

      <section className="work-hero">
        <div className="container work-hero__layout">
          <div className="work-hero__content">
            <span className="work-hero__eyebrow">Selected frontend work</span>
            <h1>
              Products with a <span>clear point of view.</span>
            </h1>
            <p>
              Independent builds that turn complex content, state, and user
              journeys into focused digital experiences.
            </p>
          </div>

          <div className="work-hero__note">
            <span>Selected case studies</span>
            <p>Case studies covering product UI, frontend systems, and client-side architecture.</p>
          </div>
        </div>
      </section>

      <section className="work-index" aria-labelledby="work-index-title">
        <div className="container">
          <div className="work-index__heading">
            <span>Case study index</span>
            <h2 id="work-index-title">Explore the work</h2>
          </div>

          {!isPending && !isError && cases.length > 0 ? (
            <nav className="work-index__jump" aria-label="Jump to a case study">
              {cases.map((study) => (
                <a
                  className={`work-jump work-jump--${study.visual}`}
                  href={`#case-${study.slug}`}
                  key={study.slug}
                >
                  <span className="work-jump__mark" aria-hidden="true"></span>
                  <span className="work-jump__copy">
                    <strong>{study.name}</strong>
                    <small>{study.type}</small>
                  </span>
                  <span className="work-jump__arrow" aria-hidden="true">&#8595;</span>
                </a>
              ))}
            </nav>
          ) : null}

          {isPending ? (
            <ContentState count={3} label="Loading case studies" />
          ) : isError ? (
            <ContentState
              status="error"
              title="Case studies are temporarily unavailable"
              message={error?.message || "The work catalogue could not be loaded."}
              onRetry={() => refetch()}
            />
          ) : cases.length === 0 ? (
            <ContentState
              status="empty"
              eyebrow="Selected work"
              title="No case studies yet"
              message="New product work will appear here when it is ready."
            />
          ) : (
            <div className="work-index__list">
              {cases.map((study) => (
                <article
                  className={`work-card work-card--${study.visual}`}
                  id={`case-${study.slug}`}
                  key={study.slug}
                  onPointerMove={handleCardPointerMove}
                  onPointerLeave={resetCardPointer}
                >
                  <div className="work-card__visual">
                    <CasePreview visual={study.visual} />
                  </div>

                  <div className="work-card__content">
                    <div className="work-card__meta">
                      <span>{study.type}</span>
                    </div>
                    <p className="work-card__name">{study.name}</p>
                    <h3>{study.title}</h3>
                    <p className="work-card__summary">{study.summary}</p>

                    <div className="work-card__stack" aria-label={`${study.name} technology stack`}>
                      {study.stack?.map((item) => <span key={item}>{item}</span>)}
                    </div>

                    <Link to={`/work/${study.slug}`}>
                      Read case study <span aria-hidden="true">&#8594;</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="work-cta">
        <div className="container">
          <div className="work-cta__panel">
            <div>
              <span>Have a product in motion?</span>
              <h2>Bring the next difficult interface into focus.</h2>
            </div>
            <Link to="/start-project?interest=focused-build&source=work">
              Start a project <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Work;
