import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useSiteData } from '../../context/SiteDataContext';
import './Works.css';

export default function Works() {
  const { data } = useSiteData();
  const { works } = data;
  const [selectedImage, setSelectedImage] = useState(null);
  const items = works.items;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, slidesToScroll: 1, align: 'center' },
    [Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setCurrent(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <section className="works" id="works">
      <div className="works__container">
        <h2 className="works__heading">Работы</h2>

        <div className="works__carousel" ref={emblaRef}>
          <div className="works__carousel-track">
            {items.map((item, index) => (
              <div className="works__slide" key={item.id}>
                <motion.div
                  initial={false}
                  animate={{
                    clipPath:
                      current !== index
                        ? 'inset(15% 0 15% 0 round 1.2rem)'
                        : 'inset(0 0 0 0 round 1.2rem)',
                  }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="works__slide-clip"
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.image}
                    alt=""
                    className="works__photo"
                    loading="lazy"
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="works__nav">
          <button className="works__nav-btn" aria-label="Previous slide" onClick={scrollPrev}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="works__nav-btn" aria-label="Next slide" onClick={scrollNext}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Pagination dots */}
        <div className="works__dots">
          {items.map((_, index) => (
            <button
              key={index}
              className={`works__dot${current === index ? ' works__dot--active' : ''}`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
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
              alt=""
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
