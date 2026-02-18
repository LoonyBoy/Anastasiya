import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useSiteData } from '../../context/SiteDataContext';
import './Works.css';

export default function Works() {
  const { data } = useSiteData();
  const { works } = data;
  const [selectedImage, setSelectedImage] = useState(null);
  const sectionRef = useRef(null);
  const items = works.items;

  /* Scroll progress of the tall section */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  /* Map scroll progress to translateY of the grid.
     Grid starts below the viewport (100%) and scrolls up to above it (-100%). */
  const gridY = useTransform(scrollYProgress, [0, 1], ['60%', '-60%']);

  return (
    <section className="works" id="works" ref={sectionRef}>
      <div className="works__sticky">
        {/* Centered heading — stays fixed in the middle */}
        <h2 className="works__heading">Работы</h2>

        {/* Grid of photos that scrolls vertically through the viewport */}
        <motion.div className="works__grid" style={{ y: gridY }}>
          {items.map((item) => (
            <div key={item.id} className="works__item">
              <div
                className="works__photo-wrap"
                onClick={() => setSelectedImage(item)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="works__photo"
                  loading="lazy"
                />
              </div>
              <div className="works__caption">
                <span className="works__item-title">{item.title}</span>
                <span className="works__item-category">{item.category}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="works__lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="works__lightbox-image"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <button className="works__lightbox-close" onClick={() => setSelectedImage(null)}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
