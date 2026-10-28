import { useEffect, useMemo, useRef, useState } from "react";
import { CONTRACTS, DOMAINS, LEVELS, SEASONS, SKILLS, fit, toggle } from "../data.js";
import { Chip, EmptyState, Icon, OfferCard, Sheet } from "../components/ui.jsx";

export const EMPTY_FILTERS = { contracts: [], domain: "", level: "", season: "", skills: [], flexible: false, distance: 200, forMe: false };
const SORTS = [
  { id: "relevance", label: "Pertinence" },
  { id: "distance", label: "Distance" },
  { id: "recent", label: "Nouveautés" },
];

function countActive(f) {
  return f.contracts.length + f.skills.length + [f.domain, f.level, f.season, f.flexible, f.forMe, f.distance < 200].filter(Boolean).length;
}

function FilterSheet({ filters, setFilters, resultCount, onClose }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }));
  return (
    <Sheet
      title="Filtres"
      tall
      onClose={onClose}
      footer={
        <>
          <button type="button" className="link" onClick={() => setFilters(EMPTY_FILTERS)}>Tout effacer</button>
          <button type="button" className="btn btn--primary" onClick={onClose}>
            Afficher {resultCount} offre{resultCount > 1 ? "s" : ""}
          </button>
        </>
      }
    >
      <label className="toggle-row glass">
        <span><strong>Pour moi</strong><small>Selon mon âge, mon niveau, ce que je cherche et ma zone</small></span>
        <input type="checkbox" role="switch" checked={filters.forMe} onChange={(e) => set({ forMe: e.target.checked })} />
        <i aria-hidden="true" />
      </label>

      <fieldset className="group">
        <legend>Type de contrat</legend>
        <div className="chips">
          {CONTRACTS.map((c) => (
            <Chip key={c.id} active={filters.contracts.includes(c.id)} onClick={() => set({ contracts: toggle(filters.contracts, c.id) })}>
              {c.icon} {c.id}
            </Chip>
          ))}
        </div>
      </fieldset>

      <div className="grid-2">
        <label className="field glass">
          <span>Domaine</span>
          <select value={filters.domain} onChange={(e) => set({ domain: e.target.value })}>
            <option value="">Tous</option>
            {DOMAINS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </label>
        <label className="field glass">
          <span>Niveau d'études</span>
          <select value={filters.level} onChange={(e) => set({ level: e.target.value })}>
            <option value="">Tous</option>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </label>
      </div>

      <fieldset className="group">
        <legend>Période</legend>
        <div className="chips">
          {SEASONS.map((s) => (
            <Chip key={s} active={filters.season === s} onClick={() => set({ season: filters.season === s ? "" : s })}>{s}</Chip>
          ))}
        </div>
      </fieldset>

      <fieldset className="group">
        <legend>Compétences</legend>
        <div className="chips">
          {SKILLS.map((s) => (
            <Chip key={s} small active={filters.skills.includes(s)} onClick={() => set({ skills: toggle(filters.skills, s) })}>{s}</Chip>
          ))}
        </div>
      </fieldset>

      <label className="toggle-row glass">
        <span><strong>Horaires flexibles</strong><small>Soirs, week-ends, temps partiel</small></span>
        <input type="checkbox" role="switch" checked={filters.flexible} onChange={(e) => set({ flexible: e.target.checked })} />
        <i aria-hidden="true" />
      </label>

      <label className="field glass">
        <span>Distance maximale : <strong>{filters.distance >= 200 ? "toute l'Auvergne" : `${filters.distance} km`}</strong></span>
        <input type="range" min="5" max="200" step="5" value={filters.distance} onChange={(e) => set({ distance: Number(e.target.value) })} />
      </label>
    </Sheet>
  );
}

