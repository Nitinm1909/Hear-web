import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import comingSoon from './assets/coming-soon.jpg';
import './hero2.css';

const products = [
  { id: 1, name: 'Hearing Aid for Everything', desc: 'Compact and powerful hearing support' },
  { id: 2, name: 'Hearing Aid for Everything', desc: 'Advanced digital sound processor' },
  { id: 3, name: 'Hearing Aid for Everything', desc: 'Discreet in-ear model for daily use' },
  { id: 4, name: 'Hearing Aid for Everything', desc: 'Rechargeable long-lasting battery' },
  { id: 5, name: 'Hearing Aid for Everything', desc: 'Noise cancelling modern design' },
  { id: 6, name: 'Hearing Aid for Everything', desc: 'Smartphone compatible hearing aid' },
  { id: 7, name: 'Hearing Aid for Everything', desc: 'Lightweight and ergonomic' },
  { id: 8, name: 'Hearing Aid for Everything', desc: 'High-fidelity hearing clarity' },
];

const TopPicks = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1100) {
        setCardsPerView(2);
      } else {
        setCardsPerView(4);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleNext = () => {
    if (startIndex + cardsPerView < products.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const visibleProducts = products.slice(startIndex, startIndex + cardsPerView);

  return (
    <div ref={sectionRef} className={`top-picks-wrapper ${isVisible ? 'reveal-active' : ''}`}>
      <div className="top-picks-container">
        <h2 className="section-title">Browse Products</h2>

        <div className="carousel-wrapper">
          {startIndex > 0 && (
            <button className="arrow left" onClick={handlePrev}>
              <ChevronLeft size={22} />
            </button>
          )}

          <div className="product-slider">
            {visibleProducts.map((product, index) => (
              <div
                key={product.id}
                className="product-card"
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <img src={comingSoon} alt={product.name} className="product-img" />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.desc}</p>

              </div>
            ))}
          </div>

          {startIndex + cardsPerView < products.length && (
            <button className="arrow right" onClick={handleNext}>
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopPicks;
