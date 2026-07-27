import React from "react";

const Services = () => {
  const services = [
    {
      name: "Frontend",
      iconClass: "fa fa-code",
      desc: "React patterns, browser APIs, performance techniques, and accessible interface engineering",
    },
    {
      name: "Backend",
      iconClass: "fa fa-database",
      desc: "APIs, databases, distributed systems, and reliable server-side development practices",
    },
    {
      name: "DevOps & Cloud",
      iconClass: "fa fa-cloud",
      desc: "Deployment workflows, observability, containers, and infrastructure lessons from production",
    },
    {
      name: "Engineering Career",
      iconClass: "fa fa-compass",
      desc: "Practical guidance for growing technical skills, leading teams, and navigating developer careers",
    },
  ];

  return (
    <section className="categories" id="services">
      <div className="container">
        <div className="categories__heading">
          <span>Explore by topic</span>
          <h2>Categories</h2>
          <p>Focused collections for every stage of building and growing modern software.</p>
        </div>
        <div className="categories__grid">
          {services.map((service, indx) => (
            <a className="category-card" href="/blogs" key={indx}>
              <div className="category-card__icon">
                <i className={service.iconClass} aria-hidden="true"></i>
              </div>
              <h3>{service.name}</h3>
              <p>{service.desc}</p>
              <span className="category-card__link">
                Explore category <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
