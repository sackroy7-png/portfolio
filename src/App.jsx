import { useEffect, useLayoutEffect, useRef } from "react";
import { useHashRoute } from "./lib/useHashRoute.js";
import { profile } from "./data/profile.js";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import About from "./sections/About.jsx";
import Projects from "./sections/Projects.jsx";
import Moodboard from "./sections/Moodboard.jsx";
import Skills from "./sections/Skills.jsx";
import Documents from "./sections/Documents.jsx";
import Contact from "./sections/Contact.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";

const homeTitle = `${profile.name} — ${profile.title}`;

function Home() {
  useEffect(() => {
    document.title = homeTitle;
  }, []);
  return (
    <main id="contenu" tabIndex={-1}>
      <Hero />
      <About />
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
  const previous = useRef(route.name);

  // Gère le défilement lors d'un changement de page.
  useLayoutEffect(() => {
    const changedPage = previous.current !== route.name;
    previous.current = route.name;

    if (route.name === "project") {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    const target = route.anchor && route.anchor !== "top" ? document.getElementById(route.anchor) : null;
    // Saut immédiat quand on arrive d'une autre page (pas d'animation sur toute la hauteur).
    if (target && changedPage) target.scrollIntoView({ behavior: "instant" });
    else if (!target && changedPage) window.scrollTo({ top: 0, behavior: "instant" });
  }, [route]);

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
