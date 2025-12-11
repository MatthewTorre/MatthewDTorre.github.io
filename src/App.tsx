import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Timeline from './components/Timeline';
import Certifications from './components/Certifications';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import { useActiveSection } from './hooks/useActiveSection';
import SpideyWebBackground from './components/SpideyWebBackground';
import SocialBar from './components/SocialBar';
import FloatingSocialBar from './components/FloatingSocialBar';

function App() {
  const active = useActiveSection(['about', 'experience', 'certs', 'skills', 'projects', 'contact']);
  return (
    <>
      <SpideyWebBackground />
      <Header active={active} />
      <SocialBar />
      <Hero />
      <About />
      <Timeline />
      <Certifications />
      <Skills />
      <Portfolio />
      <Contact />
      <FloatingSocialBar />
    </>
  );
}

export default App;
