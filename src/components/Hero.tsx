import React from 'react';
import Typewriter from './Typewriter';
import { useInView } from '../hooks/useInView';
import PortraitImg from '../assets/images/Matthew.jpeg';
import HeroBorderThreads from './HeroBorderThreads';

// Hero section with diagonal split layout
// Left: light map-like background + big headline
// Right: dark panel clipped diagonally with profile image
const Hero: React.FC = () => {
  const { ref, inView } = useInView();
  // Use imported asset for reliable bundling
  const imgSrc = PortraitImg;

  const sectionRef = ref as any;
  return (
    <section id="hero" ref={sectionRef} className="hero hero-section" aria-label="Introduction">
      <div className="hero-inner">
        <HeroBorderThreads />
        {/* Left content */}
        <div className="hero-left">
          <h1 className="hero-title" aria-label="Hi, I'm Matthew Torre">
            <span className="hero-hi">HI, I'M</span>
            <span className="hero-name">Matthew Torre </span>
          </h1>
          <p className="hero-sub brand-font">
            <Typewriter
              text="I'm a technically grounded product thinker studying computer science and data science with an AI concentration at Stanford University"
              trigger={inView}
              speed={24}
            />
          </p>
        </div>

        {/* Right diagonal photo panel */}
        <div className="hero-right" aria-hidden="true">
          <div className="hero-photo-wrap">
            <figure className="portrait-card" aria-label="Profile portrait frame">
              <img src={imgSrc} className="portrait-img" alt="Matthew Torre portrait" loading="lazy" />
              <span className="portrait-accent ring ring--blue" aria-hidden />
              <span className="portrait-accent ring ring--red" aria-hidden />
              <span className="portrait-dots" aria-hidden />
            </figure>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <div className="mouse">
          <div className="wheel" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
