import React from "react";
import { useRef } from "react";
import Slider from "react-slick";

const ClientsSlider = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <>
      <section className="clients">
        <div className="container">
          <div className="section-title padding">What Clients Say</div>
          <div className="clients-comment">
            <Slider ref={sliderRef} {...settings}>
              <div className="clients-comment__item">
                <p className="clients-comment__item-text">
                The modern and intuitive design has significantly improved user experience, and the feedback from our clients has been overwhelmingly positive. Thank you for bringing our online presence to the next level!
                </p>
                <span className="clients-comment__item-name">John Dove</span>
              </div>
              <div className="clients-comment__item">
                <p className="clients-comment__item-text">
                The team was responsive, understanding our needs and incorporating our vision seamlessly into the website. The end result is a polished and professional site that truly represents our brand. Highly recommend!
                </p>
                <span className="clients-comment__item-name">Marta Luten</span>
              </div>
              <div className="clients-comment__item">
                <p className="clients-comment__item-text">
                The site's mobile-friendly design and streamlined navigation have made it easier for our clients to connect with us. Thank you for a job well done!
                </p>
                <span className="clients-comment__item-name">Rose Smiten</span>
              </div>
            </Slider>
          </div>
          <button className="clients-arrow__left" onClick={handlePrev}></button>
          <button
            className="clients-arrow__right"
            onClick={handleNext}
          ></button>
        </div>
      </section>
    </>
  );
};

export default ClientsSlider;
