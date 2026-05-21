import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import comingSoon from "./assets/Comingsoon.jpg";
import "./hero3.css";

const products = [
  { id: 1, name: "Premium Hearing Aid", img: prod },
  { id: 2, name: "Smart Hearing Aid", img: prod },
  { id: 3, name: "Compact Hearing Aid", img: prod },
];

const ProductsCarousel = () => {
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="carousel-section">
      <h2 className="carousel-title">Our Top Picks for You</h2>
      <div className="red-underline"></div>

      <div className="carousel-wrapper">
        <button className="arrow left" onClick={handlePrev}>
          <ChevronLeft size={26} />
        </button>

        <div className="carousel-track">
          {products.map((product, i) => {
            let position = "next";
            if (i === index) position = "active";
            else if (i === (index - 1 + products.length) % products.length)
              position = "prev";

            return (
              <div key={product.id} className={`carousel-item ${position}`}>
                <img src={product.img} alt={product.name} />
                <p className="carousel-name">{product.name}</p>
              </div>
            );
          })}
        </div>

        <button className="arrow right" onClick={handleNext}>
          <ChevronRight size={26} />
        </button>
      </div>
    </div>
  );
};

export default ProductsCarousel;
