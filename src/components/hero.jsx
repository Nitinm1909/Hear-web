import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./hero.css";
import "./herores.css";   // responsive overrides
import Hero2 from "../components/hero2";
import Footer from "../components/footer";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    pauseOnHover: false,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

useEffect(() => {
  const body = document.body;
  const backgrounds = [
    "linear-gradient(to bottom, #8e84c6ff, #f2daf6, #d9f3fa, #ffffff,#ffffff)", // Purple-pink
    "linear-gradient(to bottom, #000000, #4e4e4e, #9f9f9f, #ffffff,#ffffff)", // Black/gray
    "linear-gradient(to bottom, #5a7a3d, #79ab3c, #b8e482, #ffffff,#ffffff)", // Green
    "linear-gradient(to bottom, #74bdc3ff, #bce9ec, #ccf6f3, #ffffff,#ffffff)", // Teal
    "linear-gradient(to bottom , #577cb9ff, #71acc8ff, #acf5feff, #ffffff,#ffffff)", // Blue fade
    "linear-gradient(to bottom, #6083ad, #a1bfdcff, #b3daffff, #ffffff,#ffffff)", // Soft Blue
  ];

  // ✅ Only run background transitions on desktop (>= 769px)
  if (window.innerWidth > 768) {
    requestAnimationFrame(() => {
      body.style.transition = "background 0.8s ease-in-out";
      body.style.background = backgrounds[currentSlide];
    });
  } else {
    // ✅ Mobile: lock to one static background
    body.style.background =
      "linear-gradient(to bottom, #ffffffff, #ffffffff, #fcfcfcff, #ffffff)";
  }
}, [currentSlide]);

  return (
    <>
      <section className="hero-container">
        <Slider {...settings}>
          {/* Slides */}
          {[
            {
              title: "Advanced Hearing Aid",
              desc: "Crystal Clear Sound for Every Moment",
            },
            {
              title: "Unmatched Quality",
              desc: "Designed for Pure Sound Experience",
            },
            {
              title: "Next-Gen Audio",
              desc: "For Every Lifestyle, Every Need",
            },
            {
              title: "Eco Comfort Fit",
              desc: "Soft. Sustainable. Smart.",
            },
            {
              title: "Stylish Everyday Wear",
              desc: "Looks that Speak Volumes",
            },
            {
              title: "Engineered for Excellence",
              desc: "Precision Audio. Anywhere.",
            },
          ].map((slide, idx) => (
            <div className={`slide slide${idx + 1}`} key={idx}>
              <div className={`caption ${idx === 0 ? "caption-center" : "caption-left"}`}>
                <h2>{slide.title}</h2>
                <p>{slide.desc}</p>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      <Hero2 />
      <Footer />
    </>
  );
};

export default Hero;
