import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import OFFERS from "../../content/saisonia-offres.json";
import { asset } from "../../lib/asset.js";
import "../../styles/saisonia.css";

// Prototype cliquable de Saisonia : parcours « jeune », données 100 % fictives.
// Le profil et les candidatures sont gardés dans le navigateur du visiteur (localStorage).

const CITIES = {
  "Clermont-Ferrand": [45.7772, 3.087],
  Riom: [45.8936, 3.1126],
  Issoire: [45.5443, 3.249],
  Vichy: [46.1278, 3.4253],
  Moulins: [46.5646, 3.3326],
  Montluçon: [46.3404, 2.6035],
  Aurillac: [44.9264, 2.4397],
  "Le Lioran": [45.0899, 2.7517],
  "Le Puy-en-Velay": [45.0434, 3.8858],
};
const HOME_CITIES = ["Clermont-Ferrand", "Vichy", "Moulins", "Montluçon", "Aurillac", "Le Puy-en-Velay"];
const CONTRACTS = ["Stage", "Alternance", "Job d'été", "Job étudiant", "Saisonnier", "Premier emploi"];
const LEVELS = ["3e", "Seconde", "Première / Terminale", "Bac +1 / +2", "Bac +3 et plus"];
const SEASONS = ["Hiver", "Printemps", "Été", "Automne", "Toute l'année"];
const DOMAINS = [...new Set(OFFERS.map((o) => o.domain))].sort((a, b) => a.localeCompare(b, "fr"));
const ALL_SKILLS = [...new Set(OFFERS.flatMap((o) => o.skills))].sort((a, b) => a.localeCompare(b, "fr"));
const AVAILABILITY = ["Semaine", "Soirs", "Week-ends", "Vacances scolaires", "Été"];
const STATUS = { envoyee: "Envoyée", vue: "Vue", entretien: "Entretien", acceptee: "Acceptée", refusee: "Refusée" };

const DEFAULT_PROFILE = {
  firstName: "Alex",
  age: 17,
  level: "Première / Terminale",
  formation: "Terminale STMG",
  skills: ["Vente", "Accueil client", "Anglais"],
  availability: ["Week-ends", "Été"],
  city: "Clermont-Ferrand",
  radius: 40,
  wanted: ["Job d'été", "Job étudiant"],
  cv: "",
};
const DEFAULT_APPS = [
  { id: 8, status: "vue" },
  { id: 5, status: "entretien", note: "Jeudi à 14 h" },
  { id: 3, status: "acceptee" },
  { id: 10, status: "refusee" },
  { id: 6, status: "envoyee" },
];
const EMPTY_FILTERS = { contracts: [], domain: "", level: "", season: "", skills: [], flexible: false, distance: 200, forMe: false };
const STORE = "saisonia-demo-v1";

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORE)) || null;
  } catch {
    return null;
  }
}

function distanceKm(from, to) {
  const [a, b] = [CITIES[from], CITIES[to]];
  if (!a || !b) return 0;
  const rad = (d) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b[0] - a[0]) / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(rad(b[1] - a[1]) / 2) ** 2;
  return Math.round(12742 * Math.asin(Math.sqrt(h)));
}

const kmLabel = (km) => (km < 3 ? "sur place" : `${km} km`);

const toggle = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

