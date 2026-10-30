import { useEffect, useLayoutEffect, useRef } from "react";
import { useHashRoute } from "./lib/useHashRoute.js";
import { profile } from "./data/profile.js";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import About from "./sections/About.jsx";
import Experience from "./sections/Experience.jsx";
import Projects from "./sections/Projects.jsx";
import Moodboard from "./sections/Moodboard.jsx";
import Skills from "./sections/Skills.jsx";
import Documents from "./sections/Documents.jsx";
import Contact from "./sections/Contact.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";

const homeTitle = `${profile.name} — ${profile.title}`;

// Le navigateur ne doit pas reprendre la position de la dernière visite.
if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
const cleanUrl = () => window.history.replaceState(null, "", window.location.pathname + window.location.search);

function Home() {
  useEffect(() => {
    document.title = homeTitle;
  }, []);
  return (
    <main id="contenu" tabIndex={-1}>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Moodboard />
      <Skills />
      <Documents />
      <Contact />
    </main>
  );
}

export default function App() {
  const route = useHashRoute();
  const previous = useRef(null);
  const firstLoad = useRef(true);

  // Gère le défilement lors d'un changement de page.
  useLayoutEffect(() => {
    const changedPage = previous.current !== route.name;
    previous.current = route.name;

    if (route.name === "project" || route.name === "prototype") {
      firstLoad.current = false;
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    // À l'ouverture du site, on commence toujours en haut, même si le lien partagé
    // contient une section (#contact…) ou si le navigateur veut reprendre l'ancienne position.
    if (firstLoad.current) {
      firstLoad.current = false;
      window.scrollTo({ top: 0, behavior: "instant" });
      if (route.anchor) cleanUrl();
      return;
    }
    const target = route.anchor && route.anchor !== "top" ? document.getElementById(route.anchor) : null;
    // Saut immédiat quand on arrive d'une autre page (pas d'animation sur toute la hauteur).
    if (target && changedPage) target.scrollIntoView({ behavior: "instant" });
    else if (!target && changedPage) window.scrollTo({ top: 0, behavior: "instant" });
    // L'adresse reste propre (sans #section) : un lien copié ouvre le haut de la page.
    if (route.anchor) cleanUrl();
  }, [route]);

  // Ancienne adresse du prototype : redirige vers son site.
  if (route.name === "prototype") {
    window.location.replace(`./${route.slug}/`);
    return null;
  }

  return (
    <div id="top">
      <a className="skip-link" href="#contenu" onClick={(e) => {
        e.preventDefault();
        document.getElementById("contenu")?.focus();
      }}>
        Aller au contenu
      </a>
      <Header />
      {route.name === "project" ? <ProjectPage key={route.slug} slug={route.slug} /> : <Home />}
      <Footer />
    </div>
  );
}
