import { Link } from "react-router-dom";
import { services } from "../data/services";

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

const handleServicePointerMove = (event) => {
  if (
    !window.matchMedia("(pointer: fine)").matches ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;

  event.currentTarget.style.setProperty("--service-x", `${x * 100}%`);
  event.currentTarget.style.setProperty("--service-y", `${y * 100}%`);
  event.currentTarget.style.setProperty("--service-rotate-x", `${(0.5 - y) * 2.2}deg`);
  event.currentTarget.style.setProperty("--service-rotate-y", `${(x - 0.5) * 2.6}deg`);
};

const resetServicePointer = (event) => {
  ["--service-x", "--service-y", "--service-rotate-x", "--service-rotate-y"]
    .forEach((property) => event.currentTarget.style.removeProperty(property));
};

const Services = () => (
  <section className="categories" id="services">
    <div className="container">
      <div className="categories__heading">
        <div>
          <span>What we do</span>
          <h2>Engineering Services</h2>
          <p>Focused product and engineering support from first decisions through reliable delivery.</p>
        </div>
        <div className="categories__signal">
          <strong>One connected system</strong>
          <p>One product-minded frontend perspective across interface, integration, delivery, and direction.</p>
        </div>
      </div>
      <div className="categories__grid">
        {services.map((service, index) => (
          <Link
            className={`category-card${index === 0 || index === 3 ? " category-card--wide" : ""}`}
            to={`/start-project?service=${service.id}`}
            key={service.name}
            onPointerMove={handleServicePointerMove}
            onPointerLeave={resetServicePointer}
          >
            <div className="category-card__top">
              <div className="category-card__icon"><ServiceIcon name={service.icon} /></div>
            </div>
            <span className="category-card__scope">{service.scope}</span>
            <h3>{service.name}</h3>
            <p>{service.desc}</p>
            <ul className="category-card__deliverables" aria-label={`${service.name} deliverables`}>
              {service.deliverables.map((item) => <li key={item}>{item}</li>)}
            </ul>
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
