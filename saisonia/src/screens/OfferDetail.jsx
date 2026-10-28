import { useState } from "react";
import { CONTRACT_TONES, fit, kmLabel } from "../data.js";
import { Avatar, ContractTag, Icon, Sheet, StatusPill } from "../components/ui.jsx";

const QUICK_MESSAGES = ["Je suis disponible tout l'été.", "J'habite à proximité.", "J'ai déjà travaillé en contact avec des clients."];

// Candidature en deux étapes : vérifier son dossier, ajouter un mot, envoyer.
function ApplySheet({ offer, profile, onClose, onSend, go }) {
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <Sheet title="Candidature envoyée" onClose={onClose}>
        <div className="success">
          <span className="success__check" aria-hidden="true"><Icon name="check" size={40} strokeWidth={2.6} /></span>
          <h3>C'est envoyé !</h3>
          <p>{offer.company} a reçu ta candidature. Tu seras prévenu·e dès qu'elle sera lue.</p>
          <ol className="next-steps">
            <li className="is-done">Envoyée</li>
            <li>Vue par l'entreprise</li>
            <li>Entretien</li>
            <li>Réponse</li>
          </ol>
          <button type="button" className="btn btn--primary btn--block" onClick={() => { onClose(); go({ tab: "applications" }); }}>Suivre ma candidature</button>
          <button type="button" className="btn btn--glass btn--block" onClick={onClose}>Continuer à explorer</button>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet
      title={step === 0 ? "Ton dossier" : "Un petit mot ?"}
      onClose={onClose}
      footer={
        step === 0 ? (
          <button type="button" className="btn btn--primary btn--block" onClick={() => setStep(1)}>Continuer</button>
        ) : (
          <>
            <button type="button" className="link" onClick={() => setStep(0)}>Retour</button>
            <button type="button" className="btn btn--primary" onClick={() => { onSend(message); setSent(true); }}>Envoyer</button>
          </>
        )
      }
    >
      <p className="muted">Étape {step + 1} sur 2 · {offer.title}, {offer.company}</p>
      {step === 0 ? (
        <ul className="list glass">
          <li><span>Prénom</span><strong>{profile.firstName}</strong></li>
          <li><span>Âge</span><strong>{profile.age} ans</strong></li>
          <li><span>Niveau</span><strong>{profile.level}</strong></li>
          <li><span>Disponibilités</span><strong>{profile.availability.join(", ") || "—"}</strong></li>
          <li><span>CV</span><strong className={profile.cv ? "" : "warn"}>{profile.cv || "Aucun CV — facultatif"}</strong></li>
        </ul>
      ) : (
        <>
          <label className="field glass">
            <span>Message à l'entreprise (facultatif)</span>
            <textarea rows="4" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Bonjour, je suis intéressé·e par…" />
          </label>
          <p className="label">Suggestions</p>
          <div className="chips">
            {QUICK_MESSAGES.map((m) => (
              <button key={m} type="button" className="chip chip--sm" onClick={() => setMessage((v) => (v ? `${v} ${m}` : m))}>+ {m}</button>
            ))}
          </div>
        </>
      )}
    </Sheet>
  );
}