// L'offre correspond-elle au profil (âge, niveau, type d'emploi, distance) ?
function matchesProfile(offer, profile) {
  return (
    profile.age >= offer.minAge &&
    offer.levels.includes(profile.level) &&
    (profile.wanted.length === 0 || profile.wanted.includes(offer.contract)) &&
    offer.km <= profile.radius
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button type="button" className="sz-chip" aria-pressed={!!active} onClick={onClick}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ Offres */

function OfferCard({ offer, applied, onOpen, compact }) {
  return (
    <button type="button" className={`sz-card ${compact ? "sz-card--compact" : ""}`} onClick={() => onOpen(offer.id)}>
      <span className="sz-card__top">
        <span className={`sz-contract sz-contract--${offer.contract.length % 5}`}>{offer.contract}</span>
        {offer.featured && <span className="sz-featured">★ Mise en avant</span>}
      </span>
      <span className="sz-card__title">{offer.title}</span>
      <span className="sz-card__meta">
        {offer.company} · {offer.city} · {kmLabel(offer.km)}
      </span>
      {!compact && (
        <span className="sz-card__row">
          <span>{offer.dates}</span>
          <strong>{offer.pay}</strong>
        </span>
      )}
      <span className="sz-card__perks">
        <span>Dès {offer.minAge} ans</span>
        {offer.flexible && <span>Horaires flexibles</span>}
        {applied && <span className="sz-applied">Postulé ✓</span>}
      </span>
    </button>
  );
}

function FilterSheet({ filters, setFilters, count, onClose }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }));
  const closeRef = useRef(null);
  useEffect(() => closeRef.current?.focus(), []);
  return (
    <div className="sz-sheet" role="dialog" aria-modal="true" aria-label="Filtres" onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <div className="sz-sheet__head">
        <h4 className="sz-h">Filtres</h4>
        <button ref={closeRef} type="button" className="sz-link" onClick={onClose}>
          Fermer
        </button>
      </div>
      <div className="sz-sheet__body">
        <label className="sz-switch">
          <span>
            <strong>Pour moi</strong>
            <small>Âge, niveau, type d'emploi et zone de mon profil</small>
          </span>
          <input type="checkbox" checked={filters.forMe} onChange={(e) => set({ forMe: e.target.checked })} />
          <i aria-hidden="true" />
        </label>

        <p className="sz-label">Type de contrat</p>
        <div className="sz-chips sz-chips--wrap">
          {CONTRACTS.map((c) => (
            <Chip key={c} active={filters.contracts.includes(c)} onClick={() => set({ contracts: toggle(filters.contracts, c) })}>
              {c}
            </Chip>
          ))}
        </div>

        <div className="sz-grid2">
          <label className="sz-field">
            <span className="sz-label">Domaine</span>
            <select value={filters.domain} onChange={(e) => set({ domain: e.target.value })}>
              <option value="">Tous</option>
              {DOMAINS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className="sz-field">
            <span className="sz-label">Niveau d'études</span>
            <select value={filters.level} onChange={(e) => set({ level: e.target.value })}>
              <option value="">Tous</option>
              {LEVELS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
        </div>

        <p className="sz-label">Période</p>
        <div className="sz-chips sz-chips--wrap">
          {SEASONS.map((s) => (
            <Chip key={s} active={filters.season === s} onClick={() => set({ season: filters.season === s ? "" : s })}>
              {s}
            </Chip>
          ))}
        </div>

        <p className="sz-label">Compétences</p>
        <div className="sz-chips sz-chips--wrap">
          {ALL_SKILLS.map((s) => (
            <Chip key={s} active={filters.skills.includes(s)} onClick={() => set({ skills: toggle(filters.skills, s) })}>
              {s}
            </Chip>
          ))}
        </div>

        <label className="sz-switch">
          <span>
            <strong>Horaires flexibles</strong>
            <small>Soirs, week-ends, temps partiel</small>
          </span>
          <input type="checkbox" checked={filters.flexible} onChange={(e) => set({ flexible: e.target.checked })} />
          <i aria-hidden="true" />
        </label>

        <label className="sz-field">
          <span className="sz-label">
            Distance maximale : <strong>{filters.distance >= 200 ? "toute l'Auvergne" : `${filters.distance} km`}</strong>
          </span>
          <input
            type="range"
            min="5"
            max="200"
            step="5"
            value={filters.distance}
            onChange={(e) => set({ distance: Number(e.target.value) })}
          />
        </label>
      </div>
      <div className="sz-sheet__foot">
        <button type="button" className="sz-link" onClick={() => setFilters(EMPTY_FILTERS)}>
          Réinitialiser
        </button>
        <button type="button" className="sz-cta" onClick={onClose}>
          Voir {count} offre{count > 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
}

function OfferList({ offers, profile, appliedIds, onOpen }) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sheet, setSheet] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return offers
      .filter((o) => !q || `${o.title} ${o.company} ${o.city} ${o.domain}`.toLowerCase().includes(q))
      .filter((o) => !filters.contracts.length || filters.contracts.includes(o.contract))
      .filter((o) => !filters.domain || o.domain === filters.domain)
      .filter((o) => !filters.level || o.levels.includes(filters.level))
      .filter((o) => !filters.season || o.season === filters.season)
      .filter((o) => !filters.skills.length || o.skills.some((s) => filters.skills.includes(s)))
      .filter((o) => !filters.flexible || o.flexible)
      .filter((o) => o.km <= filters.distance)
      .filter((o) => !filters.forMe || matchesProfile(o, profile))
      .sort((a, b) => Number(b.featured) - Number(a.featured) || a.km - b.km);
  }, [offers, query, filters, profile]);

  const activeCount =
    filters.contracts.length + filters.skills.length + [filters.domain, filters.level, filters.season, filters.flexible, filters.forMe, filters.distance < 200].filter(Boolean).length;
  const nearby = useMemo(() => [...offers].sort((a, b) => a.km - b.km).filter((o) => o.km <= 25).slice(0, 4), [offers]);
  const showNearby = !query && activeCount === 0 && nearby.length > 0;

  return (
    <>
      <div className="sz-hero">
        <p className="sz-hello">Bonjour {profile.firstName || "toi"} 👋</p>
        <h4 className="sz-h">Trouve ton job près de chez toi</h4>
        <div className="sz-searchrow">
          <label className="sz-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Métier, entreprise, ville…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Rechercher une offre"
            />
          </label>
          <button type="button" className="sz-filterbtn" onClick={() => setSheet(true)} aria-label={`Filtres${activeCount ? `, ${activeCount} actifs` : ""}`}>
            ⚙ Filtres{activeCount > 0 && <span className="sz-dot">{activeCount}</span>}
          </button>
        </div>
      </div>

      <div className="sz-chips" role="group" aria-label="Type de contrat">
        <Chip active={filters.forMe} onClick={() => setFilters((f) => ({ ...f, forMe: !f.forMe }))}>
          ✦ Pour moi
        </Chip>
        {CONTRACTS.map((c) => (
          <Chip key={c} active={filters.contracts.includes(c)} onClick={() => setFilters((f) => ({ ...f, contracts: toggle(f.contracts, c) }))}>
            {c}
          </Chip>
        ))}
      </div>

      {showNearby && (
        <section aria-labelledby="sz-near">
          <p id="sz-near" className="sz-section">📍 Près de toi · {profile.city}</p>
          <div className="sz-carousel">
            {nearby.map((o) => (
              <OfferCard key={o.id} offer={o} compact applied={appliedIds.has(o.id)} onOpen={onOpen} />
            ))}
          </div>
        </section>
      )}

      <p className="sz-section" aria-live="polite">
        {filtered.length} offre{filtered.length > 1 ? "s" : ""}
        {activeCount > 0 && (
          <button type="button" className="sz-link sz-link--small" onClick={() => setFilters(EMPTY_FILTERS)}>
            Effacer les filtres
          </button>
        )}
      </p>
      <ul className="sz-list">
        {filtered.map((o) => (
          <li key={o.id}>
            <OfferCard offer={o} applied={appliedIds.has(o.id)} onOpen={onOpen} />
          </li>
        ))}
        {filtered.length === 0 && <li className="sz-empty">Aucune offre ne correspond. Élargis la distance ou retire un filtre.</li>}
      </ul>

      {sheet && <FilterSheet filters={filters} setFilters={setFilters} count={filtered.length} onClose={() => setSheet(false)} />}
    </>
  );
}

