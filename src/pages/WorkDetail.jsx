import { Link, useParams } from "react-router-dom";
import ContentState from "../components/ContentState";
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
          <Link className="work-detail__back" to="/work">
            <span aria-hidden="true">&#8592;</span> All case studies
          </Link>

          <div className="work-detail__hero-grid">
            <div className="work-detail__intro">
              <div className="work-detail__meta">
                <span>{study.index || String(activeIndex + 1).padStart(2, "0")}</span>
                <span>{study.type}</span>
              </div>
              <p className="work-detail__name">{study.name}</p>
              <h1>{study.title}</h1>
              <p className="work-detail__lead">{study.summary}</p>

              <div className="work-detail__stack" aria-label="Technology stack">
                {study.stack?.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>

            <div className="work-detail__preview">
              <CasePreview visual={study.visual} />
            </div>
          </div>
        </div>
      </section>

      <section className="work-detail__body">
        <div className="container work-detail__body-grid">
          <aside className="work-detail__outline" aria-label="Case study outline">
            <span>Project outline</span>
            <a href="#challenge">Challenge</a>
            <a href="#delivered">Delivered</a>
            <a href="#decisions">Frontend decisions</a>
            <a href="#outcome">Outcome</a>
          </aside>

          <article className="work-detail__story">
            <section id="challenge">
              <span className="work-detail__section-number">01 / Challenge</span>
              <h2>Making the product easier to understand and use.</h2>
              <p>{study.challenge}</p>
            </section>

            <section id="delivered">
              <span className="work-detail__section-number">02 / Delivered</span>
              <h2>The experience that was built.</h2>
              <div className="work-detail__cards">
                {study.delivered?.map((item, index) => (
                  <div key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="decisions">
              <span className="work-detail__section-number">03 / Frontend decisions</span>
              <h2>Choices made for a durable interface.</h2>
              <ol className="work-detail__decisions">
                {study.decisions?.map((item, index) => (
                  <li key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section id="outcome" className="work-detail__outcome">
              <span className="work-detail__section-number">04 / Outcome</span>
              <blockquote>{study.outcome}</blockquote>
            </section>
          </article>
        </div>
      </section>

      <nav className="work-detail__navigation" aria-label="Case study navigation">
        <div className="container">
          <Link to={`/work/${previous.slug}`}>
            <span>Previous project</span>
            <strong>{previous.name}</strong>
          </Link>
          <Link to={`/work/${next.slug}`}>
            <span>Next project</span>
            <strong>{next.name}</strong>
          </Link>
        </div>
      </nav>

      <section className="work-detail__contact">
        <div className="container">
          <p>Need the same level of focus on your product?</p>
          <Link to={`/?interest=${study.engagement || "focused-build"}#contact`}>
            Build something together <span aria-hidden="true">&#8599;</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default WorkDetail;
