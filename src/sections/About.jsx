import { profile } from "../data/profile.js";
import Img from "../components/Img.jsx";
import Text from "../components/Text.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHead from "../components/SectionHead.jsx";

export default function About() {
  const { about, education, internship } = profile;
  return (
    <section id="apropos" className="section container" aria-labelledby="apropos-title">
      <SectionHead index="01" label="À propos" title={<span id="apropos-title">Un profil commercial, un regard produit.</span>} />

      <div className="about">
        <Reveal className="about__visual">
          <figure className="about__portrait">
            <Img image={about.portrait} sizes="(min-width: 900px) 30vw, 90vw" />
          </figure>
          {about.detailImage?.src && (
            <figure className="about__detail">
              <Img image={about.detailImage} sizes="(min-width: 900px) 18vw, 50vw" />
              <figcaption className="caption">
                <span>Fig. 02</span>
                <Text value={about.detailImage.caption} />
              </figcaption>
            </figure>
          )}
        </Reveal>

        <div className="about__content">
          <Reveal className="prose">
            {about.paragraphs.map((p, i) => (
              <Text key={i} as="p" value={p} />
            ))}
          </Reveal>

          <Reveal as="blockquote" className="goal">
            <p className="mono-label">Objectif professionnel</p>
            <p className="goal__text">{about.goal}</p>
          </Reveal>

          {about.goalLink?.paragraphs?.length > 0 && (
            <Reveal className="block">
              <h3 className="block__title">{about.goalLink.title}</h3>
              <div className="prose">
                {about.goalLink.paragraphs.map((p, i) => (
                  <Text key={i} as="p" value={p} />
                ))}
              </div>
            </Reveal>
          )}

          <Reveal className="block">
            <h3 className="block__title">Centres d'intérêt</h3>
            <ul className="tags">
              {about.interests.map((tag) => (
                <li key={tag} className="tag">{tag}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="block">
            <h3 className="block__title">Formation</h3>
            <ol className="timeline">
              {education.map((item, i) => (
                <li key={i} className="timeline__item">
                  <Text className="timeline__period mono-label" value={item.period} />
                  <div>
                    <Text as="p" className="timeline__title" value={item.title} />
                    <Text as="p" className="timeline__detail" value={item.detail} />
                    <Text as="p" className="timeline__school" value={item.school} />
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal as="aside" className="internship" aria-label="Recherche de stage">
            <div className="internship__head">
              <p className="mono-label">Recherche de stage</p>
              <span className="status-dot">Disponible</span>
            </div>
            <dl className="internship__grid">
              <div>
                <dt>Durée</dt>
                <dd>{internship.duration}</dd>
              </div>
              <div>
                <dt>Dates</dt>
                <dd><Text value={internship.dates} /></dd>
              </div>
              <div>
                <dt>Secteur</dt>
                <dd>{internship.sectors}</dd>
              </div>
              <div className="internship__wide">
                <dt>Missions recherchées</dt>
                <dd>{internship.missions.join(" · ")}</dd>
              </div>
            </dl>
            <a className="btn btn--light" href="#contact">Proposer un stage</a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