export default function Explore({ state, offers, go, onSave, preset, focus }) {
  const { profile, saved, apps } = state;
  const applied = new Set(apps.map((a) => a.id));
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, ...preset });
  const [sort, setSort] = useState("relevance");
  const [sheet, setSheet] = useState(false);
  const input = useRef(null);

  useEffect(() => {
    setFilters({ ...EMPTY_FILTERS, ...preset });
  }, [preset]);
  useEffect(() => {
    if (focus) input.current?.focus();
  }, [focus]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = offers
      .map((o) => ({ ...o, f: fit(o, profile) }))
      .filter((o) => !q || `${o.title} ${o.company} ${o.city} ${o.domain} ${o.contract}`.toLowerCase().includes(q))
      .filter((o) => !filters.contracts.length || filters.contracts.includes(o.contract))
      .filter((o) => !filters.domain || o.domain === filters.domain)
      .filter((o) => !filters.level || o.levels.includes(filters.level))
      .filter((o) => !filters.season || o.season === filters.season)
      .filter((o) => !filters.skills.length || o.skills.some((s) => filters.skills.includes(s)))
      .filter((o) => !filters.flexible || o.flexible)
      .filter((o) => o.km <= filters.distance)
      .filter((o) => !filters.forMe || o.f.match);
    const by = {
      relevance: (a, b) => Number(b.featured) - Number(a.featured) || b.f.score - a.f.score || a.km - b.km,
      distance: (a, b) => a.km - b.km,
      recent: (a, b) => Number(b.isNew) - Number(a.isNew) || a.km - b.km,
    };
    return list.sort(by[sort]);
  }, [offers, profile, query, filters, sort]);

  const active = countActive(filters);
  // Pastilles des filtres actifs, retirables d'un geste.
  const pills = [
    filters.forMe && { label: "Pour moi", clear: { forMe: false } },
    ...filters.contracts.map((c) => ({ label: c, clear: { contracts: filters.contracts.filter((x) => x !== c) } })),
    filters.domain && { label: filters.domain, clear: { domain: "" } },
    filters.level && { label: filters.level, clear: { level: "" } },
    filters.season && { label: filters.season, clear: { season: "" } },
    ...filters.skills.map((s) => ({ label: s, clear: { skills: filters.skills.filter((x) => x !== s) } })),
    filters.flexible && { label: "Horaires flexibles", clear: { flexible: false } },
    filters.distance < 200 && { label: `≤ ${filters.distance} km`, clear: { distance: 200 } },
  ].filter(Boolean);

  return (
    <div className="screen">
      <header className="large-title"><h1>Rechercher</h1></header>

      <div className="sticky-search">
        <label className="searchbar glass">
          <Icon name="search" size={18} />
          <input ref={input} type="search" placeholder="Métier, entreprise, ville…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Rechercher une offre" />
        </label>
        <button type="button" className="icon-btn icon-btn--glass icon-btn--badge" onClick={() => setSheet(true)} aria-label={`Filtres${active ? `, ${active} actifs` : ""}`}>
          <Icon name="sliders" size={20} />
          {active > 0 && <span className="dot dot--blue">{active}</span>}
        </button>
      </div>

      <div className="chips chips--scroll" aria-label="Filtres rapides">
        <Chip active={filters.forMe} onClick={() => setFilters((f) => ({ ...f, forMe: !f.forMe }))}>✦ Pour moi</Chip>
        {CONTRACTS.map((c) => (
          <Chip key={c.id} active={filters.contracts.includes(c.id)} onClick={() => setFilters((f) => ({ ...f, contracts: toggle(f.contracts, c.id) }))}>{c.id}</Chip>
        ))}
      </div>

      {pills.length > 1 && (
        <div className="pills" aria-label="Filtres actifs">
          {pills.map((p) => (
            <button key={p.label} type="button" className="pill-x" onClick={() => setFilters((f) => ({ ...f, ...p.clear }))} aria-label={`Retirer le filtre ${p.label}`}>
              {p.label} <Icon name="close" size={12} strokeWidth={2.4} />
            </button>
          ))}
        </div>
      )}

      <div className="results-bar">
        <p aria-live="polite"><strong>{results.length}</strong> offre{results.length > 1 ? "s" : ""}</p>
        <label className="sort">
          <span className="sr-only">Trier par</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
      </div>

      <div className="stack">
        {results.map((o) => (
          <OfferCard key={o.id} offer={o} onOpen={(id) => go({ screen: "offer", id })} saved={saved.includes(o.id)} onSave={onSave} applied={applied.has(o.id)} />
        ))}
      </div>
      {results.length === 0 && (
        <EmptyState
          title="Aucune offre ne correspond"
          text="Essaie d'élargir la distance ou de retirer un filtre."
          action={<button type="button" className="btn btn--glass" onClick={() => { setFilters(EMPTY_FILTERS); setQuery(""); }}>Réinitialiser la recherche</button>}
        />
      )}

      {sheet && <FilterSheet filters={filters} setFilters={setFilters} resultCount={results.length} onClose={() => setSheet(false)} />}
    </div>
  );
}
