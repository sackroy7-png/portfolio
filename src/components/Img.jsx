import { asset } from "../lib/asset.js";

// Image optimisée : chargement différé sauf pour les visuels du haut de page.
// image.position (facultatif) règle le cadrage, ex. "center 25%" pour remonter le cadre.
export default function Img({ image, className = "", eager = false, sizes }) {
  if (!image?.src) return null;
  return (
    <img
      className={className || undefined}
      src={asset(image.src)}
      alt={image.alt ?? image.title ?? ""}
      loading={eager ? "eager" : "lazy"}
      fetchpriority={eager ? "high" : undefined}
      decoding="async"
      sizes={sizes}
      style={image.position ? { objectPosition: image.position } : undefined}
    />
  );
}
