import { useMemo } from "react";
import { CONTRACTS, fit } from "../data.js";
import { Icon, OfferCard } from "../components/ui.jsx";

// Accueil personnalisé : ce qui est proche, ce qui correspond, ce qui est nouveau.
export default function Home({ state, offers, notifCount, go, onSave }) {
  const { profile, saved, apps } = state;
  const applied = new Set(apps.map((a) => a.id));

  const forYou = useMemo(
    () => offers.map((o) => ({ o, f: fit(o, profile) })).filter(({ f }) => f.match).sort((a, b) => b.f.score - a.f.score || a.o.km - b.o.km),
    [offers, profile]
  );
  const nearby = useMemo(() => [...offers].sort((a, b) => a.km - b.km).slice(0, 5), [offers]);
  const featured = offers.filter((o) => o.featured);
  const interview = apps.find((a) => a.status === "entretien");

  return (
    <div className="screen">
      <header className="large-title">
        <div>
          <p className="eyebrow">{profile.city}</p>
          <h1>Bonjour {profile.firstName || "toi"}</h1>
        </div>
        <button type="button" className="icon-btn icon-btn--glass icon-btn--badge" onClick={() => go({ screen: "notifications" })} aria-label={`Notifications${notifCount ? `, ${notifCount} non lues` : ""}`}>
          <Icon name="bell" size={20} />
          {notifCount > 0 && <span className="dot">{notifCount}</span>}
        </button>
      </header>

      <button type="button" className="searchbar glass" onClick={() => go({ tab: "explore", focus: true })}>
        <Icon name="search" size={18} /> Métier, entreprise, ville…
      </button>

      {interview && (
        <button type="button" className="highlight-card" onClick={() => go({ screen: "application", id: interview.id })}>
          <span className="highlight-card__icon"><Icon name="calendar" size={20} /></span>
          <span>
            <strong>Entretien à venir</strong>
            <small>{interview.interview?.when}</small>
          </span>
          <Icon name="chevron" size={18} />
        </button>
      )}

      <section className="section">
        <div className="section__head">
          <h2>Pour toi</h2>
          <button type="button" className="link" onClick={() => go({ tab: "explore", preset: { forMe: true } })}>Tout voir</button>
        </div>
        <p className="section__sub">{forYou.length} offre{forYou.length > 1 ? "s" : ""} adaptée{forYou.length > 1 ? "s" : ""} à ton âge, ton niveau et ta zone.</p>
        <div className="stack">
          {forYou.slice(0, 3).map(({ o, f }) => (
            <OfferCard key={o.id} offer={o} onOpen={(id) => go({ screen: "offer", id })} saved={saved.includes(o.id)} onSave={onSave} applied={applied.has(o.id)}
              reason={f.skills.length ? `Tes compétences : ${f.skills.join(", ")}` : `À ${o.km < 3 ? "deux pas" : `${o.km} km`} de chez toi`} />
          ))}
          {forYou.length === 0 && <p className="muted">Aucune offre ne correspond encore : élargis ta zone dans ton profil.</p>}
        </div>
      </section>

      <section className="section">
        <div className="section__head"><h2>Près de toi</h2></div>
        <div className="carousel">
          {nearby.map((o) => (
            <OfferCard key={o.id} variant="tile" offer={o} onOpen={(id) => go({ screen: "offer", id })} applied={applied.has(o.id)} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head"><h2>Explorer par type</h2></div>
        <div className="grid-cards grid-cards--3">
          {CONTRACTS.map((c) => (
            <button key={c.id} type="button" className="card-choice card-choice--sm" onClick={() => go({ tab: "explore", preset: { contracts: [c.id] } })}>
              <span className="card-choice__icon" aria-hidden="true">{c.icon}</span>
              <strong>{c.id}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head"><h2>Mises en avant</h2></div>
        <div className="stack">
          {featured.map((o) => (
            <OfferCard key={o.id} offer={o} onOpen={(id) => go({ screen: "offer", id })} saved={saved.includes(o.id)} onSave={onSave} applied={applied.has(o.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}
