import React, { useRef, useState, useEffect } from "react";
import "./teams.css";
import { Linkedin, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import team1 from "./assets/team1.jpeg";
import team2 from "./assets/team2.jpeg";
import team5 from "./assets/team5.jpeg";

const teamMembers = [
  {
    name: "Nitin M",
    position: "CEO & Founder",
    description: "Leading innovation and strategic direction.",
    image: team1,
    linkedin: "https://www.linkedin.com/in/nitin-m-7aa8441b8?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    instagram: "https://www.instagram.com/nitin_sonu09?igsh=bTNveXMzeWhucHI3",
  },
  {
    name: "J Nandini",
    position: "Co-founder",
    description: "Expert in hearing health and diagnostics.",
    image: team2,
    linkedin: "https://linkedin.com/in/anika",
    instagram: "https://instagram.com/anika",
  },
  {
    name: "Pranav B",
    position: "Chief Technical Officer",
    description: "Driving technology and product development.",
    image: team5,
    linkedin: "https://www.linkedin.com/in/pranav-b-hearesearch/",
    instagram: "https://www.instagram.com/pranav.b._.pvt/",
  },
];

const TeamSection = () => {
  return (
    <section className="team-section">
      <h2 className="team-title">Our Team</h2>

      <div className="team-horizontal-scroll">
        {teamMembers.map((member, idx) => (
          <motion.div
            className="team-card"
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="team-image-wrapper">
              <img src={member.image} alt={member.name} className="team-image" />
            </div>
            <div className="team-info">
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.position}</p>
              <p className="team-desc">{member.description}</p>
              <div className="team-icons">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin size={18} />
                </a>
                <a href={member.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram size={18} color="#E1306C" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
