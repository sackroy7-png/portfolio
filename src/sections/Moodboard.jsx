import { useCallback, useMemo, useState } from "react";
import { categories, inspirations } from "../data/inspirations.js";
import Img from "../components/Img.jsx";
import Text from "../components/Text.jsx";
import Reveal from "../components/Reveal.jsx";
import Lightbox from "../components/Lightbox.jsx";
import SectionHead from "../components/SectionHead.jsx";

const labelOf = Object.fromEntries(categories.map((c) => [c.id, c.label]));

export default function Moodboard() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);

  const items = useMemo(
    () =>
      inspirations
        .map((item, i) => ({ ...item, number: i + 1, categoryLabel: labelOf[item.category] }))
        .filter((item) => filter === "all" || item.category === filter),
    [filter]
  );

  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="moodboard" className="section section--paper" aria-labelledby="moodboard-title">
      <div className="container">
        <SectionHead index="04" label="Moodboard" title={<span id="moodboard-title">Carnet d'inspirations.</span>}>
          <p>Terrains, matières, objets et marques qui nourrissent ma réflexion sur le produit et sa mise en valeur.</p>
        </SectionHead>

        <div className="filters" role="group" aria-label="Filtrer par catégorie">
          {[{ id: "all", label: "Tout" }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              className="filter"
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <ul className="mood-grid">
          {items.map((item, i) => (
            <Reveal as="li" key={item.src} className="mood-item" delay={(i % 3) * 60}>
              <button type="button" className="mood-item__btn" onClick={() => setOpen(i)} aria-label={`Agrandir : ${item.title}`}>
                <span className="mood-item__media">
                  <Img image={item} sizes="(min-width: 1000px) 30vw, (min-width: 600px) 45vw, 90vw" />
                </span>
              </button>
              <div className="mood-item__text">
                <p className="mono-label">
                  N° {String(item.number).padStart(2, "0")} · {item.categoryLabel}
                </p>
                <Text as="h3" className="mood-item__title" value={item.title} />
                <Text as="p" className="mood-item__caption" value={item.caption} />
                {item.source?.url ? (
                  <a className="mood-item__source" href={item.source.url} target="_blank" rel="noopener noreferrer">
                    {item.source.label || "Source"} ↗
                  </a>
                ) : (
                  item.source?.label && <p className="mood-item__source">© {item.source.label}</p>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>

      {open !== null && <Lightbox items={items} index={open} onClose={close} onNavigate={setOpen} />}
    </section>
  );
}