/* --------------------------------------------------------- Fiche d'offre */

function OfferDetail({ offer, profile, application, onBack, onApply }) {
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const tooYoung = profile.age < offer.minAge;

  return (
    <div className="sz-detail">
      <button type="button" className="sz-link" onClick={onBack}>
        ← Retour
      </button>
      <div className={`sz-banner sz-contract--${offer.contract.length % 5}`}>
        <span>{offer.contract}</span>
        {offer.featured && <span className="sz-featured">★ Mise en avant</span>}
      </div>
      <h4 className="sz-h">{offer.title}</h4>
      <p className="sz-card__meta">
        {offer.company} · {offer.city} · {offer.km < 3 ? "sur place" : `à ${offer.km} km`} · publiée {offer.posted}
      </p>

      <p className={`sz-age ${tooYoung ? "is-blocked" : ""}`}>
        {tooYoung ? `⚠ Âge minimum : ${offer.minAge} ans. Tu pourras postuler plus tard.` : `✓ Âge minimum : ${offer.minAge} ans`}
      </p>

      <dl className="sz-facts">
        <div><dt>Dates</dt><dd>{offer.dates}</dd></div>
        <div><dt>Rémunération</dt><dd>{offer.pay}</dd></div>
        <div><dt>Horaires</dt><dd>{offer.hours}{offer.flexible ? " · flexibles" : ""}</dd></div>
        <div><dt>Niveau</dt><dd>{offer.levels.join(", ")}</dd></div>
        <div><dt>Domaine</dt><dd>{offer.domain}</dd></div>
      </dl>

      <p className="sz-label">Missions</p>
      <ul className="sz-missions">
        {offer.missions.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>

      <p className="sz-label">Compétences utiles</p>
      <div className="sz-chips sz-chips--wrap sz-chips--static">
        {offer.skills.map((s) => (
          <span key={s} className="sz-chip" aria-pressed={profile.skills.includes(s)}>
            {profile.skills.includes(s) ? "✓ " : ""}
            {s}
          </span>
        ))}
      </div>

      <div className="sz-company">
        <span className="sz-avatar sz-avatar--small" aria-hidden="true">{offer.company.charAt(0)}</span>
        <span>
          <strong>{offer.company}</strong>
          <small>{offer.companyAbout}</small>
        </span>
      </div>

      {application ? (
        <p className={`sz-badge sz-badge--${application.status} sz-badge--block`}>Candidature : {STATUS[application.status]}</p>
      ) : (
        <button type="button" className="sz-cta" disabled={tooYoung} onClick={() => setConfirm(true)}>
          Postuler
        </button>
      )}

      {confirm && (
        <div className="sz-sheet" role="dialog" aria-modal="true" aria-label="Confirmer la candidature" onKeyDown={(e) => e.key === "Escape" && setConfirm(false)}>
          <div className="sz-sheet__head">
            <h4 className="sz-h">Postuler chez {offer.company}</h4>
            <button type="button" className="sz-link" onClick={() => setConfirm(false)}>Annuler</button>
          </div>
          <div className="sz-sheet__body">
            <p className="sz-text">Ton profil, tes disponibilités {profile.cv ? "et ton CV " : ""}seront envoyés à l'entreprise.</p>
            {!profile.cv && <p className="sz-note">Astuce : ajoute ton CV dans l'onglet Profil.</p>}
            <label className="sz-field">
              <span className="sz-label">Message (facultatif)</span>
              <textarea rows="4" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Bonjour, je suis disponible dès…" />
            </label>
          </div>
          <div className="sz-sheet__foot">
            <button
              type="button"
              className="sz-cta"
              onClick={() => {
                onApply(offer.id);
                setConfirm(false);
              }}
            >
              Envoyer ma candidature
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- Candidatures */

function Applications({ apps, offersById, onOpen }) {
  const counts = Object.keys(STATUS).map((k) => [k, apps.filter((a) => a.status === k).length]);
  return (
    <div className="sz-pad">
      <h4 className="sz-h">Mes candidatures</h4>
      <div className="sz-stats">
        {counts.map(([k, n]) => (
          <span key={k} className={`sz-stat sz-badge--${k}`}>
            <strong>{n}</strong>
            {STATUS[k]}
          </span>
        ))}
      </div>
      <ul className="sz-list sz-list--flush">
        {apps.map((a) => {
          const o = offersById[a.id];
          if (!o) return null;
          return (
            <li key={a.id}>
              <button type="button" className="sz-card" onClick={() => onOpen(a.id)}>
                <span className="sz-card__title">{o.title}</span>
                <span className="sz-card__meta">{o.company} · {o.city}</span>
                <span className="sz-card__row">
                  <span className={`sz-badge sz-badge--${a.status}`}>{STATUS[a.status]}</span>
                  {a.note && <span className="sz-note">{a.note}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ---------------------------------------------------------------- Profil */

function Profile({ profile, setProfile, onReset }) {
  const set = (patch) => setProfile((p) => ({ ...p, ...patch }));
  const filled = [profile.firstName, profile.formation, profile.skills.length, profile.availability.length, profile.wanted.length, profile.cv].filter(Boolean).length;
  const pct = Math.round((filled / 6) * 100);

  return (
    <div className="sz-pad sz-form">
      <div className="sz-profile">
        <span className="sz-avatar" aria-hidden="true">{(profile.firstName || "?").charAt(0).toUpperCase()}</span>
        <div>
          <h4 className="sz-h">Mon profil</h4>
          <p className="sz-card__meta">Complété à {pct} %</p>
        </div>
      </div>
      <div className="sz-progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100" aria-label="Profil complété">
        <span style={{ width: `${pct}%` }} />
      </div>

      <div className="sz-grid2">
        <label className="sz-field">
          <span className="sz-label">Prénom</span>
          <input value={profile.firstName} onChange={(e) => set({ firstName: e.target.value })} />
        </label>
        <label className="sz-field">
          <span className="sz-label">Âge</span>
          <input type="number" min="14" max="30" value={profile.age} onChange={(e) => set({ age: Number(e.target.value) || 0 })} />
        </label>
      </div>
      <label className="sz-field">
        <span className="sz-label">Niveau d'études</span>
        <select value={profile.level} onChange={(e) => set({ level: e.target.value })}>
          {LEVELS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </label>
      <label className="sz-field">
        <span className="sz-label">Formation</span>
        <input value={profile.formation} onChange={(e) => set({ formation: e.target.value })} placeholder="ex. BTS MCO" />
      </label>

      <p className="sz-label">Type d'emploi recherché</p>
      <div className="sz-chips sz-chips--wrap">
        {CONTRACTS.map((c) => (
          <Chip key={c} active={profile.wanted.includes(c)} onClick={() => set({ wanted: toggle(profile.wanted, c) })}>{c}</Chip>
        ))}
      </div>

      <p className="sz-label">Disponibilités</p>
      <div className="sz-chips sz-chips--wrap">
        {AVAILABILITY.map((a) => (
          <Chip key={a} active={profile.availability.includes(a)} onClick={() => set({ availability: toggle(profile.availability, a) })}>{a}</Chip>
        ))}
      </div>

      <p className="sz-label">Compétences</p>
      <div className="sz-chips sz-chips--wrap">
        {ALL_SKILLS.map((s) => (
          <Chip key={s} active={profile.skills.includes(s)} onClick={() => set({ skills: toggle(profile.skills, s) })}>{s}</Chip>
        ))}
      </div>

      <div className="sz-grid2">
        <label className="sz-field">
          <span className="sz-label">Ma ville</span>
          <select value={profile.city} onChange={(e) => set({ city: e.target.value })}>
            {HOME_CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="sz-field">
          <span className="sz-label">Rayon : {profile.radius} km</span>
          <input type="range" min="5" max="150" step="5" value={profile.radius} onChange={(e) => set({ radius: Number(e.target.value) })} />
        </label>
      </div>

      <p className="sz-label">CV</p>
      <label className="sz-upload">
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => set({ cv: e.target.files?.[0]?.name || "" })} />
        <span>{profile.cv ? `📄 ${profile.cv}` : "＋ Ajouter mon CV"}</span>
      </label>
      <p className="sz-note">Démo : le fichier n'est ni envoyé ni enregistré, seul son nom est affiché.</p>

      <button type="button" className="sz-link sz-reset" onClick={onReset}>
        Réinitialiser la démo
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ Application */

export default function SaisoniaPrototype({ framed = true }) {
  const saved = useMemo(loadState, []);
  const [profile, setProfile] = useState(saved?.profile || DEFAULT_PROFILE);
  const [apps, setApps] = useState(saved?.apps || DEFAULT_APPS);
  const [tab, setTab] = useState("offres");
  const [openId, setOpenId] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [seenNotifs, setSeenNotifs] = useState(!!saved?.seenNotifs);
  const [toast, setToast] = useState("");
  const bodyRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify({ profile, apps, seenNotifs }));
    } catch {
      /* stockage indisponible : la démo fonctionne quand même */
    }
  }, [profile, apps, seenNotifs]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // Distances simulées depuis la ville du profil.
  const offers = useMemo(() => OFFERS.map((o) => ({ ...o, km: distanceKm(profile.city, o.city) })), [profile.city]);
  const offersById = useMemo(() => Object.fromEntries(offers.map((o) => [o.id, o])), [offers]);
  const appliedIds = useMemo(() => new Set(apps.map((a) => a.id)), [apps]);
  const notifs = useMemo(() => offers.filter((o) => o.isNew && !appliedIds.has(o.id) && matchesProfile(o, profile)), [offers, appliedIds, profile]);

  const goTo = useCallback((next) => {
    setTab(next);
    setOpenId(null);
    setNotifOpen(false);
    bodyRef.current?.scrollTo(0, 0);
  }, []);
  const open = useCallback((id) => {
    setTab("offres");
    setOpenId(id);
    setNotifOpen(false);
    bodyRef.current?.scrollTo(0, 0);
  }, []);
  const apply = (id) => {
    setApps((list) => [{ id, status: "envoyee" }, ...list]);
    setToast("Candidature envoyée ✓");
  };
  const reset = () => {
    setProfile(DEFAULT_PROFILE);
    setApps(DEFAULT_APPS);
    setSeenNotifs(false);
    setToast("Démo réinitialisée");
  };

  const offer = openId ? offersById[openId] : null;
  const tabs = [
    { id: "offres", label: "Offres", icon: "⌂" },
    { id: "candidatures", label: "Candidatures", icon: "✉", badge: apps.length },
    { id: "profil", label: "Profil", icon: "☺" },
  ];

  return (
    <div className={framed ? "sz-phone" : "sz-full"} role="region" aria-label="Prototype de l'application Saisonia">
      <div className="sz-screen">
        {framed && (
          <div className="sz-status" aria-hidden="true">
            <span>9:41</span>
            <span className="sz-status__icons"><i /> <i /> <b /></span>
          </div>
        )}
        <header className="sz-top">
          <img src={asset("images/projets/saisonia-logo.png")} alt="" className="sz-logo" />
          <span className="sz-brand">Saisonia</span>
          <label className="sz-city">
            <span className="sz-sr">Ma position</span>
            <span aria-hidden="true">📍</span>
            <select value={profile.city} onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))}>
              {HOME_CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="sz-bell"
            aria-label={`Notifications${!seenNotifs && notifs.length ? `, ${notifs.length} nouvelles` : ""}`}
            aria-expanded={notifOpen}
            onClick={() => {
              setNotifOpen((v) => !v);
              setSeenNotifs(true);
            }}
          >
            🔔{!seenNotifs && notifs.length > 0 && <span className="sz-dot">{notifs.length}</span>}
          </button>
        </header>

        {notifOpen && (
          <div className="sz-notifs" role="dialog" aria-label="Notifications">
            <p className="sz-label">Nouvelles offres pour toi</p>
            {notifs.length === 0 && <p className="sz-note">Rien de neuf pour l'instant.</p>}
            {notifs.map((o) => (
              <button key={o.id} type="button" className="sz-notif" onClick={() => open(o.id)}>
                <strong>{o.title}</strong>
                <span>{o.company} · {o.city} · {kmLabel(o.km)}</span>
              </button>
            ))}
          </div>
        )}

        <div className="sz-body" ref={bodyRef}>
          {tab === "offres" && !offer && <OfferList offers={offers} profile={profile} appliedIds={appliedIds} onOpen={open} />}
          {tab === "offres" && offer && (
            <OfferDetail
              key={offer.id}
              offer={offer}
              profile={profile}
              application={apps.find((a) => a.id === offer.id)}
              onBack={() => setOpenId(null)}
              onApply={apply}
            />
          )}
          {tab === "candidatures" && <Applications apps={apps} offersById={offersById} onOpen={open} />}
          {tab === "profil" && <Profile profile={profile} setProfile={setProfile} onReset={reset} />}
        </div>

        {toast && <p className="sz-toast" role="status">{toast}</p>}

        <nav className="sz-tabs" aria-label="Navigation de l'application">
          {tabs.map((t) => (
            <button key={t.id} type="button" className="sz-tab" aria-current={tab === t.id ? "page" : undefined} onClick={() => goTo(t.id)}>
              <span aria-hidden="true">{t.icon}</span>
              {t.label}
              {t.badge > 0 && <em className="sz-tab__badge">{t.badge}</em>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
