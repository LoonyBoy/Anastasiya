import React from 'react';
import { motion } from 'framer-motion';
import { useSiteData } from '../../context/SiteDataContext';
import Header from '../../components/Header/Header';
import About from '../../components/About/About';
import Experience from '../../components/Experience/Experience';
import Education from '../../components/Education/Education';
import Services from '../../components/Services/Services';
import Works from '../../components/Works/Works';
import Contact from '../../components/Contact/Contact';
import SectionProgress from '../../components/SectionProgress/SectionProgress';
import './HomePage.css';

export default function HomePage() {
  const { data } = useSiteData();
  const { hero } = data;

  return (
    <>
      <Header />
      <SectionProgress />

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero__inner">

          <div className="hero__name-block">
            {/* Single text with mix-blend-mode */}
            <motion.h1
              className="hero__name"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            >
              {hero.name.split(' ').map((word, i) => (
                <span key={i} className="hero__name-line">{word}</span>
              ))}
            </motion.h1>

            {/* Photo */}
            <motion.div
              className="hero__photo"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            >
              <img
                src={hero.image || '/photo/DSC05530.jpg'}
                alt={hero.name}
                className="hero__photo-img"
              />
            </motion.div>
          </div>

          <motion.div
            className="hero__bottom-row"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <p className="hero__subtitle">{hero.subtitle}</p>
            <a href="#about" className="hero__scroll" onClick={(e) => {
              e.preventDefault();
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              <span className="hero__scroll-text">Подробнее</span>
              <span className="hero__scroll-line" />
            </a>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="hero__deco-line"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        />
      </section>

      <About />
      <Experience />
      <Education />
      <Services />
      <Works />
      <Contact />
    </>
  );
}
