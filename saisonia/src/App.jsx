import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fit, withDistance } from "./data.js";
import { useStore } from "./store.js";
import { Icon, Toast } from "./components/ui.jsx";
import Onboarding from "./screens/Onboarding.jsx";
import Home from "./screens/Home.jsx";
import Explore from "./screens/Explore.jsx";
import OfferDetail from "./screens/OfferDetail.jsx";
import { Applications, ApplicationDetail, Notifications } from "./screens/Applications.jsx";
import Profile from "./screens/Profile.jsx";
import logo from "./assets/logo.png";

const TABS = [
  { id: "home", label: "Accueil", icon: "home" },
  { id: "explore", label: "Rechercher", icon: "search" },
  { id: "applications", label: "Candidatures", icon: "briefcase" },
  { id: "profile", label: "Profil", icon: "user" },
];
const EMBED = new URLSearchParams(window.location.search).has("embed");
const PORTFOLIO_URL = "../#/projets/saisonia";

function useNotifications(state, offers) {
  return useMemo(() => {
    const applied = new Set(state.apps.map((a) => a.id));
    const byId = Object.fromEntries(offers.map((o) => [o.id, o]));
    const items = [];
    state.apps.forEach((a) => {
      const o = byId[a.id];
      if (!o) return;
      if (a.status === "entretien") items.push({ key: `app-${a.id}-entretien`, icon: "📅", title: "Entretien confirmé", text: `${o.company} · ${a.interview?.when || ""}`, target: { screen: "application", id: a.id } });
      if (a.status === "acceptee") items.push({ key: `app-${a.id}-ok`, icon: "🎉", title: "Candidature acceptée", text: `${o.title} · ${o.company}`, target: { screen: "application", id: a.id } });
      if (a.status === "vue") items.push({ key: `app-${a.id}-vue`, icon: "👀", title: "Candidature vue", text: `${o.company} a consulté ton profil`, target: { screen: "application", id: a.id } });
    });
    offers
      .filter((o) => o.isNew && !applied.has(o.id) && fit(o, state.profile).match)
      .forEach((o) => items.unshift({ key: `offer-${o.id}`, icon: "✨", title: "Nouvelle offre pour toi", text: `${o.title} · ${o.company}`, target: { screen: "offer", id: o.id } }));
    return items.map((n) => ({ ...n, read: state.readNotifs.includes(n.key) }));
  }, [state, offers]);
}

