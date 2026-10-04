import React from "react";

const technologyGroups = [
  {
    label: "Product & Frontend",
    glyph: "</>",
    description: "Fast, accessible interfaces that stay maintainable as the product grows.",
    items: ["React", "TypeScript", "Modern CSS", "Accessibility"],
  },
  {
    label: "Backend & Data",
    glyph: "{ }",
    description: "Reliable services, clear contracts, and data systems built around real workflows.",
    items: ["Node.js", "API Design", "PostgreSQL", "Integrations"],
  },
  {
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

      <div className="technology-stack__grid">
        {technologyGroups.map((group) => (
          <article className="technology-group" key={group.label}>
            <div className="technology-group__icon" aria-hidden="true">
              {group.glyph}
            </div>
            <h3>{group.label}</h3>
            <p>{group.description}</p>
            <ul aria-label={`${group.label} technologies`}>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default TechnologyStack;
