import React from 'react';

type Props = {
  active?: string;
};

const Header: React.FC<Props> = ({ active }) => {
  return (
    <header className="header-verse">
      <div className="header-verse-inner">
        <a href="#hero" className="brand-verse" aria-label="Home">
          <span className="brand-ring" aria-hidden />
          <span className="brand-text brand-powerup">Matthew Torre's Portfolio</span>
        </a>

        <nav className="nav-verse" aria-label="Primary">
          <ul>
            <li><a className={active === 'about' ? 'active' : ''} href="#about">About</a></li>
            <li><a className={active === 'experience' ? 'active' : ''} href="#experience">Work Experience</a></li>
            <li><a className={active === 'certs' ? 'active' : ''} href="#certs">Certifications</a></li>
            <li><a className={active === 'skills' ? 'active' : ''} href="#skills">Skills</a></li>
            <li><a className={active === 'projects' ? 'active' : ''} href="#projects">Projects</a></li>
            <li><a className={active === 'contact' ? 'active' : ''} href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