export default function App() {
  const [state, dispatch] = useStore();
  const [tab, setTab] = useState("home");
  const [stack, setStack] = useState([]);
  const [explore, setExplore] = useState({ preset: {}, focus: false });
  const [toastText, setToastText] = useState("");
  const viewport = useRef(null);

  const offers = useMemo(() => withDistance(state.profile.city), [state.profile.city]);
  const offersById = useMemo(() => Object.fromEntries(offers.map((o) => [o.id, o])), [offers]);
  const notifs = useNotifications(state, offers);
  const unread = notifs.filter((n) => !n.read).length;

  // Le bouton « retour » du téléphone ou du navigateur referme l'écran ouvert.
  useEffect(() => {
    const onPop = (e) => setStack((s) => s.slice(0, e.state?.szDepth ?? 0));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!toastText) return;
    const t = setTimeout(() => setToastText(""), 2400);
    return () => clearTimeout(t);
  }, [toastText]);

  const toast = useCallback((text) => setToastText(text), []);

  const go = useCallback((target) => {
    if (target.tab) {
      setStack((s) => {
        if (s.length) window.history.go(-s.length);
        return [];
      });
      if (target.tab === "explore" && (target.preset || target.focus)) setExplore({ preset: target.preset || {}, focus: !!target.focus });
      setTab(target.tab);
      viewport.current?.scrollTo(0, 0);
      return;
    }
    setStack((s) => {
      const next = [...s, target];
      window.history.pushState({ szDepth: next.length }, "");
      return next;
    });
  }, []);
  const back = useCallback(() => window.history.back(), []);
  const onSave = useCallback(
    (id) => {
      const wasSaved = state.saved.includes(id);
      dispatch({ type: "save", id });
      toast(wasSaved ? "Retiré des favoris" : "Ajouté aux favoris");
    },
    [state.saved, dispatch, toast]
  );

  const switchTab = (id) => {
    if (id === tab && !stack.length) viewport.current?.scrollTo({ top: 0, behavior: "smooth" });
    go({ tab: id });
  };

  const top = stack[stack.length - 1];
  let pushed = null;
  if (top?.screen === "offer" && offersById[top.id]) {
    pushed = <OfferDetail key={`o${top.id}`} offer={offersById[top.id]} state={state} dispatch={dispatch} go={go} back={back} toast={toast} />;
  } else if (top?.screen === "application") {
    const app = state.apps.find((a) => a.id === top.id);
    if (app) pushed = <ApplicationDetail key={`a${top.id}`} app={app} offer={offersById[top.id]} dispatch={dispatch} go={go} back={back} toast={toast} />;
  } else if (top?.screen === "notifications") {
    pushed = <Notifications items={notifs} dispatch={dispatch} go={go} back={back} />;
  }

  const app = (
    <div className="app" id="sz-app">
      <div className="app__bg" aria-hidden="true" />
      {!state.onboarded ? (
        <Onboarding profile={state.profile} onDone={(profile) => dispatch({ type: "onboard", profile })} />
      ) : (
        <>
          <main className="viewport" ref={viewport} aria-hidden={!!pushed} inert={pushed ? "" : undefined}>
            {tab === "home" && <Home state={state} offers={offers} notifCount={unread} go={go} onSave={onSave} />}
            {tab === "explore" && <Explore state={state} offers={offers} go={go} onSave={onSave} preset={explore.preset} focus={explore.focus} />}
            {tab === "applications" && <Applications state={state} offersById={offersById} go={go} onSave={onSave} />}
            {tab === "profile" && <Profile state={state} dispatch={dispatch} toast={toast} portfolioUrl={PORTFOLIO_URL} />}
          </main>

          {pushed && <div className="pushed">{pushed}</div>}

          {!pushed && (
            <nav className="tabbar glass-strong" aria-label="Navigation principale">
              {TABS.map((t) => (
                <button key={t.id} type="button" className="tabbar__item" aria-current={tab === t.id ? "page" : undefined} onClick={() => switchTab(t.id)}>
                  <Icon name={t.icon} size={22} strokeWidth={tab === t.id ? 2.2 : 1.8} />
                  <span>{t.label}</span>
                  {t.id === "applications" && state.apps.some((a) => a.status === "entretien") && <i className="tabbar__dot" aria-label="Entretien à venir" />}
                </button>
              ))}
            </nav>
          )}
        </>
      )}
      <Toast text={toastText} />
    </div>
  );

  if (EMBED) return <div className="site site--embed">{app}</div>;

  return (
    <div className="site">
      <aside className="intro">
        <img src={logo} alt="" className="intro__logo" />
        <p className="intro__eyebrow">Prototype interactif</p>
        <h1>Saisonia</h1>
        <p className="intro__lead">L'application qui réunit les stages, alternances, jobs d'été et saisonniers proposés aux jeunes d'Auvergne par les entreprises locales.</p>
        <ol className="intro__try">
          <li>Personnalise ton profil au lancement</li>
          <li>Filtre les offres et ouvre une fiche</li>
          <li>Postule, puis suis ta candidature</li>
          <li>Simule la réponse de l'entreprise</li>
        </ol>
        <p className="intro__fine">Projet de création d'entreprise accompagné par PEPITE. Données fictives : aucune offre, entreprise ou personne réelle.</p>
        <a className="intro__link" href={PORTFOLIO_URL}>← Portfolio de Sacha Roy</a>
      </aside>
      <div className="device">{app}</div>
    </div>
  );
}
