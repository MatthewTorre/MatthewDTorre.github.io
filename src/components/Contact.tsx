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
        <form className="verse-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-row">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={5} required />
          </div>
          <button className="neon-btn" type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
