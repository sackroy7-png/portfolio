import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CONTRACT_TONES, STEPS, STATUS, kmLabel } from "../data.js";

/* ------------------------------------------------------------------ Icônes */

const PATHS = {
  home: "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  search: "M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm10 3-5.2-5.2",
  briefcase: "M4 7h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Zm4 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18",
  user: "M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm-8 9a8 8 0 0 1 16 0",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0",
  back: "M15 5 8 12l7 7",
  heart: "M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.5 4.5 4.5 0 0 1 19.5 10C19.5 15.4 12 20 12 20Z",
  sliders: "M4 7h10M18 7h2M4 17h4M12 17h8M14 4v6M8 14v6",
  pin: "M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  check: "m5 12.5 4.5 4.5L19 7.5",
  close: "M6 6l12 12M18 6 6 18",
  chevron: "m9 5 7 7-7 7",
  calendar: "M4 6h16v14H4zM4 10h16M8 3v5M16 3v5",
  clock: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm0-13v4.5l3 2",
  euro: "M17 6.5A7 7 0 1 0 17 17.5M4 10.5h9M4 13.5h9",
  doc: "M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18",
  info: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm0-10v6m0-9.5v.5",
};

export function Icon({ name, size = 22, fill = false, strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={PATHS[name]} />
    </svg>
  );
}

/* ---------------------------------------------------------------- Éléments */

export function Chip({ active, onClick, children, small }) {
  return (
    <button type="button" className={`chip ${small ? "chip--sm" : ""}`} aria-pressed={!!active} onClick={onClick}>
      {children}
    </button>
  );
}

export function ContractTag({ contract }) {
  const [bg, fg] = CONTRACT_TONES[contract] || ["#eef1f6", "#334"];
  return (
    <span className="tag" style={{ background: bg, color: fg }}>
      {contract}
    </span>
  );
}

export function Avatar({ name, size = 44, tone = "#1d2433" }) {
  return (
    <span className="avatar" aria-hidden="true" style={{ width: size, height: size, background: tone, fontSize: size * 0.4 }}>
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

export function Segmented({ options, value, onChange, label }) {
  return (
    <div className="segmented glass" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" role="tab" aria-selected={value === o.id} onClick={() => onChange(o.id)}>
          {o.label}
          {o.count > 0 && <span className="segmented__count">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Steps({ status }) {
  const step = STATUS[status].step;
  const refused = status === "refusee";
  return (
    <ol className={`steps ${refused ? "steps--refused" : ""}`} aria-label={`Étape : ${STATUS[status].label}`}>
      {STEPS.map((s, i) => (
        <li key={s} className={i <= step ? "is-done" : ""}>
          <span>{i === 3 && step === 3 ? STATUS[status].label : s}</span>
        </li>
      ))}
    </ol>
  );
}

export function StatusPill({ status }) {
  return <span className={`pill pill--${status}`}>{STATUS[status].label}</span>;
}

/* ------------------------------------------------------------ Carte offre */

export function OfferCard({ offer, onOpen, saved, onSave, applied, variant = "row", reason }) {
  return (
    <article className={`offer offer--${variant}`}>
      <button type="button" className="offer__hit" onClick={() => onOpen(offer.id)} aria-label={`${offer.title}, ${offer.company}, ${offer.city}`} />
      <div className="offer__head">
        <Avatar name={offer.company} size={variant === "tile" ? 40 : 44} tone={(CONTRACT_TONES[offer.contract] || [])[1]} />
        <div className="offer__titles">
          <h3>{offer.title}</h3>
          <p>{offer.company}</p>
        </div>
        {onSave && (
          <button type="button" className={`icon-btn ${saved ? "is-on" : ""}`} onClick={() => onSave(offer.id)} aria-pressed={saved} aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}>
            <Icon name="heart" size={20} fill={saved} />
          </button>
        )}
      </div>
      <div className="offer__meta">
        <ContractTag contract={offer.contract} />
        <span><Icon name="pin" size={14} /> {offer.city} · {kmLabel(offer.km)}</span>
      </div>
      {variant === "row" && (
        <div className="offer__foot">
          <span>{offer.dates}</span>
          <strong>{offer.pay}</strong>
        </div>
      )}
      <div className="offer__badges">
        {offer.featured && <span className="badge badge--gold">Mise en avant</span>}
        {offer.isNew && <span className="badge badge--new">Nouveau</span>}
        {offer.flexible && <span className="badge">Horaires flexibles</span>}
        <span className="badge">Dès {offer.minAge} ans</span>
        {applied && <span className="badge badge--ok">Postulé</span>}
      </div>
      {reason && <p className="offer__reason"><Icon name="spark" size={14} /> {reason}</p>}
    </article>
  );
}

/* ------------------------------------------------------------- Panneaux */

// Panneau qui monte du bas de l'écran (style iOS), fermeture par Échap ou en touchant le fond.
export function Sheet({ title, onClose, children, footer, tall }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [onClose]);

  // Rendu au niveau de l'application, au-dessus des zones qui défilent.
  return createPortal(
    <div className="sheet-layer">
      <button type="button" className="sheet-scrim" aria-label="Fermer" onClick={onClose} tabIndex={-1} />
      <section className={`sheet glass-strong ${tall ? "sheet--tall" : ""}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}>
        <span className="sheet__grabber" aria-hidden="true" />
        <header className="sheet__head">
          <h2>{title}</h2>
          <button type="button" className="icon-btn icon-btn--glass" onClick={onClose} aria-label="Fermer">
            <Icon name="close" size={18} />
          </button>
        </header>
        <div className="sheet__body">{children}</div>
        {footer && <footer className="sheet__foot">{footer}</footer>}
      </section>
    </div>,
    document.getElementById("sz-app") || document.body
  );
}

export function Toast({ text }) {
  if (!text) return null;
  return (
    <p className="toast glass-strong" role="status">
      <Icon name="check" size={18} /> {text}
    </p>
  );
}

export function EmptyState({ icon = "search", title, text, action }) {
  return (
    <div className="empty">
      <span className="empty__icon"><Icon name={icon} size={28} /></span>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}
