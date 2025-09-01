import React from 'react';
import ExperienceTimeline from './ExperienceTimeline';
import { experience } from '../data/experience';

const Timeline: React.FC = () => {
  return (
    <ExperienceTimeline
      items={experience}
      groupByYear={false}
      fx={{ level: 'medium', showOnomatopoeia: false, parallaxTilt: true }}
    />
  );
};

export default Timeline;
