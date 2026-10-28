import { profile } from "../data/profile.js";
import Img from "../components/Img.jsx";
import Text from "../components/Text.jsx";

export default function Hero() {
  const [first, ...rest] = profile.name.split(" ");
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero__meta mono-label">
          <span>Portfolio · Carnet n° 01</span>
          {profile.location && <Text value={profile.location} />}
          <span>
            Recherche de stage · <strong>{profile.internship.duration}</strong>
          </span>
        </div>

        <h1 id="hero-title" className="hero__name">
          <span className="hero__line">{first}</span>
          <span className="hero__line hero__line--indent">{rest.join(" ")}</span>
        </h1>

        <div className="hero__grid">
          <p className="hero__title">{profile.title}</p>
          <div className="hero__body">
            <p className="hero__intro">{profile.intro}</p>
            <div className="actions">
              <a className="btn" href="#projets">Découvrir mes projets</a>
              <a className="btn btn--ghost" href="#contact">Me contacter</a>
            </div>
          </div>
        </div>
      </div>

      <figure className="hero__figure">
        <div className="hero__media">
          <Img image={profile.heroImage} eager sizes="100vw" />
        </div>
        {profile.heroImage.caption && (
          <figcaption className="caption container">
            <span>Fig. 01</span>
            <Text value={profile.heroImage.caption} />
          </figcaption>
        )}
      </figure>
    </section>
  );
}
