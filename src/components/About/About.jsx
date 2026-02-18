import React from 'react';
import { motion } from 'framer-motion';
import { useSiteData } from '../../context/SiteDataContext';
import Reveal from '../Reveal/Reveal';
import './About.css';

export default function About() {
  const { data } = useSiteData();
  const { about } = data;

  return (
    <section className="about" id="about">
      <div className="about__inner">
        <div className="about__content">
          <Reveal className="about__image-wrap" delay={0.1}>
            <div className="about__image-frame">
              <img src={about.image} alt="Анастасия Черенкова" className="about__image" />
              <h2 className="about__heading">{about.heading}</h2>
            </div>
          </Reveal>

          <div className="about__text-side">
            <Reveal delay={0.2}>
              <p className="about__text">{about.text}</p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="about__stats">
                {about.stats.map((stat, i) => (
                  <div className="about__stat" key={i}>
                    <span className="about__stat-value">{stat.value}</span>
                    <span className="about__stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
