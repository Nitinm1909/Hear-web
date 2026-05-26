import React, { useEffect, useRef, useState } from "react";
import "./timeline.css";
import { User, BarChart, Settings, Shield, Award } from "lucide-react";

const steps = [
  { id: "FEB 2025", title: "Humble Beginnings", desc: "Started with a vision to help the hearing impaired.", icon: <User size={28} />, color: "#e91e63" },
  { id: "AUG 2025", title: "Founding Vision", desc: "The core team came together to launch H.E.A.R.", icon: <BarChart size={28} />, color: "#f39c12" },
  { id: "APRIL 2026", title: "First Prototype", desc: "Built and tested the first working model.", icon: <Settings size={28} />, color: "#27ae60" },
  { id: "progress...", title: "National Expansion", desc: "Rolled out across India via online and retail.", icon: <Shield size={28} />, color: "#3498db" },
  { id: "progress...", title: "Media & Awards", desc: "Recognized nationally and trusted by users.", icon: <Award size={28} />, color: "#6c5ce7" }
];

const svgWidth = 1200;
const svgHeight = 200;
const baseY = 100;

function buildWaveSegments(len, width, y) {
  const stepX = width / (len - 1);
  const segments = [];
  for (let i = 1; i < len; i++) {
    const prevX = (i - 1) * stepX;
    const x = i * stepX;
    const cpX = prevX + stepX / 2;
    const curveHeight = 100; // tweak this number
    const cpY = i % 2 === 0 ? y - curveHeight : y + curveHeight;
    segments.push(`M ${prevX} ${y} Q ${cpX} ${cpY}, ${x} ${y}`);
  }
  return segments;
}

export default function TimelineWithDottedLines() {
  const segments = buildWaveSegments(steps.length, svgWidth, baseY);
  const SEG_DUR = 0.8;
  const SEG_GAP = 0.15;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  return (
    <section ref={sectionRef} className={`timeline-section ${isVisible ? 'reveal-active' : ''}`}>
      <h2 className="timeline-heading">Our Journey</h2>
      <div className="timeline-wrapper">
        {/* Dotted line */}
        <svg
          className="timeline-svg"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {segments.map((d, i) => (
            <path
              key={i}
              d={d}
              className="dotted-path"
              style={{
                "--delay": `${i * (SEG_DUR + SEG_GAP)}s`,
                "--dur": `${SEG_DUR}s`,
              }}
            />
          ))}
        </svg>

        {/* Circles & text */}
        <div className="timeline-container">
          {steps.map((s, i) => {
            const baseDelay = i * (SEG_DUR + SEG_GAP) + SEG_DUR;
            return (
              <div className="timeline-item" key={s.id} style={{ '--item-delay': `${i * 120}ms` }}>
                {i % 2 === 0 && (
                  <div
                    className="timeline-text top"
                    style={{ animationDelay: `${baseDelay + 0.35}s` }}
                  >
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <span className="timeline-num" style={{ color: s.color }}>
                      {s.id}
                    </span>
                  </div>
                )}
                <div
                  className="timeline-circle"
                  style={{
                    borderColor: s.color,
                    animationDelay: `${baseDelay + 0.1}s`,
                  }}
                >
                  <div
                    className="timeline-icon"
                    style={{
                      color: s.color,
                      animationDelay: `${baseDelay + 0.2}s`,
                    }}
                  >
                    {s.icon}
                  </div>
                </div>
                {i % 2 !== 0 && (
                  <div
                    className="timeline-text bottom"
                    style={{ animationDelay: `${baseDelay + 0.35}s` }}
                  >
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <span className="timeline-num" style={{ color: s.color }}>
                      {s.id}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
