import React from 'react';
import SocialLinks from './SocialLinks';

const FloatingSocialBar: React.FC = () => {
  return (
    <div className="social-fab-verse" aria-hidden="false">
      <SocialLinks />
    </div>
  );
};

export default FloatingSocialBar;