export default function OfferDetail({ offer, state, dispatch, go, back, toast }) {
  const { profile, saved, apps } = state;
  const [applying, setApplying] = useState(false);
  const f = fit(offer, profile);
  const app = apps.find((a) => a.id === offer.id);
  const isSaved = saved.includes(offer.id);
  const [bg, fg] = CONTRACT_TONES[offer.contract] || ["#eef1f6", "#223"];

  return (
    <div className="screen screen--detail">
      <div className="detail-hero" style={{ "--tone-bg": bg, "--tone-fg": fg }}>
        <div className="detail-hero__bar">
          <button type="button" className="icon-btn icon-btn--glass" onClick={back} aria-label="Retour"><Icon name="back" size={20} /></button>
          <button type="button" className={`icon-btn icon-btn--glass ${isSaved ? "is-on" : ""}`} aria-pressed={isSaved}
            onClick={() => { dispatch({ type: "save", id: offer.id }); toast(isSaved ? "Retiré des favoris" : "Ajouté aux favoris"); }}
            aria-label={isSaved ? "Retirer des favoris" : "Ajouter aux favoris"}>
            <Icon name="heart" size={20} fill={isSaved} />
          </button>
        </div>
        <Avatar name={offer.company} size={64} tone={fg} />
      </div>

      <div className="detail-body">
        <div className="detail-tags">
          <ContractTag contract={offer.contract} />
          {offer.featured && <span className="badge badge--gold">Mise en avant</span>}
          {offer.isNew && <span className="badge badge--new">Nouveau</span>}
        </div>
        <h1 className="detail-title">{offer.title}</h1>
        <p className="muted">{offer.company} · {offer.city} · publiée {offer.posted}</p>

        <div className="facts">
          <div className="fact glass"><Icon name="euro" size={18} /><span>Rémunération</span><strong>{offer.pay}</strong></div>
          <div className="fact glass"><Icon name="calendar" size={18} /><span>Dates</span><strong>{offer.dates}</strong></div>
          <div className="fact glass"><Icon name="clock" size={18} /><span>Horaires</span><strong>{offer.hours}{offer.flexible ? " · flexibles" : ""}</strong></div>
          <div className="fact glass"><Icon name="pin" size={18} /><span>Distance</span><strong>{kmLabel(offer.km)} de {profile.city}</strong></div>
        </div>

        <section className={`eligibility ${f.ageOk ? "" : "is-blocked"}`} aria-label="Conditions">
          <Icon name={f.ageOk ? "check" : "info"} size={20} />
          <p>
            <strong>Âge minimum : {offer.minAge} ans</strong>
            {f.ageOk ? " · tu peux postuler." : ` · tu as ${profile.age} ans, cette offre n'est pas encore accessible.`}
          </p>
        </section>

        <section className="detail-section">
          <h2>Pourquoi cette offre</h2>
          <ul className="fit">
            <li className={f.near ? "ok" : ""}>{f.near ? "Dans ta zone de recherche" : `Hors de ta zone (${profile.radius} km)`}</li>
            <li className={f.levelOk ? "ok" : ""}>{f.levelOk ? "Ouverte à ton niveau" : "Niveau différent du tien"}</li>
            <li className={f.contractOk ? "ok" : ""}>{f.contractOk ? `Tu cherches : ${offer.contract}` : `${offer.contract} : pas dans tes recherches`}</li>
            {f.skills.length > 0 && <li className="ok">Tes compétences : {f.skills.join(", ")}</li>}
          </ul>
        </section>

        <section className="detail-section">
          <h2>Missions</h2>
          <ul className="bullets">{offer.missions.map((m) => <li key={m}>{m}</li>)}</ul>
        </section>

        <section className="detail-section">
          <h2>Compétences utiles</h2>
          <div className="chips">
            {offer.skills.map((s) => (
              <span key={s} className={`chip chip--static ${profile.skills.includes(s) ? "is-match" : ""}`}>{profile.skills.includes(s) && "✓ "}{s}</span>
            ))}
          </div>
        </section>

        <section className="detail-section">
          <h2>L'entreprise</h2>
          <div className="company glass">
            <Avatar name={offer.company} size={44} tone={fg} />
            <div><strong>{offer.company}</strong><p className="muted">{offer.companyAbout}</p></div>
          </div>
          <p className="muted small">Niveaux acceptés : {offer.levels.join(", ")} · Domaine : {offer.domain}</p>
        </section>
      </div>

      <div className="cta-bar glass-strong">
        <div>
          <strong>{offer.pay}</strong>
          <small>{offer.contract} · {offer.city}</small>
        </div>
        {app ? (
          <button type="button" className="btn btn--glass" onClick={() => go({ screen: "application", id: offer.id })}>
            <StatusPill status={app.status} /> Suivre
          </button>
        ) : (
          <button type="button" className="btn btn--primary" disabled={!f.ageOk} onClick={() => setApplying(true)}>
            {f.ageOk ? "Postuler" : `Dès ${offer.minAge} ans`}
          </button>
        )}
      </div>

      {applying && (
        <ApplySheet offer={offer} profile={profile} go={go} onClose={() => setApplying(false)} onSend={(message) => dispatch({ type: "apply", id: offer.id, message })} />
      )}
    </div>
  );
}
