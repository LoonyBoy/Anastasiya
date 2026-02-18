import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSiteData } from '../../context/SiteDataContext';
import './Services.css';

function StickyCard({ item, index, total, progress }) {
  const container = useRef(null);

  const targetScale = Math.max(0.85, 1 - (total - index - 1) * 0.04);
  const range = [index * (1 / total), 1];
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="services__card-wrap">
      <motion.article
        className="services__card"
        style={{
          scale,
          top: `calc(2vh + ${index * 28}px)`,
        }}
      >
        {/* Full-bleed image */}
        <div className="services__card-image">
          <img src={item.image} alt={item.name} loading="lazy" />
          {/* Gradient overlay for text readability */}
          <div className="services__card-gradient" />
        </div>

        {/* Text content over image */}
        <div className="services__card-content">
          <div className="services__card-top">
            <span className="services__card-index">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="services__card-duration">{item.duration}</span>
          </div>
          <div className="services__card-bottom">
            <div className="services__card-info">
              <h3 className="services__card-name">{item.name}</h3>
              <p className="services__card-desc">{item.description}</p>
            </div>
            <span className="services__card-price">{item.price}</span>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function Services() {
  const { data } = useSiteData();
  const { services } = data;
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="services__header">
        <h2 className="services__heading">{services.heading}</h2>
      </div>

      {services.items.map((item, i) => (
        <StickyCard
          key={item.id}
          item={item}
          index={i}
          total={services.items.length}
          progress={scrollYProgress}
        />
      ))}
    </section>
  );
}
