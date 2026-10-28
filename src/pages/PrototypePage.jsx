import { Suspense, useEffect } from "react";
import { PROTOTYPES } from "./ProjectPage.jsx";

// Prototype en plein écran (pratique sur téléphone).
export default function PrototypePage({ slug }) {
  const Prototype = PROTOTYPES[slug];

  useEffect(() => {
    document.title = "Prototype — Sacha Roy";
  }, []);

  if (!Prototype) {
    return (
      <main id="contenu" className="container case case--missing">
        <h1 className="section-title">Prototype introuvable.</h1>
        <a className="btn" href="#projets">Retour aux projets</a>
      </main>
    );
  }

  return (
    <main id="contenu" tabIndex={-1} className="proto-page">
      <a className="proto-page__back" href={`#/projets/${slug}`}>
        ← Retour au portfolio
      </a>
      <Suspense fallback={<p className="mono-label">Chargement…</p>}>
        <Prototype framed={false} />
      </Suspense>
    </main>
  );
}
