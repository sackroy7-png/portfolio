import { profile } from "../data/profile.js";
import { asset } from "../lib/asset.js";
import Text from "../components/Text.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionHead from "../components/SectionHead.jsx";

export default function Documents() {
  return (
    <section id="documents" className="section container" aria-labelledby="documents-title">
      <SectionHead index="05" label="CV & documents" title={<span id="documents-title">Documents à consulter.</span>} />

      <ul className="doc-list">
        {profile.documents.map((doc, i) => (
          <Reveal as="li" key={doc.label} className="doc" delay={i * 80}>
            <span className="doc__index mono-label">D.{String(i + 1).padStart(2, "0")}</span>
            <div className="doc__info">
              <p className="doc__label">{doc.label}</p>
              {doc.file ? (
                <p className="mono-label">
                  PDF{doc.updated && <> · Mis à jour : <Text value={doc.updated} /></>}
                  {doc.placeholder && <span className="todo todo--inline">fichier temporaire</span>}
                </p>
              ) : (
                <p className="mono-label">{doc.note}</p>
              )}
            </div>
            {doc.file && (
              <div className="doc__actions">
                <a className="btn btn--ghost btn--small" href={asset(doc.file)} target="_blank" rel="noopener">
                  Consulter
                </a>
                <a className="btn btn--small" href={asset(doc.file)} download>
                  Télécharger
                </a>
              </div>
            )}
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
