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

const ProcessVisual = ({ type }) => {
  if (type === "discover") {
    return (
      <svg viewBox="0 0 260 180" aria-hidden="true" focusable="false">
        <rect className="process-visual__surface" x="18" y="18" width="224" height="144" rx="20" />
        <path className="process-visual__grid" d="M42 50h176M42 90h176M42 130h176M76 34v112M130 34v112M184 34v112" />
        <circle className="process-visual__halo" cx="128" cy="88" r="45" />
        <circle className="process-visual__focus" cx="128" cy="88" r="25" />
        <path className="process-visual__signal" d="M145 107l27 27" />
        <circle className="process-visual__node" cx="66" cy="59" r="6" />
        <circle className="process-visual__node process-visual__node--soft" cx="199" cy="65" r="5" />
        <circle className="process-visual__node process-visual__node--soft" cx="74" cy="127" r="4" />
      </svg>
    );
  }

  if (type === "define") {
    return (
      <svg viewBox="0 0 260 180" aria-hidden="true" focusable="false">
        <rect className="process-visual__surface" x="18" y="18" width="224" height="144" rx="20" />
        <rect className="process-visual__panel" x="36" y="38" width="72" height="104" rx="12" />
        <path className="process-visual__line" d="M52 58h40M52 73h26M52 108h40M52 123h30" />
        <rect className="process-visual__block" x="126" y="40" width="92" height="28" rx="9" />
        <rect className="process-visual__block process-visual__block--soft" x="126" y="78" width="62" height="25" rx="8" />
        <rect className="process-visual__block process-visual__block--soft" x="126" y="113" width="92" height="25" rx="8" />
        <path className="process-visual__route" d="M108 89h11c13 0 13-35 27-35h4M188 91h12c14 0 14 34 28 34h3" />
      </svg>
    );
  }

  if (type === "build") {
    return (
      <svg viewBox="0 0 260 180" aria-hidden="true" focusable="false">
        <rect className="process-visual__surface" x="18" y="18" width="224" height="144" rx="20" />
        <path className="process-visual__chrome" d="M18 50h224" />
        <circle className="process-visual__chrome-dot" cx="40" cy="34" r="4" />
        <circle className="process-visual__chrome-dot process-visual__chrome-dot--soft" cx="54" cy="34" r="4" />
        <rect className="process-visual__panel" x="36" y="68" width="48" height="74" rx="10" />
        <rect className="process-visual__block" x="98" y="68" width="126" height="32" rx="10" />
        <rect className="process-visual__block process-visual__block--soft" x="98" y="110" width="58" height="32" rx="10" />
        <rect className="process-visual__block process-visual__block--soft" x="166" y="110" width="58" height="32" rx="10" />
        <path className="process-visual__code" d="M48 90l-8 8 8 8M70 90l8 8-8 8M63 84l-8 28" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 260 180" aria-hidden="true" focusable="false">
      <rect className="process-visual__surface" x="18" y="18" width="224" height="144" rx="20" />
      <path className="process-visual__axis" d="M44 132h174M44 132V48" />
      <path className="process-visual__area" d="M51 120c27-4 37-32 60-28 22 4 27-24 52-18 21 5 29-24 52-33v79H51z" />
      <path className="process-visual__signal" d="M51 120c27-4 37-32 60-28 22 4 27-24 52-18 21 5 29-24 52-33" />
      <circle className="process-visual__pulse" cx="215" cy="41" r="8" />
      <circle className="process-visual__pulse-ring" cx="215" cy="41" r="18" />
      <path className="process-visual__ticks" d="M74 126v6M111 126v6M150 126v6M189 126v6" />
    </svg>
  );
};

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
          <article
            className={`process-phase process-phase--${step.id}`}
            role="listitem"
            key={step.id}
          >
            <div className="process-phase__body">
              <div className="process-phase__copy">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>

              <footer className="process-phase__outcome">
                <span>Outcome</span>
                <strong>{step.outcome}</strong>
              </footer>
            </div>

            <div className="process-phase__visual">
              <ProcessVisual type={step.id} />
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Process;
