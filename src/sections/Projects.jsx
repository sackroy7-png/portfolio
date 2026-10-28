import { projects } from "../data/projects.js";
import { slugify } from "../lib/asset.js";
import Img from "../components/Img.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHead from "../components/SectionHead.jsx";

export default function Projects() {
  return (
    <section id="projets" className="section container" aria-labelledby="projets-title">
      <SectionHead index="02" label="Projets" title={<span id="projets-title">Expériences, projets et études.</span>}>
        <p>Chaque projet s'ouvre sur une courte présentation et ses photos.</p>
      </SectionHead>

      <div className="project-grid">
        {projects.map((project, i) => (
          <Reveal key={project.slug} className={`project-card project-card--${(i % 3) + 1}`} delay={i * 80}>
            <a href={`#/projets/${project.slug}`} className="project-card__link">
              <div className="project-card__media">
                <Img image={project.cover} sizes="(min-width: 900px) 55vw, 100vw" />
                <span className={`status status--${slugify(project.status)}`}>{project.status}</span>
              </div>
              <div className="project-card__body">
                <p className="mono-label">
                  P.{String(i + 1).padStart(2, "0")} · {project.kicker}
                </p>
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__summary">{project.summary}</p>
                <div className="project-card__foot">
                  <ul className="mini-tags" aria-label="Catégories">
                    {project.categories.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <span className="link-arrow" aria-hidden="true">Voir le projet →</span>
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
