import { useEffect, useRef } from "react";
import Img from "./Img.jsx";
import Text from "./Text.jsx";

// Visionneuse plein écran : flèches ← → pour naviguer, Échap pour fermer.
export default function Lightbox({ items, index, onClose, onNavigate }) {
  const closeRef = useRef(null);
  const item = items[index];

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onNavigate((index + 1) % items.length);
      if (event.key === "ArrowLeft") onNavigate((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose, onNavigate]);

  if (!item) return null;
  const many = items.length > 1;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title || item.alt || "Image"} onClick={onClose}>
      <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox__media">
          <Img image={item} eager />
        </div>
        <div className="lightbox__info">
          <p className="mono-label">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            {item.categoryLabel && <> · {item.categoryLabel}</>}
          </p>
          <Text as="h3" className="lightbox__title" value={item.title} />
          <Text as="p" className="lightbox__caption" value={item.caption} />
          {item.source?.url ? (
            <a className="link-arrow" href={item.source.url} target="_blank" rel="noopener noreferrer">
              Source : {item.source.label || item.source.url}
            </a>
          ) : (
            item.source?.label && <p className="mono-label">© {item.source.label}</p>
          )}
          <div className="lightbox__controls">
            {many && (
              <>
                <button type="button" className="icon-btn" onClick={() => onNavigate((index - 1 + items.length) % items.length)} aria-label="Image précédente">←</button>
                <button type="button" className="icon-btn" onClick={() => onNavigate((index + 1) % items.length)} aria-label="Image suivante">→</button>
              </>
            )}
            <button ref={closeRef} type="button" className="icon-btn icon-btn--close" onClick={onClose} aria-label="Fermer">✕</button>
          </div>
        </div>
      </div>
    </div>
  );
}
