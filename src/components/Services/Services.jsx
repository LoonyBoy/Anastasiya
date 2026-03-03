import React from 'react';
import { motion } from 'framer-motion';
import { useSiteData } from '../../context/SiteDataContext';
import Reveal from '../Reveal/Reveal';
import './Services.css';

export default function Services() {
  const { data } = useSiteData();
  const { services } = data;

  return (
    <section className="services" id="services">
      <div className="services__container">
        <h2 className="services__heading">{services.heading}</h2>

        <ul className="services__list">
          {services.items.map((item, i) => (
            <Reveal key={item.id}>
              <li className="services__item">
                <div className="services__item-number">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="services__item-content">
                  <h3 className="services__item-name">{item.name}</h3>
                  {item.description && (
                    <p className="services__item-desc">{item.description}</p>
                  )}
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
