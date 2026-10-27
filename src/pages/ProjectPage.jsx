import { useCallback, useEffect, useState } from "react";
import { projects } from "../data/projects.js";
import { slugify } from "../lib/asset.js";
import Img from "../components/Img.jsx";
import Text from "../components/Text.jsx";
import Reveal from "../components/Reveal.jsx";
import Lightbox from "../components/Lightbox.jsx";

// Bloc de texte avec un libellé dans la colonne de gauche.
function Row({ label, children }) {
  return (
    <Reveal className="case-row">
      <h2 className="case-row__label mono-label">{label}</h2>
      <div className="case-row__body">{children}</div>
    </Reveal>
  );
}

export default function ProjectPage({ slug }) {
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (project) document.title = `${project.title} — Sacha Roy`;
  }, [project]);

  if (!project) {
    return (
      <main id="contenu" tabIndex={-1} className="container case case--missing">
        <h1 className="section-title">Projet introuvable.</h1>
        <a className="btn" href="#projets">Retour aux projets</a>
      </main>
    );
  }

  const next = projects[(index + 1) % projects.length];
  const gallery = project.gallery ?? [];

  return (
    <main id="contenu" tabIndex={-1} className="case">
      <div className="container">
        <a className="link-arrow case__back" href="#projets">← Tous les projets</a>

        <header className="case__head">
          <p className="mono-label">
            P.{String(index + 1).padStart(2, "0")} · {project.kicker}
          </p>
          <h1 className="case__title">{project.title}</h1>
          <p className="case__summary">{project.summary}</p>

          <dl className="case__meta">
            {project.period && (
              <div>
                <dt>Période</dt>
                <dd><Text value={project.period} /></dd>
              </div>
            )}
            <div>
              <dt>Statut</dt>
              <dd><span className={`status status--inline status--${slugify(project.status)}`}>{project.status}</span></dd>
            </div>
            {project.role && (
              <div>
                <dt>Rôle</dt>
                <dd><Text value={project.role} /></dd>
              </div>
            )}
            <div>
              <dt>Catégories</dt>
              <dd>{project.categories.join(" · ")}</dd>
            </div>
          </dl>
        </header>
      </div>

      <figure className="case__cover">
        <Img image={project.cover} eager sizes="100vw" />
      </figure>

      <div className="container case__content">
        {project.context && (
          <Row label="Présentation">
            <Text as="p" className="case__lead" value={project.context} />
          </Row>
        )}

        {project.problem && (
          <Row label="Problématique">
            <Text as="p" className="case__question" value={project.problem} />
          </Row>
        )}

        {project.approach?.length > 0 && (
          <Row label="Ce que j'ai fait">
            <ol className="steps">
              {project.approach.map((step, i) => (
                <li key={i} className="step">
                  <span className="step__num mono-label">{String(i + 1).padStart(2, "0")}</span>
                  <Text as="h3" className="step__title" value={step.title} />
                  <Text as="p" className="step__text" value={step.text} />
                </li>
              ))}
            </ol>
          </Row>
        )}

        {gallery.length > 0 && (
          <div className="case-gallery">
            {gallery.map((image, i) => (
              <Reveal as="figure" key={image.src} className={`case-gallery__item ${image.wide ? "is-wide" : ""}`}>
                <button type="button" className="case-gallery__btn" onClick={() => setOpen(i)} aria-label={`Agrandir : ${image.alt}`}>
                  <Img image={image} sizes={image.wide ? "100vw" : "(min-width: 900px) 45vw, 100vw"} />
                </button>
                <figcaption className="caption">
                  <span>Fig. {String(i + 1).padStart(2, "0")}</span>
                  <Text value={image.caption} />
                </figcaption>
              </Reveal>
            ))}
          </div>
        )}

        {project.deliverables?.length > 0 && (
          <Row label="Livrables">
            <ul className="check-list">
              {project.deliverables.map((d, i) => (
                <Text as="li" key={i} value={d} />
              ))}
            </ul>
          </Row>
        )}

        {project.outcome && (
          <Row label="Bilan">
            <Text as="p" className="case__lead" value={project.outcome} />
          </Row>
        )}

        {project.learnings?.length > 0 && (
          <Row label="Apprentissages">
            <ul className="check-list">
              {project.learnings.map((d, i) => (
                <Text as="li" key={i} value={d} />
              ))}
            </ul>
          </Row>
        )}

        {project.links?.length > 0 && (
          <Row label="Liens">
            <ul className="link-list">
              {project.links.map((l) => (
                <li key={l.url}>
                  <a className="link-arrow" href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>
                </li>
              ))}
            </ul>
          </Row>
        )}
      </div>

      {next && next.slug !== project.slug && (
        <a className="case-next" href={`#/projets/${next.slug}`}>
          <span className="container case-next__inner">
            <span className="mono-label">Projet suivant</span>
            <span className="case-next__title">{next.title} →</span>
          </span>
        </a>
      )}

      {open !== null && (
        <Lightbox
          items={gallery.map((g) => ({ ...g, title: g.alt }))}
          index={open}
          onClose={close}
          onNavigate={setOpen}
        />
      )}
    </main>
  );
}
