import React from 'react';
import { useSiteData } from '../../context/SiteDataContext';
import Reveal from '../Reveal/Reveal';
import './Experience.css';

export default function Experience() {
  const { data } = useSiteData();
  const { experience } = data;

  return (
    <section className="experience" id="experience">
      <div className="experience__inner">
        <Reveal>
          <h2 className="experience__heading">{experience.heading}</h2>
        </Reveal>

        <div className="experience__timeline">
          {experience.items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.1}>
              <article className="experience__item">
                <div className="experience__item-period">{item.period}</div>
                <div className="experience__item-content">
                  <h3 className="experience__item-position">{item.position}</h3>
                  <span className="experience__item-company">{item.company}</span>
                  <p className="experience__item-desc">{item.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
