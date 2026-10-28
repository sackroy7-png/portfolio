import { profile } from "../data/profile.js";
import Reveal from "../components/Reveal.jsx";

export default function Contact() {
  const { email, linkedin, message } = profile.contact;
  const subject = encodeURIComponent("Proposition de stage");

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow eyebrow--light">
            <span>07</span>
            <span aria-hidden="true" className="eyebrow__rule" />
            <span>Contact</span>
          </p>
          <h2 id="contact-title" className="contact__title">
            Un stage dans le sport ou l'outdoor&nbsp;? Parlons-en.
          </h2>
          <p className="contact__message">{message}</p>
        </Reveal>

        <Reveal className="contact__grid" delay={80}>
          <a className="contact__email" href={`mailto:${email}`}>
            {email}
          </a>
          <div className="contact__actions">
            <a className="btn btn--light" href={`mailto:${email}?subject=${subject}`}>
              M'écrire un e-mail
            </a>
            {linkedin && (
              <a className="btn btn--ghost-light" href={linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
