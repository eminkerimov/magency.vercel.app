import React from "react";

const Services = () => {
  const services = [
    {
      name: "Custom Designs",
      iconClass: "fa fa-rocket",
      desc: "Unique online presence tailored to your brand's essence through custom designs",
    },
    {
      name: "Web Design",
      iconClass: "fa fa-desktop",
      desc: "Professional websites combining aesthetics and functionality for an impactful online experience",
    },
    {
      name: "Blog Pages",
      iconClass: "fa fa-lightbulb-o",
      desc: "Engaging and visually appealing blog layouts for a captivating content showcase",
    },
    {
      name: "Mobile Friendly",
      iconClass: "fa fa-mobile",
      desc: "Responsive designs ensuring a seamless user experience across devices, anytime, anywhere",
    },
  ];

  return (
    <section className="services" id="services">
      <div className="container">
        <div className="row">
          {services.map((service, indx) => (
            <div className="col-3" key={indx}>
              <div className="section-item">
                <i className={service.iconClass} aria-hidden="true"></i>
                <h1 className="section-item__name">{service.name}</h1>
                <p className="section-item__text">{service.desc}</p>
                <a href="#">Read More</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
