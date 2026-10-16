const technologyGroups = [
  {
    layer: "Experience layer",
    tone: "experience",
    label: "Product & Frontend",
    glyph: "</>",
    description: "Fast, accessible interfaces that stay maintainable as the product grows.",
    items: ["React", "TypeScript", "Modern CSS", "Accessibility"],
  },
  {
    layer: "Systems layer",
    tone: "systems",
    label: "Backend & Data",
    glyph: "{ }",
    description: "Reliable services, clear contracts, and data systems built around real workflows.",
    items: ["Node.js", "API Design", "PostgreSQL", "Integrations"],
  },
  {
    layer: "Delivery layer",
    tone: "delivery",
    label: "Cloud & Delivery",
    glyph: "↗",
    description: "Practical infrastructure and delivery foundations that make releases easier to trust.",
    items: ["Vercel", "Containers", "CI/CD", "Observability"],
  },
];

const TechnologyStack = () => (
  <section className="technology-stack" id="technologies" aria-labelledby="technologies-title">
    <div className="container">
      <header className="agency-section-heading agency-section-heading--dark">
        <span>Technology approach</span>
        <h2 id="technologies-title">Modern tools, chosen for the product</h2>
        <p>
          We use a focused stack and make technology decisions around maintainability,
          delivery speed, and the needs of the people using the product.
        </p>
      </header>

      <div className="technology-stack__system">
        <div className="technology-stack__signal">
          <span>Product architecture</span>
          <i aria-hidden="true" />
          <strong>One connected delivery system</strong>
        </div>

        <div className="technology-stack__layers" role="list">
          {technologyGroups.map((group) => (
            <article
              className={`technology-layer technology-layer--${group.tone}`}
              role="listitem"
              key={group.label}
            >
              <div className="technology-layer__identity">
                <div className="technology-layer__icon" aria-hidden="true">
                  {group.glyph}
                </div>
                <div>
                  <span>{group.layer}</span>
                  <h3>{group.label}</h3>
                </div>
              </div>
              <p>{group.description}</p>
              <ul aria-label={`${group.label} technologies`}>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="technology-stack__principle">
          <span>Selection principle</span>
          <p>Use the simplest reliable tool for the product in front of us.</p>
        </div>
      </div>
    </div>
  </section>
);

export default TechnologyStack;
