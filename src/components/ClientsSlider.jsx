import React, { useState } from "react";
import mayaPhoto from "../assets/img/testimonial-maya.jpg";
import danielPhoto from "../assets/img/testimonial-daniel.jpg";
import priyaPhoto from "../assets/img/testimonial-priya.jpg";

const testimonials = [
  {
    text: "M-Agency turns difficult frontend topics into clear, practical guidance. The examples are focused enough to apply directly to production work.",
    name: "Maya Chen",
    role: "Frontend Engineer",
    photo: mayaPhoto,
  },
  {
    text: "The backend articles explain tradeoffs instead of prescribing a single tool. I regularly share them during architecture reviews with my team.",
    name: "Daniel Ortiz",
    role: "Staff Engineer",
    photo: danielPhoto,
  },
  {
    text: "The production checklists are concise, current, and grounded in real incidents. They have become a useful part of our release process.",
    name: "Priya Nair",
    role: "Platform Engineer",
    photo: priyaPhoto,
  },
];

const TestimonialAuthor = ({ testimonial }) => (
  <div className="testimonial-author">
    <p>
      <strong>{testimonial.name}</strong>
      <span>, {testimonial.role}</span>
    </p>
  </div>
);

const ClientsSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = testimonials[activeIndex];

  return (
    <section className="clients">
      <div className="container">
        <header className="clients__heading">
          <h2 className="section-title">What Readers Say</h2>
        </header>

        <div className="clients__layout">
          <article
            className="testimonial-quote"
            id="testimonial-panel"
            role="tabpanel"
            aria-labelledby={`testimonial-tab-${activeIndex}`}
            aria-live="polite"
          >
            <span className="testimonial-quote__mark" aria-hidden="true">“</span>
            <div className="testimonial-quote__visual" key={`portrait-${activeIndex}`}>
              <span className="testimonial-quote__index" aria-hidden="true">
                0{activeIndex + 1}
              </span>
              <div className="testimonial-quote__portrait">
                <img src={activeTestimonial.photo} alt={activeTestimonial.name} />
              </div>
            </div>
            <div className="testimonial-quote__body" key={activeIndex}>
              <blockquote>{activeTestimonial.text}</blockquote>
              <TestimonialAuthor testimonial={activeTestimonial} />
            </div>
          </article>

          <div className="clients__readers" role="tablist" aria-label="Reader testimonials">
            {testimonials.map((testimonial, index) => (
              <button
                className={`testimonial-reader${activeIndex === index ? " is-active" : ""}`}
                id={`testimonial-tab-${index}`}
                key={testimonial.name}
                type="button"
                role="tab"
                aria-controls="testimonial-panel"
                aria-selected={activeIndex === index}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  className="testimonial-reader__avatar"
                  src={testimonial.photo}
                  alt=""
                  aria-hidden="true"
                />
                <span className="testimonial-reader__identity">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSlider;
