import { isTodo } from "../lib/asset.js";

// Affiche un texte des fichiers de données.
// Les textes "[À compléter …]" sont mis en évidence pour ne pas être oubliés.
export default function Text({ value, as: Tag = "span", className = "" }) {
  if (value === null || value === undefined || value === "") return null;
  if (isTodo(value)) {
    return (
      <Tag className={`${className} todo`.trim()} title="Contenu à compléter dans src/data/">
        {value}
      </Tag>
    );
  }
  return <Tag className={className || undefined}>{value}</Tag>;
}
