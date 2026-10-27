import { useEffect, useState } from "react";

// Navigation par l'adresse : "#/projets/slug" ouvre un projet,
// "#apropos", "#contact"… pointent vers une section de l'accueil.
function parse() {
  const hash = window.location.hash;
  const match = hash.match(/^#\/projets\/([\w-]+)/);
  if (match) return { name: "project", slug: match[1] };
  return { name: "home", anchor: decodeURIComponent(hash.slice(1)) };
}

export function useHashRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => setRoute(parse());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
