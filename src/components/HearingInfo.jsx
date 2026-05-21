// src/components/HearingInfo.jsx
import React from "react";
import "./HearingInfo.css";
import firstSectionImg from "./assets/firstSectionImg.png";
import benefitsImg from "./assets/hearingBenefits.png";
// You no longer need to import HearingAdviceSection unless used elsewhere

const HearingInfo = () => {
    return (
        <div className="hearing-info-page">

            {/* Section 1: Hero Banner */}
            <section
                className="hero-section"
                style={{ backgroundImage: `url(${firstSectionImg})` }}
            >
                <div className="hero-content">
                    <h1>Your First Step To Better Hearing</h1>
                    <p>Clinically-validated pure tone audiometry test in just 5 minutes. And, it's free!</p>
                    <a href="/hearingtest" className="test-btn">Take Test</a>
                </div>
            </section>

            {/* Section 2: Hearing Advice - UPDATED WITH NEW TIMELINE STRUCTURE */}
            <section className="advice-section">
                <div className="advice-container">
                    <h2>Your Path to Clearer Hearing</h2>
                    <p className="subtitle">We've simplified the process into three easy steps to guide you on your journey.</p>
                    <div className="steps-container">

                        {/* Step 1 */}
                        <div className="step-card">
                            <div className="step-number">01</div>
                            <div className="step-icon">
                                {/* Replace with your icon for 'Test', e.g., from Lucide or Heroicons */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                            <h3>Take the Online Test</h3>
                            <p>Our 5-minute, clinically-validated test gives you a clear baseline of your current hearing ability.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="step-card">
                            <div className="step-number">02</div>
                            <div className="step-icon">
                                {/* Replace with your icon for 'Consultation' */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2"></path><rect x="3" y="4" width="18" height="18" rx="2"></rect><circle cx="12" cy="10" r="2"></circle><line x1="8" y1="2" x2="8" y2="4"></line><line x1="16" y1="2" x2="16" y2="4"></line></svg>
                            </div>
                            <h3>Consult a Specialist</h3>
                            <p>Based on your results, we connect you with certified audiologists in Chennai for a professional diagnosis.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="step-card">
                            <div className="step-number">03</div>
                            <div className="step-icon">
                                {/* Replace with your icon for 'Solution/Hearing Aid' */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                            </div>
                            <h3>Find Your Solution</h3>
                            <p>Explore personalized hearing aid solutions tailored to your needs, lifestyle, and budget.</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Section 3: Why Choose Us */}
            <section
                className="why-choose-section"
                style={{ backgroundImage: `url(${benefitsImg})` }}
            >
                <div className="why-choose-content">
                    <h2>Why Choose Us?</h2>
                    <p>
                        Our online hearing test is trusted by professionals and users across the world. We use clinically approved
                        techniques to assess your hearing in a fun, simple and accurate way.
                    </p>
                    <p>
                        It only takes a few minutes and helps you understand your hearing condition clearly.
                    </p>
                    <a href="/hearingtest" className="test-btn">Start Test</a>
                </div>
            </section>

        </div>
    );
};

export default HearingInfo;
