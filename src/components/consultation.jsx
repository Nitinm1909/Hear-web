import React, { useState, useEffect, useRef } from 'react';
import './query.css';
import Navbar from './navbar';
import hero1 from './assets/products/nobg.png';
import hero2 from './assets/products/nobg.png';
import hero3 from './assets/products/nobg.png';
import hero4 from './assets/products/nobg.png';
import hero5 from './assets/products/nobg.png';

const images = [hero1, hero2, hero3, hero4, hero5];

const Query = () => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    reason: ''
  });
  const [currentImg, setCurrentImg] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    },2500);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted!');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div className="navbar-override-black"><Navbar /></div>
      <div className="login-container query-page-container">
        <div className="animation-container query-animation-container">
          <img
            src={images[currentImg]}
            alt="Hearing Aid"
            className="query-carousel-image"
          />
        </div>
        <div className="form-container query-form-container">
          <div className="credentials-container query-card" aria-live="polite">
            <h2>Book a Consultation</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Name"
                />
              </div>
              <div className="input-group">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone Number"
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                />
              </div>
              <div className="input-group">
                <select
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Reason for Consultation</option>
                  <option value="hearing_loss">Hearing Loss</option>
                  <option value="hearing_aid_consultation">Hearing Aid Consultation</option>
                  <option value="tinnitus">Tinnitus</option>
                  <option value="hearing_test">Hearing Test</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button type="submit" className="login-button">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Query; 