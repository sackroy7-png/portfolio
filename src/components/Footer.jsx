import { profile } from "../data/profile.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p className="mono-label">{profile.title}</p>
        <a
          className="link-arrow"
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Haut de page ↑
        </a>
      </div>
    </footer>
  );
}
