import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteData } from '../../context/SiteDataContext';
import Reveal from '../Reveal/Reveal';
import './Education.css';

export default function Education() {
  const { data } = useSiteData();
  const { education } = data;
  const [activeIndex, setActiveIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const activeItem = activeIndex !== null ? education.items[activeIndex] : null;

  return (
    <section
      className="education"
      id="education"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      <div className="education__inner">
        <Reveal>
          <h2 className="education__heading">{education.heading}</h2>
        </Reveal>

        <div className="education__list">
          {education.items.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.06}>
              <article
                className={`education__row${activeIndex === i ? ' education__row--active' : ''}`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <span className="education__row-year">{item.year}</span>
                <div className="education__row-info">
                  <h3 className="education__row-title">{item.title}</h3>
                  <span className="education__row-institution">{item.institution}</span>
                </div>
                <p className="education__row-desc">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Floating image that follows mouse */}
      <AnimatePresence>
        {activeItem?.image && (
          <motion.div
            className="education__preview"
            style={{
              left: mousePos.x,
              top: mousePos.y,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <img
              src={activeItem.image}
              alt={activeItem.title}
              className="education__preview-img"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
