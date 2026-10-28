// État de la démo : profil, candidatures, favoris. Gardé dans le navigateur du visiteur.
import { useEffect, useReducer } from "react";
import { toggle } from "./data.js";

const KEY = "saisonia-app-v1";

export const DEFAULT_PROFILE = {
  firstName: "Alex",
  age: 17,
  level: "Première / Terminale",
  formation: "Terminale STMG",
  skills: ["Vente", "Accueil client", "Anglais"],
  availability: ["Week-ends", "Été"],
  city: "Clermont-Ferrand",
  radius: 40,
  wanted: ["Job d'été", "Job étudiant"],
  cv: "",
};

const DEFAULT_APPS = [
  {
    id: 5,
    status: "entretien",
    history: [["envoyee", "2 oct."], ["vue", "4 oct."], ["entretien", "6 oct."]],
    interview: { when: "Jeudi 5 nov. · 14 h", where: "Le Comptoir Bourbonnais, Moulins" },
    message: "",
  },
  { id: 8, status: "vue", history: [["envoyee", "12 oct."], ["vue", "14 oct."]], message: "" },
  { id: 6, status: "envoyee", history: [["envoyee", "20 oct."]], message: "" },
  { id: 3, status: "acceptee", history: [["envoyee", "3 sept."], ["vue", "5 sept."], ["entretien", "9 sept."], ["acceptee", "12 sept."]], message: "" },
  { id: 10, status: "refusee", history: [["envoyee", "1 sept."], ["vue", "2 sept."], ["refusee", "8 sept."]], message: "" },
];

const initial = { onboarded: false, profile: DEFAULT_PROFILE, apps: DEFAULT_APPS, saved: [11, 2], readNotifs: [] };
const NEXT = { envoyee: "vue", vue: "entretien", entretien: "acceptee" };

function reducer(state, action) {
  switch (action.type) {
    case "onboard":
      return { ...state, onboarded: true, profile: { ...state.profile, ...action.profile } };
    case "replayOnboarding":
      return { ...state, onboarded: false };
    case "profile":
      return { ...state, profile: { ...state.profile, ...action.patch } };
    case "apply":
      return {
        ...state,
        apps: [{ id: action.id, status: "envoyee", history: [["envoyee", "Aujourd'hui"]], message: action.message }, ...state.apps.filter((a) => a.id !== action.id)],
      };
    case "advance":
      return {
        ...state,
        apps: state.apps.map((a) => {
          const next = NEXT[a.status];
          if (a.id !== action.id || !next) return a;
          return {
            ...a,
            status: next,
            history: [...a.history, [next, "Aujourd'hui"]],
            interview: next === "entretien" ? { when: "Mardi 10 nov. · 10 h", where: "Visio ou sur place" } : a.interview,
          };
        }),
      };
    case "save":
      return { ...state, saved: toggle(state.saved, action.id) };
    case "readNotif":
      return { ...state, readNotifs: [...new Set([...state.readNotifs, ...action.ids])] };
    case "reset":
      return { ...initial, onboarded: true };
    default:
      return state;
  }
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved ? { ...initial, ...saved } : initial;
  } catch {
    return initial;
  }
}

export function useStore() {
  const [state, dispatch] = useReducer(reducer, undefined, load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* navigation privée : la démo fonctionne sans sauvegarde */
    }
  }, [state]);
  return [state, dispatch];
}
