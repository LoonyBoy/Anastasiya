import React from 'react';
import { useSiteData } from '../../context/SiteDataContext';
import Reveal from '../Reveal/Reveal';
import './Contact.css';

export default function Contact() {
  const { data } = useSiteData();
  const { contact } = data;

  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <Reveal>
          <h2 className="contact__heading">{contact.heading}</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="contact__subtitle">{contact.subtitle}</p>
        </Reveal>

        <div className="contact__content">
          <Reveal delay={0.15} className="contact__info">
            <div className="contact__info-group">
              <span className="contact__label">Telegram</span>
              <a
                href="https://t.me/Anastasi_Cherenkova"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__value contact__link"
              >
                @Anastasi_Cherenkova
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.25} className="contact__cta">
            <a
              href="https://t.me/Anastasi_Cherenkova"
              target="_blank"
              rel="noopener noreferrer"
              className="contact__cta-button"
            >
              Связаться
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.3}>
          <div className="contact__footer">
            <span className="contact__footer-name">Анастасия Черенкова</span>
            <span className="contact__footer-copy">© {new Date().getFullYear()}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
