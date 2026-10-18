import { Link, useParams } from "react-router-dom";
import ContentState from "../components/ContentState";
import CaseEvidence from "../components/CaseEvidence";
import NotFound from "../components/NotFound";
import { CasePreview } from "../components/SelectedWork";
import Seo from "../components/Seo";
import { useCaseStudiesQuery } from "../features/caseStudies/queries";

const WorkDetail = () => {
  const { slug } = useParams();
  const { data, error, isError, isPending, refetch } = useCaseStudiesQuery();
  const cases = Array.isArray(data) ? data : [];
  const activeIndex = cases.findIndex((study) => study.slug === slug);
  const study = cases[activeIndex];

  if (isPending) {
    return (
      <main className="work-detail work-detail--loading">
        <Seo
          title="Case Study | M-Agency"
          description="Loading an M-Agency frontend portfolio case study."
          path={`/work/${slug}`}
        />
        <div className="container">
          <ContentState count={3} label="Loading case study" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="work-detail work-detail--loading">
        <Seo
          title="Case Study | M-Agency"
          description="An M-Agency frontend portfolio case study."
          path={`/work/${slug}`}
        />
        <div className="container">
          <ContentState
            status="error"
            title="This case study could not be loaded"
            message={error?.message || "The case-study request could not be completed."}
            onRetry={() => refetch()}
          />
        </div>
      </main>
    );
  }

  if (!study) {
    return (
      <NotFound
        eyebrow="Case study not found"
        title="That project is not in the case-study index."
        message="The link may be outdated. The complete portfolio index is still available."
      />
    );
  }

  const previous = cases[(activeIndex - 1 + cases.length) % cases.length];
  const next = cases[(activeIndex + 1) % cases.length];

  return (
    <main className={`work-detail work-detail--${study.visual}`}>
      <Seo
        title={`${study.name} - ${study.title} | M-Agency`}
        description={study.summary}
        path={`/work/${study.slug}`}
      />

      <section className="work-detail__hero">
        <div className="container">
          <Link className="work-detail__back" to="/work" viewTransition>
            <span aria-hidden="true">&#8592;</span> All case studies
          </Link>

          <div className="work-detail__hero-grid">
            <div className="work-detail__intro">
              <div className="work-detail__meta">
                <span>{study.type}</span>
              </div>
              <p className="work-detail__name">{study.name}</p>
              <h1>{study.title}</h1>
              <p className="work-detail__lead">{study.summary}</p>

              <div className="work-detail__stack" aria-label="Technology stack">
                {study.stack?.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>

            <div className="work-detail__preview" style={{ viewTransitionName: `case-${study.slug}` }}>
              <CasePreview visual={study.visual} />
            </div>
          </div>
        </div>
      </section>

      {study.facts?.length ? (
        <section
          className="work-detail__facts"
          aria-label={`${study.name} project facts`}
        >
          <div className="container">
            {study.facts.map((fact) => (
              <div className="work-detail__fact" key={fact.label}>
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="work-detail__body">
        <div className="container work-detail__body-grid">
          <aside className="work-detail__outline" aria-label="Case study outline">
            <span>Project outline</span>
            <a href="#challenge">Challenge</a>
            <a href="#delivered">Delivered</a>
            <a href="#evidence">Build evidence</a>
            <a href="#decisions">Frontend decisions</a>
            <a href="#outcome">Outcome</a>
          </aside>

          <article className="work-detail__story">
            <section id="challenge">
              <span className="work-detail__section-label">Challenge</span>
              <h2>
                {study.sectionTitles?.challenge ||
                  "Making the product easier to understand and use."}
              </h2>
              <p>{study.challenge}</p>
            </section>

            <section id="delivered">
              <span className="work-detail__section-label">Delivered</span>
              <h2>
                {study.sectionTitles?.delivered ||
                  "The experience that was built."}
              </h2>
              <div className="work-detail__cards">
                {study.delivered?.map((item) => (
                  <div key={item}>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {study.evidence?.length ? (
              <section id="evidence" className="work-detail__evidence">
                <CaseEvidence
                  items={study.evidence}
                  key={study.slug}
                  projectName={study.name}
                />
              </section>
            ) : null}

            <section id="decisions">
              <span className="work-detail__section-label">Frontend decisions</span>
              <h2>
                {study.sectionTitles?.decisions ||
                  "Choices made for a durable interface."}
              </h2>
              <ol className="work-detail__decisions">
                {study.decisions?.map((item) => (
                  <li key={item}>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section id="outcome" className="work-detail__outcome">
              <span className="work-detail__section-label">Outcome</span>
              <blockquote>{study.outcome}</blockquote>
            </section>
          </article>
        </div>
      </section>

      <nav className="work-detail__navigation" aria-label="Case study navigation">
        <div className="container">
          <Link to={`/work/${previous.slug}`} viewTransition>
            <span>Previous project</span>
            <strong>{previous.name}</strong>
          </Link>
          <Link to={`/work/${next.slug}`} viewTransition>
            <span>Next project</span>
            <strong>{next.name}</strong>
          </Link>
        </div>
      </nav>

      <section className="work-detail__contact">
        <div className="container">
          <p>Need the same level of focus on your product?</p>
          <Link to={`/start-project?interest=${study.engagement || "focused-build"}&reference=${study.slug}`}>
            Discuss a similar product <span aria-hidden="true">&#8599;</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default WorkDetail;
