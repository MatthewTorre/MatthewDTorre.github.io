import React from 'react';
import Typewriter from './Typewriter';
import { useInView } from '../hooks/useInView';
// Word cloud variant (static threads)
import SkillsWordCloud from './SkillsWordCloud';
import '../styles/skills-prisms.css';
import SkillsVerse from './SkillsVerse';
import '../styles/skills-verse.css';

const Skills: React.FC = () => {
  const { ref, inView } = useInView();

  const sectionRef = ref as any;
  return (
    <section id="skills" ref={sectionRef} className="verse-section skills-section">
      {/* Spider‑Verse ambient background */}
      <SkillsVerse density={0.45} />
      <div className="verse-container">
        <h2 className="verse-heading">
          <Typewriter text="Skills" trigger={inView} />
        </h2>
        <SkillsWordCloud />
      </div>
    </section>
  );
};

export default Skills;
