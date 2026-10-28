// Données et règles métier du prototype (toutes les offres sont fictives).
import OFFERS_RAW from "../../src/content/saisonia-offres.json";

export const CITIES = {
  "Clermont-Ferrand": [45.7772, 3.087],
  Riom: [45.8936, 3.1126],
  Issoire: [45.5443, 3.249],
  Vichy: [46.1278, 3.4253],
  Moulins: [46.5646, 3.3326],
  Montluçon: [46.3404, 2.6035],
  Aurillac: [44.9264, 2.4397],
  "Le Lioran": [45.0899, 2.7517],
  "Le Puy-en-Velay": [45.0434, 3.8858],
};
export const HOME_CITIES = ["Clermont-Ferrand", "Vichy", "Moulins", "Montluçon", "Aurillac", "Le Puy-en-Velay"];

export const CONTRACTS = [
  { id: "Stage", icon: "🎓", hint: "Découverte, stage de formation" },
  { id: "Alternance", icon: "🔁", hint: "École et entreprise" },
  { id: "Job d'été", icon: "☀️", hint: "Juillet, août" },
  { id: "Job étudiant", icon: "📚", hint: "À côté des cours" },
  { id: "Saisonnier", icon: "🏔️", hint: "Hiver, été, vendanges" },
  { id: "Premier emploi", icon: "🚀", hint: "CDD, CDI" },
];
export const LEVELS = ["3e", "Seconde", "Première / Terminale", "Bac +1 / +2", "Bac +3 et plus"];
export const SEASONS = ["Hiver", "Printemps", "Été", "Automne", "Toute l'année"];
export const AVAILABILITY = ["Semaine", "Soirs", "Week-ends", "Vacances scolaires", "Été"];
export const OFFERS = OFFERS_RAW;
export const DOMAINS = [...new Set(OFFERS.map((o) => o.domain))].sort((a, b) => a.localeCompare(b, "fr"));
export const SKILLS = [...new Set(OFFERS.flatMap((o) => o.skills))].sort((a, b) => a.localeCompare(b, "fr"));

// Couleur d'accent par type de contrat (fonds doux + texte contrasté).
export const CONTRACT_TONES = {
  Stage: ["#e7efff", "#1f4fae"],
  Alternance: ["#e2f5f3", "#0b5f57"],
  "Job d'été": ["#fff3d6", "#7a5200"],
  "Job étudiant": ["#efe9ff", "#5134a8"],
  Saisonnier: ["#e3f1ff", "#0b4f87"],
  "Premier emploi": ["#ffe9e6", "#9a2a1a"],
};

export const STATUS = {
  envoyee: { label: "Envoyée", step: 0 },
  vue: { label: "Vue", step: 1 },
  entretien: { label: "Entretien", step: 2 },
  acceptee: { label: "Acceptée", step: 3 },
  refusee: { label: "Non retenue", step: 3 },
};
export const STEPS = ["Envoyée", "Vue", "Entretien", "Réponse"];

export function distanceKm(from, to) {
  const [a, b] = [CITIES[from], CITIES[to]];
  if (!a || !b) return 0;
  const rad = (d) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b[0] - a[0]) / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(rad(b[1] - a[1]) / 2) ** 2;
  return Math.round(12742 * Math.asin(Math.sqrt(h)));
}

export const kmLabel = (km) => (km < 3 ? "Sur place" : `${km} km`);
export const toggle = (list, value) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

// Pourquoi une offre correspond (ou non) au profil : utilisé partout dans l'interface.
export function fit(offer, profile) {
  const ageOk = profile.age >= offer.minAge;
  const levelOk = offer.levels.includes(profile.level);
  const contractOk = !profile.wanted.length || profile.wanted.includes(offer.contract);
  const near = offer.km <= profile.radius;
  const skills = offer.skills.filter((s) => profile.skills.includes(s));
  const score = [ageOk, levelOk, contractOk, near].filter(Boolean).length + skills.length * 0.5;
  return { ageOk, levelOk, contractOk, near, skills, match: ageOk && levelOk && contractOk && near, score };
}

export const withDistance = (city) => OFFERS.map((o) => ({ ...o, km: distanceKm(city, o.city) }));
