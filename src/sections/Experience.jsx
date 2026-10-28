import { useCallback, useState } from "react";
import { profile } from "../data/profile.js";
import { asset } from "../lib/asset.js";
import Img from "../components/Img.jsx";
import Reveal from "../components/Reveal.jsx";
import Lightbox from "../components/Lightbox.jsx";
import SectionHead from "../components/SectionHead.jsx";

function ExperienceItem({ exp }) {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const photos = (exp.photos ?? []).filter((p) => p?.src);
  const [main, ...others] = photos;
  const deck = exp.presentation ?? {};
  const deckHref = deck.url || (deck.file ? asset(deck.file) : "");

  return (
    <article className="exp">
      {main && (
        <Reveal className="exp__media">
          <button type="button" className="exp__photo" onClick={() => setOpen(0)} aria-label={`Agrandir : ${main.alt}`}>
            <Img image={main} sizes="(min-width: 900px) 45vw, 100vw" />
          </button>
          {main.caption && <p className="caption"><span>Fig. 01</span><span>{main.caption}</span></p>}
        </Reveal>
      )}

      <Reveal className="exp__body" delay={80}>
        {exp.logo?.src && <Img image={exp.logo} className="exp__logo" />}
        <p className="mono-label">
          {[exp.type, exp.duration, exp.period].filter(Boolean).join(" · ")}
        </p>
        <h3 className="exp__title">{exp.company}</h3>
        {exp.role && <p className="exp__role">{exp.role}</p>}
        {exp.summary && <p className="exp__summary">{exp.summary}</p>}
        {exp.highlight && <p className="exp__highlight">{exp.highlight}</p>}

        {exp.missions?.length > 0 && (
          <>
            <h4 className="block__title exp__missions-title">Missions</h4>
            <ul className="check-list">
              {exp.missions.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </>
        )}

        {deckHref && (
          <div className="actions">
            <a className="btn" href={deckHref} target="_blank" rel="noopener noreferrer">
              {deck.label || "Voir le support"} ↗
            </a>
          </div>
        )}
      </Reveal>

      {others.length > 0 && (
        <div className="exp__strip">
          {others.map((photo, i) => (
            <Reveal as="figure" key={photo.src} delay={i * 80}>
              <button type="button" className="exp__photo exp__photo--small" onClick={() => setOpen(i + 1)} aria-label={`Agrandir : ${photo.alt}`}>
                <Img image={photo} sizes="(min-width: 900px) 30vw, 50vw" />
              </button>
              {photo.caption && <figcaption className="caption"><span>Fig. {String(i + 2).padStart(2, "0")}</span><span>{photo.caption}</span></figcaption>}
            </Reveal>
          ))}
        </div>
      )}

      {open !== null && (
        <Lightbox items={photos.map((p) => ({ ...p, title: p.caption || p.alt, caption: "" }))} index={open} onClose={close} onNavigate={setOpen} />
      )}
    </article>
  );
}

export default function Experience() {
  const experiences = profile.experiences ?? [];
  if (!experiences.length) return null;
  return (
    <section id="experience" className="section container" aria-labelledby="experience-title">
      <SectionHead index="02" label="Expérience" title={<span id="experience-title">Sur le terrain.</span>} />
      <div className="exp-list">
        {experiences.map((exp, i) => (
          <ExperienceItem key={`${exp.company}-${i}`} exp={exp} />
        ))}
      </div>
    </section>
  );
}
