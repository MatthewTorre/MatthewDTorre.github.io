import React from 'react';
import Typewriter from './Typewriter';
import { useInView } from '../hooks/useInView';

const Contact: React.FC = () => {
  const { ref, inView } = useInView();
  const sectionRef = ref as any;
  return (
    <section id="contact" ref={sectionRef} className="verse-section">
      <div className="verse-container">
        <h2 className="verse-heading"><Typewriter text="Contact Me" trigger={inView} /></h2>
        <a className="neon-btn" href="mailto:mtorre04@stanford.edu">
          Email me at mtorre04@stanford.edu
        </a>
      </div>
    </section>
  );
};

export default Contact;
