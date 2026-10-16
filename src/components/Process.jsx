const processSteps = [
  {
    id: "discover",
    title: "Discover",
    text: "Align on the product goal, users, constraints, and the systems already in place.",
    outcome: "Shared context",
  },
  {
    id: "define",
    title: "Define",
    text: "Turn what we learn into a focused scope, technical direction, and practical delivery plan.",
    outcome: "Clear roadmap",
  },
  {
    id: "build",
    title: "Build",
    text: "Design and engineer in small, verifiable increments with visible progress and early feedback.",
    outcome: "Working software",
  },
  {
    id: "launch-improve",
    title: "Launch & improve",
    text: "Release carefully, observe real behavior, and use evidence to guide the next improvements.",
    outcome: "Confident next steps",
  },
];

const Process = () => (
  <section className="delivery-process" id="process" aria-labelledby="process-title">
    <div className="container">
      <header className="agency-section-heading agency-section-heading--split">
        <div>
          <span>How we work</span>
          <h2 id="process-title">A clear path from idea to reliable release</h2>
        </div>
        <p>
          Every engagement is shaped around the product, but the principles stay
          consistent: understand first, reduce risk early, and keep progress visible.
        </p>
      </header>

      <div className="delivery-process__board" role="list">
        {processSteps.map((step) => (
          <article className="process-phase" role="listitem" key={step.id}>
            <div className="process-phase__copy">
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>

            <footer className="process-phase__outcome">
              <span>Outcome</span>
              <strong>{step.outcome}</strong>
            </footer>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Process;
