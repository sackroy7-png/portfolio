import { useMemo, useState } from "react";
import { asset } from "../../lib/asset.js";
import "../../styles/saisonia.css";

// Prototype cliquable de l'application Saisonia (données fictives).

const OFFERS = [
  {
    id: 1,
    title: "Moniteur·rice de ski débutants",
    employer: "École de ski des Cimes",
    place: "Les Arcs (73)",
    zone: "Montagne",
    dates: "15 déc. → 20 avr.",
    pay: "1 850 € net / mois",
    perks: ["Logé", "Forfait offert"],
    text: "Encadrer des groupes d'enfants et d'adultes débutants. Diplôme ou formation en cours apprécié.",
  },
  {
    id: 2,
    title: "Serveur·se en terrasse",
    employer: "Restaurant L'Écume",
    place: "Biarritz (64)",
    zone: "Mer",
    dates: "1 juil. → 31 août",
    pay: "12,50 € / h",
    perks: ["Nourri"],
    text: "Service en terrasse face à l'océan, 35 h par semaine, deux jours de repos consécutifs.",
  },
  {
    id: 3,
    title: "Vendeur·se location de vélos",
    employer: "Cycles du Lac",
    place: "Annecy (74)",
    zone: "Montagne",
    dates: "1 mai → 30 sept.",
    pay: "12 € / h",
    perks: ["Vélo fourni"],
    text: "Accueil des clients, conseil, préparation et réglage des vélos de location.",
  },
  {
    id: 4,
    title: "Animateur·rice de camping",
    employer: "Camping Les Pins",
    place: "Lacanau (33)",
    zone: "Mer",
    dates: "15 juin → 15 sept.",
    pay: "1 600 € net / mois",
    perks: ["Logé"],
    text: "Animations enfants et soirées, en équipe de quatre animateurs.",
  },
  {
    id: 5,
    title: "Vendangeur·se",
    employer: "Domaine des Coteaux",
    place: "Beaune (21)",
    zone: "Campagne",
    dates: "10 sept. → 5 oct.",
    pay: "11,88 € / h",
    perks: ["Repas du midi"],
    text: "Cueillette et portage pendant les vendanges, travail en équipe, débutants bienvenus.",
  },
];

const ZONES = ["Tout", "Montagne", "Mer", "Campagne"];

function StatusBar() {
  return (
    <div className="sz-status" aria-hidden="true">
      <span>9:41</span>
      <span className="sz-status__icons">
        <i /> <i /> <b />
      </span>
    </div>
  );
}

function OfferList({ onOpen, applied }) {
  const [zone, setZone] = useState("Tout");
  const [query, setQuery] = useState("");
  const list = useMemo(
    () =>
      OFFERS.filter((o) => zone === "Tout" || o.zone === zone).filter((o) =>
        `${o.title} ${o.place} ${o.employer}`.toLowerCase().includes(query.toLowerCase())
      ),
    [zone, query]
  );

  return (
    <>
      <div className="sz-hero">
        <p className="sz-hello">Bonjour Alex 👋</p>
        <h4 className="sz-h">Trouve ta prochaine saison</h4>
        <label className="sz-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Métier, ville…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher une offre"
          />
        </label>
      </div>
      <div className="sz-chips" role="group" aria-label="Filtrer par lieu">
        {ZONES.map((z) => (
          <button key={z} type="button" className="sz-chip" aria-pressed={zone === z} onClick={() => setZone(z)}>
            {z}
          </button>
        ))}
      </div>
      <p className="sz-count">{list.length} offre{list.length > 1 ? "s" : ""} près de chez toi</p>
      <ul className="sz-list">
        {list.map((o) => (
          <li key={o.id}>
            <button type="button" className="sz-card" onClick={() => onOpen(o.id)}>
              <span className={`sz-card__zone sz-zone--${o.zone.toLowerCase()}`}>{o.zone}</span>
              <span className="sz-card__title">{o.title}</span>
              <span className="sz-card__meta">{o.employer} · {o.place}</span>
              <span className="sz-card__row">
                <span>{o.dates}</span>
                <strong>{o.pay}</strong>
              </span>
              <span className="sz-card__perks">
                {o.perks.map((p) => (
                  <span key={p}>{p}</span>
                ))}
                {applied.has(o.id) && <span className="sz-applied">Candidature envoyée ✓</span>}
              </span>
            </button>
          </li>
        ))}
        {list.length === 0 && <li className="sz-empty">Aucune offre ne correspond.</li>}
      </ul>
    </>
  );
}

