import { useState } from "react";
import { CONTRACTS, HOME_CITIES, LEVELS, toggle } from "../data.js";
import { Icon } from "../components/ui.jsx";
import logo from "../assets/logo.png";

// Premier lancement : 4 étapes courtes pour personnaliser les offres dès l'arrivée.
export default function Onboarding({ profile, onDone }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(profile);
  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const last = 3;
  const canNext = step !== 1 || (draft.firstName.trim() && draft.age >= 14);

  return (
    <div className="onb">
      <div className="onb__glow" aria-hidden="true" />
      <header className="onb__top">
        {step > 0 ? (
          <button type="button" className="icon-btn icon-btn--glass" onClick={() => setStep(step - 1)} aria-label="Étape précédente">
            <Icon name="back" size={20} />
          </button>
        ) : (
          <span />
        )}
        <ol className="onb__dots" aria-label={`Étape ${step + 1} sur ${last + 1}`}>
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className={i <= step ? "is-on" : ""} />
          ))}
        </ol>
        {step < last ? (
          <button type="button" className="link" onClick={() => onDone(draft)}>
            Passer
          </button>
        ) : (
          <span />
        )}
      </header>

      <div className="onb__body" key={step}>
        {step === 0 && (
          <div className="onb__welcome">
            <img src={logo} alt="" className="onb__logo" />
            <h1>Ton premier job,<br />près de chez toi.</h1>
            <p className="lead">Stages, alternances, jobs d'été et saisonniers proposés par les entreprises d'Auvergne.</p>
            <ul className="onb__promises">
              <li><span>📍</span><div><strong>Local</strong> Des offres autour de toi, pas à l'autre bout de la France.</div></li>
              <li><span>⚡</span><div><strong>Rapide</strong> Ton profil suffit pour postuler en quelques secondes.</div></li>
              <li><span>🤝</span><div><strong>Accompagné</strong> Tu suis chaque candidature, étape par étape.</div></li>
            </ul>
          </div>
        )}

        {step === 1 && (
          <div>
            <h1>Qui es-tu ?</h1>
            <p className="lead">On affiche seulement les offres accessibles à ton âge et à ton niveau.</p>
            <label className="field glass">
              <span>Prénom</span>
              <input value={draft.firstName} onChange={(e) => set({ firstName: e.target.value })} autoComplete="given-name" />
            </label>
            <div className="field glass field--row">
              <span>Âge</span>
              <div className="stepper">
                <button type="button" onClick={() => set({ age: Math.max(14, draft.age - 1) })} aria-label="Diminuer l'âge">−</button>
                <output aria-live="polite">{draft.age} ans</output>
                <button type="button" onClick={() => set({ age: Math.min(30, draft.age + 1) })} aria-label="Augmenter l'âge">+</button>
              </div>
            </div>
            <p className="label">Niveau d'études</p>
            <div className="choices" role="radiogroup" aria-label="Niveau d'études">
              {LEVELS.map((l) => (
                <button key={l} type="button" role="radio" aria-checked={draft.level === l} className="choice glass" onClick={() => set({ level: l })}>
                  {l}
                  <span className="choice__mark"><Icon name="check" size={16} /></span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1>Tu cherches…</h1>
            <p className="lead">Plusieurs choix possibles.</p>
            <div className="grid-cards">
              {CONTRACTS.map((c) => (
                <button key={c.id} type="button" className="card-choice glass" aria-pressed={draft.wanted.includes(c.id)} onClick={() => set({ wanted: toggle(draft.wanted, c.id) })}>
                  <span className="card-choice__icon" aria-hidden="true">{c.icon}</span>
                  <strong>{c.id}</strong>
                  <small>{c.hint}</small>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1>Où ?</h1>
            <p className="lead">On met en avant les offres proches de toi.</p>
            <button type="button" className="btn btn--glass btn--block" onClick={() => set({ city: "Clermont-Ferrand" })}>
              <Icon name="pin" size={18} /> Utiliser ma position (simulée)
            </button>
            <div className="choices choices--2" role="radiogroup" aria-label="Ville">
              {HOME_CITIES.map((c) => (
                <button key={c} type="button" role="radio" aria-checked={draft.city === c} className="choice glass" onClick={() => set({ city: c })}>
                  {c}
                  <span className="choice__mark"><Icon name="check" size={16} /></span>
                </button>
              ))}
            </div>
            <label className="field glass">
              <span>Jusqu'à <strong>{draft.radius} km</strong></span>
              <input type="range" min="5" max="150" step="5" value={draft.radius} onChange={(e) => set({ radius: Number(e.target.value) })} />
            </label>
          </div>
        )}
      </div>

      <footer className="onb__foot">
        <button
          type="button"
          className="btn btn--primary btn--block"
          disabled={!canNext}
          onClick={() => (step < last ? setStep(step + 1) : onDone(draft))}
        >
          {step === 0 ? "Commencer" : step < last ? "Continuer" : "Voir mes offres"}
        </button>
        {step === 0 && <p className="fine">Prototype : aucune donnée n'est envoyée.</p>}
      </footer>
    </div>
  );
}
