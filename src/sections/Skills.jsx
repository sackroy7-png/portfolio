import { profile } from "../data/profile.js";
import Meter from "../components/Meter.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHead from "../components/SectionHead.jsx";

export default function Skills() {
  const { skills, tools, levels } = profile;
  const max = Object.keys(levels).length;

  return (
    <section id="competences" className="section container" aria-labelledby="competences-title">
      <SectionHead index="05" label="Compétences & outils" title={<span id="competences-title">Ce que je sais faire, ce que j'apprends.</span>} />

      <div className="skills">
        <Reveal className="skills__col">
          <h3 className="block__title">Compétences</h3>
          <ul className="skill-list">
            {skills.map((skill) => (
              <li key={skill.name} className="skill">
                <div className="skill__head">
                  <p className="skill__name">{skill.name}</p>
                  <span className="skill__level">
                    <Meter level={skill.level} max={max} label={levels[skill.level]} />
                    <span className="mono-label">{levels[skill.level]}</span>
                  </span>
                </div>
                {skill.detail && <p className="skill__detail">{skill.detail}</p>}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="skills__col" delay={80}>
          <h3 className="block__title">Outils</h3>
          <ul className="tool-grid">
            {tools.map((tool) => (
              <li key={tool.name} className={`tool ${tool.status === "en apprentissage" ? "tool--learning" : ""}`}>
                <p className="tool__name">{tool.name}</p>
                <Meter level={tool.level} max={max} label={levels[tool.level]} />
                <p className="mono-label">{tool.status === "en apprentissage" ? "En apprentissage" : levels[tool.level]}</p>
              </li>
            ))}
          </ul>
          <p className="legend mono-label">
            Échelle : {Object.entries(levels).map(([n, label]) => `${n} ${label}`).join(" · ")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
