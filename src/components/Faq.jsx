import React from "react";

const questions = [
  {
    question: "What kinds of products can M-Agency help with?",
    answer:
      "We focus on web products such as customer portals, internal tools, dashboards, workflow platforms, and modernization of existing applications.",
  },
  {
    question: "Can you work with an existing product or codebase?",
    answer:
      "Yes. An engagement can start with a focused review of the current product, architecture, and delivery constraints before any implementation plan is proposed.",
  },
  {
    question: "How does a project begin?",
    answer:
      "We begin with a short discovery conversation to understand the product goal, users, current context, and the problem that needs to be solved.",
  },
  {
    question: "How are scope and timing decided?",
    answer:
      "Scope and timing are defined after discovery. The result is a phased plan with priorities, assumptions, dependencies, and a clear first delivery milestone.",
  },
  {
    question: "Can support continue after launch?",
    answer:
      "Ongoing improvement, technical support, and delivery guidance can be planned as a separate follow-on engagement when the product needs it.",
  },
];

const Faq = () => (
  <section className="agency-faq" id="faq" aria-labelledby="faq-title">
    <div className="container agency-faq__layout">
      <header className="agency-section-heading agency-faq__heading">
        <span>Frequently asked</span>
        <h2 id="faq-title">Useful answers before we start</h2>
        <p>
          A good project starts with clarity. These are the questions that usually
          help teams decide on the next conversation.
        </p>
      </header>

      <div className="agency-faq__list">
        {questions.map((item, index) => (
          <details className="agency-faq__item" key={item.question} open={index === 0}>
            <summary>
              <span>{item.question}</span>
              <i aria-hidden="true" />
            </summary>
            <div className="agency-faq__answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default Faq;
