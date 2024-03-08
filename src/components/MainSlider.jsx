import React from "react";
import { useRef } from "react";
import Slider from "react-slick";
import slider1 from "../assets/img/slider1.png";
import slider2 from "../assets/img/slider2.jpg";
import slider3 from "../assets/img/slider3.jpg";
import slider4 from "../assets/img/slider4.jpg";

const MainSlider = () => {
  const sliderRef = useRef(null);
  const slider = [slider1, slider2, slider3, slider4];

  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
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
    <section className="slider">
      <div className="slider-list">
        <Slider ref={sliderRef} {...settings}>
          {slider.map((slide, indx) => (
            <div className="slider-list__item" key={indx}>
              <img src={slide} alt="slider" />
            </div>
          ))}
        </Slider>
      </div>
      <div className="slider-content">
        <h1>Discover M-Agency</h1>
        <span>Unveiling Perspectives: Your Gateway to Creativity and Excellence</span>
        <a href="#">Learn More</a>
      </div>
      <button className="slider-arrow__left" onClick={handlePrev}></button>
      <button className="slider-arrow__right" onClick={handleNext}></button>
    </section>
  );
};

export default MainSlider;
