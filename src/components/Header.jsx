import { useEffect, useState } from "react";
import { profile } from "../data/profile.js";

const links = [
  { href: "#apropos", label: "À propos" },
  { href: "#experience", label: "Expérience" },
  { href: "#projets", label: "Projets" },
  { href: "#moodboard", label: "Moodboard" },
  { href: "#competences", label: "Compétences" },
  { href: "#documents", label: "CV" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", open);
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
      <div className="site-header__bar container">
        <a className="brand" href="#top" onClick={close}>
          <span className="brand__mark" aria-hidden="true" />
          {profile.name}
        </a>
        <nav id="menu" className="site-nav" aria-label="Navigation principale">
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={close}>{link.label}</a>
              </li>
            ))}
            <li>
              <a className="btn btn--small" href="#contact" onClick={close}>Contact</a>
            </li>
          </ul>
        </nav>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Fermer le menu" : "Ouvrir le menu"}</span>
          <span className="menu-toggle__lines" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
