// Jauge de niveau en 4 segments (niveaux définis dans src/data/profile.js).
export default function Meter({ level, max = 4, label }) {
  return (
    <span className="meter" role="img" aria-label={`Niveau : ${label} (${level} sur ${max})`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`meter__seg ${i < level ? "is-on" : ""}`} />
      ))}
    </span>
  );
}
