import React from "react";
import "./HearingAdviceSection.css";
import doctorImage from "./assets/doctor_consultation.jpeg"; // ✅ Make sure this is the correct image path

const HearingAdviceSection = () => {
    return (
        <div className="hearing-advice-section">
            <div className="advice-img-container">
                <img src={doctorImage} alt="Consult a doctor" className="advice-img" />
            </div>
            <div className="advice-text">
                <h2>"I have hearing loss. What should I do next?"</h2>
                <p>
                    If your results show a possible hearing loss, we strongly recommend consulting a certified hearing care professional who can provide a detailed evaluation, advice on hearing aids, and any other personalized assistance.
                </p>
                <p>
                    Our online test is an initial outline and does not replace professional medical advice. A professional can help you understand the severity of your condition and suggest the right treatment. You may be advised to try hearing aids or undergo further diagnosis. Please use this tool as a guide and not a diagnosis.
                </p>
            </div>
        </div>
    );
};

export default HearingAdviceSection;
