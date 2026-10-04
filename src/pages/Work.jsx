import { Link } from "react-router-dom";
import ContentState from "../components/ContentState";
import { CasePreview } from "../components/SelectedWork";
import Seo from "../components/Seo";
import { useCaseStudiesQuery } from "../features/caseStudies/queries";

const Work = () => {
  const { data, error, isError, isPending, refetch } = useCaseStudiesQuery();
  const cases = Array.isArray(data) ? data : [];

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
            <h1>Products with a clear point of view.</h1>
            <p>
              Independent builds that turn complex content, state, and user
              journeys into focused digital experiences.
            </p>
          </div>

          <div className="work-hero__note">
            <span>{String(cases.length || 3).padStart(2, "0")}</span>
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
              {cases.map((study, index) => (
                <article
                  className={`work-card work-card--${study.visual}`}
                  key={study.slug}
                >
                  <div className="work-card__visual">
                    <CasePreview visual={study.visual} />
                  </div>

                  <div className="work-card__content">
                    <div className="work-card__meta">
                      <span>{study.index || String(index + 1).padStart(2, "0")}</span>
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
            <Link to="/?interest=focused-build#contact">
              Start a project <span aria-hidden="true">&#8599;</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Work;
