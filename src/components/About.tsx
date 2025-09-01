import React, { useState, useEffect } from "react";
import Typewriter from "./Typewriter";
import { useInView } from "../hooks/useInView";
import "../styles/graffiti-callout.css";

const About: React.FC = () => {
  const { ref, inView } = useInView();
  // simplified About: no mode/callouts

  const sectionRef = ref as any;
  return (
    <section id="about" ref={sectionRef} className="about-verse-section">
      <div className="about-verse-container">
        <p className="verse-kicker">INTRODUCTION</p>

        <h2 className="verse-title" aria-label="About Me">
          <span className="verse-title-layer verse-title--shadow" aria-hidden>
            About Me.
          </span>
          <span className="verse-title-layer verse-title--offset" aria-hidden>
            About Me.
          </span>
          <span className="verse-title-main">
            <Typewriter text="About Me." trigger={inView} />
          </span>
        </h2>

        <p className="verse-lead" style={{ color: '#ff2244', fontWeight: 900, fontSize: '1.6rem', marginTop: '0.25rem' }}>
          <Typewriter text="This is my story..." trigger={inView} speed={35} cursor={false} />
        </p>

        <div className="verse-panels">
          <div className="verse-panel open" role="region" aria-label="About me details">
            <div className="verse-panel-body">
              <p>
                I’m a technically grounded product thinker studying Computer Science at Stanford University. Stanford has been a playground for an insatiable curiosity about everything technology from math, CS, AI, entrepreneurship, to enterprise level systems, product, and more. That exploration led me to a simple belief: if we emulate the brain’s efficiency and adaptability, we can build AI-driven tools that push the boundaries of how people learn. My mission is to bring that thinking into the way products are engineered and designed and to expand opportunity and access for marginalized and disadvantaged communities everywhere.
              </p>
              <p>
                Along the way, my experience spans growth equity, enterprise architecture, data science, academic research, and product management. I’ve led product development in startup settings and gained exposure to scaling software platforms through my time in growth equity. I’m a Certified SAFe® 6 Scrum Master with hands-on agile experience, and I thrive in creative spaces where I have the agency to lead and execute. As a first-gen student and member of the AAPI community, I’m viscerally committed to using technology to open doors for learners, builders, and communities that have been overlooked.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Spray accents */}
      <span className="spray spray-red" aria-hidden />
      <span className="spray spray-blue" aria-hidden />
      <span className="spray spray-dots" aria-hidden />
    </section>
  );
};

export default About;
