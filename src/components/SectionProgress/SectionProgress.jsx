import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SectionProgress.css';

export default function SectionProgress() {
  const sections = ['hero', 'about', 'experience', 'education', 'services', 'works', 'contact'];
  const labels = ['Главная', 'Обо мне', 'Опыт', 'Обучение', 'Услуги', 'Работы', 'Контакты'];

  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef(null);

  // Set CSS variable with nav width so hero photo can offset
  const updateNavWidth = useCallback(() => {
    if (navRef.current) {
      const w = navRef.current.offsetWidth;
      document.documentElement.style.setProperty('--nav-width', w + 'px');
    }
  }, []);

  useEffect(() => {
    updateNavWidth();
    window.addEventListener('resize', updateNavWidth);
    return () => window.removeEventListener('resize', updateNavWidth);
  }, [updateNavWidth]);

  useEffect(() => {
    const handleScroll = () => {
      const midY = window.innerHeight * 0.4;
      let current = 0;
      sections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= midY) {
          current = i;
        }
      });
      setActiveIndex(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="section-progress" ref={navRef}>
      {sections.map((s, i) => (
        <button
          key={s}
          className={`section-progress__dot${
            i === activeIndex ? ' section-progress__dot--active' : ''
          }${i < activeIndex ? ' section-progress__dot--passed' : ''}`}
          onClick={() => handleClick(s)}
          title={labels[i]}
          aria-label={labels[i]}
        >
          <span className="section-progress__label">{labels[i]}</span>
        </button>
      ))}
    </nav>
  );
}
