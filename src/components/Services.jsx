import { Link } from "react-router-dom";

const services = [
  {
    name: "Product & Frontend",
    icon: "frontend",
    desc: "Accessible, high-performance product interfaces shaped around real user and business goals",
  },
  {
    name: "Backend & APIs",
    icon: "backend",
    desc: "Reliable APIs, data flows, and integrations designed to grow with the product",
  },
  {
    name: "Cloud & DevOps",
    icon: "cloud",
    desc: "Practical cloud infrastructure, automated delivery, and observability for dependable releases",
  },
  {
    name: "Technical Strategy",
    icon: "strategy",
    desc: "Clear technical direction, architecture reviews, and focused plans for complex product decisions",
  },
];

const ServiceIcon = ({ name }) => {
  const paths = {
    frontend: <><path d="m8 8-4 4 4 4" /><path d="m16 8 4 4-4 4" /><path d="m14 4-4 16" /></>,
    backend: <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" /><path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" /></>,
    cloud: <path d="M7.5 18.5h10a4 4 0 0 0 .5-7.97A6.2 6.2 0 0 0 6.2 9.1 4.8 4.8 0 0 0 7.5 18.5Z" />,
    strategy: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" /></>,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

const Services = () => (
  <section className="categories" id="services">
    <div className="container">
      <div className="categories__heading">
        <span>What we do</span>
        <h2>Engineering Services</h2>
        <p>Focused product and engineering support from first decisions through reliable delivery.</p>
      </div>
      <div className="categories__grid">
        {services.map((service) => (
          <Link className="category-card" to="/#contact" key={service.name}>
            <div className="category-card__icon"><ServiceIcon name={service.icon} /></div>
            <h3>{service.name}</h3>
            <p>{service.desc}</p>
            <span className="category-card__link">
              Discuss this service <span aria-hidden="true">&#8594;</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default Services;
