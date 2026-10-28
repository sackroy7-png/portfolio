import { AVAILABILITY, CONTRACTS, HOME_CITIES, LEVELS, SKILLS, toggle } from "../data.js";
import { Chip, Icon } from "../components/ui.jsx";

// Profil façon « Réglages » : groupes de champs, modifiés en direct.
export default function Profile({ state, dispatch, toast, portfolioUrl }) {
  const p = state.profile;
  const set = (patch) => dispatch({ type: "profile", patch });
  const checks = [p.firstName, p.formation, p.skills.length, p.availability.length, p.wanted.length, p.cv];
  const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  return (
    <div className="screen">
      <header className="large-title"><h1>Profil</h1></header>

      <section className="profile-card glass">
        <div className="ring" style={{ "--pct": pct }} role="img" aria-label={`Profil complété à ${pct} %`}>
          <span>{(p.firstName || "?").charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h2>{p.firstName || "Sans prénom"}</h2>
          <p className="muted">{p.age} ans · {p.level}</p>
          <p className="small">{pct < 100 ? `Profil complété à ${pct} % — ajoute ton CV pour être plus visible.` : "Profil complet ✓"}</p>
        </div>
      </section>

      <p className="group-title">Informations</p>
      <div className="inset">
        <label className="row"><span>Prénom</span><input value={p.firstName} onChange={(e) => set({ firstName: e.target.value })} /></label>
        <label className="row"><span>Âge</span><input type="number" min="14" max="30" value={p.age} onChange={(e) => set({ age: Number(e.target.value) || 0 })} /></label>
        <label className="row"><span>Niveau</span>
          <select value={p.level} onChange={(e) => set({ level: e.target.value })}>{LEVELS.map((l) => <option key={l}>{l}</option>)}</select>
        </label>
        <label className="row"><span>Formation</span><input value={p.formation} placeholder="ex. BTS MCO" onChange={(e) => set({ formation: e.target.value })} /></label>
      </div>

      <p className="group-title">Je cherche</p>
      <div className="inset inset--pad">
        <div className="chips">
          {CONTRACTS.map((c) => <Chip key={c.id} small active={p.wanted.includes(c.id)} onClick={() => set({ wanted: toggle(p.wanted, c.id) })}>{c.icon} {c.id}</Chip>)}
        </div>
      </div>

      <p className="group-title">Où</p>
      <div className="inset">
        <label className="row"><span>Ville</span>
          <select value={p.city} onChange={(e) => set({ city: e.target.value })}>{HOME_CITIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label className="row row--stack"><span>Rayon : {p.radius} km</span>
          <input type="range" min="5" max="150" step="5" value={p.radius} onChange={(e) => set({ radius: Number(e.target.value) })} />
        </label>
      </div>

      <p className="group-title">Disponibilités</p>
      <div className="inset inset--pad">
        <div className="chips">
          {AVAILABILITY.map((a) => <Chip key={a} small active={p.availability.includes(a)} onClick={() => set({ availability: toggle(p.availability, a) })}>{a}</Chip>)}
        </div>
      </div>

      <p className="group-title">Compétences</p>
      <div className="inset inset--pad">
        <div className="chips">
          {SKILLS.map((s) => <Chip key={s} small active={p.skills.includes(s)} onClick={() => set({ skills: toggle(p.skills, s) })}>{s}</Chip>)}
        </div>
      </div>

      <p className="group-title">CV</p>
      <div className="inset">
        <label className="row row--upload">
          <span><Icon name="doc" size={18} /> {p.cv || "Ajouter mon CV"}</span>
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => { const name = e.target.files?.[0]?.name; if (name) { set({ cv: name }); toast("CV ajouté"); } }} />
          <Icon name="chevron" size={16} />
        </label>
        {p.cv && <button type="button" className="row row--danger" onClick={() => set({ cv: "" })}>Retirer le CV</button>}
      </div>
      <p className="fine">Démo : le fichier n'est ni envoyé ni enregistré, seul son nom est gardé.</p>

      <p className="group-title">Prototype</p>
      <div className="inset">
        <button type="button" className="row" onClick={() => dispatch({ type: "replayOnboarding" })}><span>Revoir l'introduction</span><Icon name="chevron" size={16} /></button>
        <button type="button" className="row row--danger" onClick={() => { dispatch({ type: "reset" }); toast("Démo réinitialisée"); }}>Réinitialiser la démo</button>
        {portfolioUrl && <a className="row" href={portfolioUrl} target="_top"><span>Voir le portfolio de Sacha Roy</span><Icon name="chevron" size={16} /></a>}
      </div>
      <p className="fine">Saisonia · prototype réalisé pour un portfolio. Offres, entreprises et profils sont fictifs.</p>
    </div>
  );
}