function OfferDetail({ offer, onBack, applied, onApply }) {
  const done = applied.has(offer.id);
  return (
    <div className="sz-detail">
      <button type="button" className="sz-back" onClick={onBack}>
        ← Offres
      </button>
      <div className={`sz-banner sz-zone--${offer.zone.toLowerCase()}`}>
        <span>{offer.zone}</span>
      </div>
      <h4 className="sz-h">{offer.title}</h4>
      <p className="sz-card__meta">{offer.employer} · {offer.place}</p>
      <dl className="sz-facts">
        <div>
          <dt>Dates</dt>
          <dd>{offer.dates}</dd>
        </div>
        <div>
          <dt>Rémunération</dt>
          <dd>{offer.pay}</dd>
        </div>
        <div>
          <dt>Avantages</dt>
          <dd>{offer.perks.join(", ")}</dd>
        </div>
      </dl>
      <p className="sz-text">{offer.text}</p>
      <button type="button" className={`sz-cta ${done ? "is-done" : ""}`} onClick={() => onApply(offer.id)} disabled={done}>
        {done ? "Candidature envoyée ✓" : "Postuler en 1 clic"}
      </button>
      <p className="sz-note">Ton profil et tes disponibilités sont envoyés à l'employeur.</p>
    </div>
  );
}

function Applications({ applied, onOpen }) {
  const items = [
    { id: 3, status: "Vue par l'employeur", tone: "seen" },
    ...[...applied].filter((id) => id !== 3).map((id) => ({ id, status: "Envoyée", tone: "sent" })),
  ];
  return (
    <>
      <h4 className="sz-h sz-pad">Mes candidatures</h4>
      <ul className="sz-list">
        {items.map(({ id, status, tone }) => {
          const o = OFFERS.find((x) => x.id === id);
          return (
            <li key={id}>
              <button type="button" className="sz-card" onClick={() => onOpen(id)}>
                <span className="sz-card__title">{o.title}</span>
                <span className="sz-card__meta">{o.employer} · {o.dates}</span>
                <span className={`sz-badge sz-badge--${tone}`}>{status}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="sz-note sz-pad">Astuce : postule à une offre, elle apparaît ici.</p>
    </>
  );
}

function Profile() {
  const [housing, setHousing] = useState(true);
  return (
    <div className="sz-pad">
      <div className="sz-profile">
        <span className="sz-avatar" aria-hidden="true">AM</span>
        <div>
          <h4 className="sz-h">Alex Martin</h4>
          <p className="sz-card__meta">20 ans · Étudiant·e</p>
        </div>
      </div>
      <div className="sz-progress" aria-label="Profil complété à 80 %">
        <span style={{ width: "80%" }} />
      </div>
      <p className="sz-note">Profil complété à 80 %</p>

      <h5 className="sz-label">Disponibilités</h5>
      <div className="sz-chips sz-chips--static">
        <span className="sz-chip" aria-pressed="true">Été 2027</span>
        <span className="sz-chip" aria-pressed="true">Hiver 2027-28</span>
      </div>

      <h5 className="sz-label">Compétences</h5>
      <div className="sz-chips sz-chips--static">
        {["Vente", "Accueil client", "Anglais", "Permis B"].map((s) => (
          <span key={s} className="sz-chip">{s}</span>
        ))}
      </div>

      <label className="sz-switch">
        <span>Je cherche un logement</span>
        <input type="checkbox" checked={housing} onChange={(e) => setHousing(e.target.checked)} />
        <i aria-hidden="true" />
      </label>
    </div>
  );
}

export default function SaisoniaPrototype() {
  const [tab, setTab] = useState("offres");
  const [openId, setOpenId] = useState(null);
  const [applied, setApplied] = useState(() => new Set([3]));

  const open = (id) => {
    setOpenId(id);
    setTab("offres");
  };
  const apply = (id) => setApplied((prev) => new Set(prev).add(id));
  const offer = OFFERS.find((o) => o.id === openId);

  const tabs = [
    { id: "offres", label: "Offres", icon: "⌂" },
    { id: "candidatures", label: "Candidatures", icon: "✉" },
    { id: "profil", label: "Profil", icon: "◯" },
  ];

  return (
    <div className="sz-phone" role="region" aria-label="Prototype de l'application Saisonia">
      <div className="sz-screen">
        <StatusBar />
        <header className="sz-top">
          <img src={asset("images/projets/saisonia-logo.png")} alt="" className="sz-logo" />
          <span className="sz-brand">Saisonia</span>
        </header>

        <div className="sz-body">
          {tab === "offres" && !offer && <OfferList onOpen={open} applied={applied} />}
          {tab === "offres" && offer && (
            <OfferDetail offer={offer} onBack={() => setOpenId(null)} applied={applied} onApply={apply} />
          )}
          {tab === "candidatures" && <Applications applied={applied} onOpen={open} />}
          {tab === "profil" && <Profile />}
        </div>

        <nav className="sz-tabs" aria-label="Navigation de l'application">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              className="sz-tab"
              aria-current={tab === t.id ? "page" : undefined}
              onClick={() => {
                setTab(t.id);
                setOpenId(null);
              }}
            >
              <span aria-hidden="true">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
