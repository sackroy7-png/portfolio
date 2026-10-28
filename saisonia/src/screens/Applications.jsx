import { useState } from "react";
import { STATUS } from "../data.js";
import { Avatar, EmptyState, Icon, OfferCard, Segmented, StatusPill, Steps } from "../components/ui.jsx";

const DONE = ["acceptee", "refusee"];

export function Applications({ state, offersById, go, onSave }) {
  const { apps, saved } = state;
  const [tab, setTab] = useState("ongoing");
  const ongoing = apps.filter((a) => !DONE.includes(a.status));
  const done = apps.filter((a) => DONE.includes(a.status));
  const list = tab === "ongoing" ? ongoing : done;

  return (
    <div className="screen">
      <header className="large-title"><h1>Candidatures</h1></header>
      <Segmented
        label="Filtrer les candidatures"
        value={tab}
        onChange={setTab}
        options={[
          { id: "ongoing", label: "En cours", count: ongoing.length },
          { id: "done", label: "Terminées", count: done.length },
          { id: "saved", label: "Favoris", count: saved.length },
        ]}
      />

      {tab !== "saved" && (
        <div className="stack">
          {list.map((a) => {
            const o = offersById[a.id];
            if (!o) return null;
            return (
              <button key={a.id} type="button" className="app-card" onClick={() => go({ screen: "application", id: a.id })}>
                <span className="app-card__head">
                  <Avatar name={o.company} size={40} />
                  <span>
                    <strong>{o.title}</strong>
                    <small>{o.company} · {o.city}</small>
                  </span>
                  <StatusPill status={a.status} />
                </span>
                <Steps status={a.status} />
                {a.status === "entretien" && a.interview && (
                  <span className="app-card__note"><Icon name="calendar" size={16} /> {a.interview.when}</span>
                )}
              </button>
            );
          })}
          {list.length === 0 && (
            <EmptyState icon="briefcase" title={tab === "ongoing" ? "Aucune candidature en cours" : "Rien de terminé pour l'instant"}
              text="Trouve une offre qui te plaît et postule en quelques secondes."
              action={<button type="button" className="btn btn--primary" onClick={() => go({ tab: "explore" })}>Explorer les offres</button>} />
          )}
        </div>
      )}

      {tab === "saved" && (
        <div className="stack">
          {saved.map((id) => offersById[id] && (
            <OfferCard key={id} offer={offersById[id]} onOpen={(oid) => go({ screen: "offer", id: oid })} saved onSave={onSave} applied={apps.some((a) => a.id === id)} />
          ))}
          {saved.length === 0 && <EmptyState icon="heart" title="Aucun favori" text="Touche le cœur d'une offre pour la retrouver ici." />}
        </div>
      )}
    </div>
  );
}

export function ApplicationDetail({ app, offer, dispatch, go, back, toast }) {
  const timeline = app.history;
  const canAdvance = ["envoyee", "vue", "entretien"].includes(app.status);
  return (
    <div className="screen screen--pushed">
      <header className="nav-bar glass-strong">
        <button type="button" className="nav-bar__back" onClick={back}><Icon name="back" size={20} /> Candidatures</button>
      </header>

      <div className="app-detail__head">
        <Avatar name={offer.company} size={56} />
        <h1 className="detail-title">{offer.title}</h1>
        <p className="muted">{offer.company} · {offer.city}</p>
        <StatusPill status={app.status} />
      </div>

      {app.status === "entretien" && app.interview && (
        <section className="interview glass">
          <p className="label">Entretien</p>
          <p className="interview__when"><Icon name="calendar" size={18} /> {app.interview.when}</p>
          <p className="muted"><Icon name="pin" size={16} /> {app.interview.where}</p>
          <button type="button" className="btn btn--primary btn--block" onClick={() => toast("Ajouté au calendrier")}>Ajouter au calendrier</button>
        </section>
      )}
      {app.status === "acceptee" && (
        <section className="banner banner--ok"><Icon name="check" size={20} /> Félicitations, l'entreprise a retenu ta candidature !</section>
      )}
      {app.status === "refusee" && (
        <section className="banner">L'entreprise n'a pas retenu ta candidature cette fois. D'autres offres t'attendent.</section>
      )}

      <section className="detail-section">
        <h2>Suivi</h2>
        <ol className="timeline">
          {timeline.map(([status, date]) => (
            <li key={status}>
              <strong>{STATUS[status].label}</strong>
              <span>{date}</span>
            </li>
          ))}
        </ol>
      </section>

      {app.message && (
        <section className="detail-section">
          <h2>Ton message</h2>
          <p className="quote glass">« {app.message} »</p>
        </section>
      )}

      <div className="stack stack--pad">
        <button type="button" className="btn btn--glass btn--block" onClick={() => go({ screen: "offer", id: offer.id })}>Revoir l'offre</button>
        {canAdvance && (
          <button type="button" className="btn btn--ghost btn--block" onClick={() => { dispatch({ type: "advance", id: app.id }); toast("Nouvelle réponse de l'entreprise"); }}>
            Simuler la réponse de l'entreprise (démo)
          </button>
        )}
      </div>
    </div>
  );
}

export function Notifications({ items, dispatch, go, back }) {
  return (
    <div className="screen screen--pushed">
      <header className="nav-bar glass-strong">
        <button type="button" className="nav-bar__back" onClick={back}><Icon name="back" size={20} /> Accueil</button>
        {items.some((n) => !n.read) && (
          <button type="button" className="link" onClick={() => dispatch({ type: "readNotif", ids: items.map((n) => n.key) })}>Tout lire</button>
        )}
      </header>
      <header className="large-title"><h1>Notifications</h1></header>
      <ul className="notifs">
        {items.map((n) => (
          <li key={n.key}>
            <button type="button" className={`notif glass ${n.read ? "" : "is-unread"}`} onClick={() => { dispatch({ type: "readNotif", ids: [n.key] }); go(n.target); }}>
              <span className="notif__icon" aria-hidden="true">{n.icon}</span>
              <span><strong>{n.title}</strong><small>{n.text}</small></span>
              {!n.read && <span className="notif__dot" aria-label="Non lue" />}
            </button>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="muted center">Aucune notification.</p>}
    </div>
  );
}
