import React from "react";

const processSteps = [
  {
    number: "01",
    title: "Discover",
    text: "Align on the product goal, users, constraints, and the systems already in place.",
    outcome: "Shared context",
  },
  {
    number: "02",
    title: "Define",
    text: "Turn what we learn into a focused scope, technical direction, and practical delivery plan.",
    outcome: "Clear roadmap",
  },
  {
    number: "03",
    title: "Build",
    text: "Design and engineer in small, verifiable increments with visible progress and early feedback.",
    outcome: "Working software",
  },
  {
    number: "04",
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

      <ol className="delivery-process__grid">
        {processSteps.map((step) => (
          <li className="delivery-step" key={step.number}>
            <div className="delivery-step__top">
              <span className="delivery-step__number">{step.number}</span>
              <span className="delivery-step__line" aria-hidden="true" />
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <strong>{step.outcome}</strong>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Process;
