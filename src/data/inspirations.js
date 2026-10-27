/* ==========================================================================
   MOODBOARD — galerie d'inspirations
   --------------------------------------------------------------------------
   • categories : filtres affichés au-dessus de la galerie (id + libellé).
   • inspirations : une image par bloc { … }.
       src       chemin de l'image (dans public/) ou adresse https://…
       category  doit correspondre à un "id" de categories
       title     titre court
       caption   légende
       source    facultatif : { label: "Nom", url: "https://…" } — sinon null
       placeholder  true tant que c'est un visuel temporaire

   Si tu utilises une image trouvée en ligne, indique toujours sa source.
   ========================================================================== */

export const categories = [
  { id: "outdoor", label: "Outdoor" },
  { id: "footwear", label: "Footwear" },
  { id: "matieres", label: "Matières" },
  { id: "design", label: "Design" },
  { id: "branding", label: "Branding" },
  { id: "ecommerce", label: "E-commerce" },
];

export const inspirations = [
  {
    src: "images/moodboard/outdoor-01.jpg",
    category: "outdoor",
    title: "Ligne de crête",
    caption: "Visuel temporaire. Idée : un paysage de montagne qui t'inspire.",
    source: null,
    placeholder: true,
  },
  {
    src: "images/moodboard/footwear-01.jpg",
    category: "footwear",
    title: "Semelle crantée",
    caption: "Visuel temporaire. Idée : gros plan sur une semelle de trail.",
    source: null,
    placeholder: true,
  },
  {
    src: "images/moodboard/matieres-01.jpg",
    category: "matieres",
    title: "Maille technique",
    caption: "Visuel temporaire. Idée : texture d'un mesh ou d'un ripstop.",
    source: null,
    placeholder: true,
  },
  {
    src: "images/moodboard/design-01.jpg",
    category: "design",
    title: "Forme et fonction",
    caption: "Visuel temporaire. Idée : un objet dont le design t'a marqué.",
    source: null,
    placeholder: true,
  },
  {
    src: "images/moodboard/ecommerce-01.jpg",
    category: "ecommerce",
    title: "Fiche produit",
    caption: "Visuel temporaire. Idée : une page produit que tu trouves réussie.",
    source: null,
    placeholder: true,
  },
  {
    src: "images/moodboard/branding-01.jpg",
    category: "branding",
    title: "Système graphique",
    caption: "Visuel temporaire. Idée : une identité de marque outdoor.",
    source: null,
    placeholder: true,
  },
  {
    src: "images/moodboard/outdoor-02.jpg",
    category: "outdoor",
    title: "Relief",
    caption: "Visuel temporaire. Idée : une carte, un itinéraire, un terrain.",
    source: null,
    placeholder: true,
  },
  {
    src: "images/moodboard/footwear-02.jpg",
    category: "footwear",
    title: "Tige et laçage",
    caption: "Visuel temporaire. Idée : détail de construction d'une chaussure.",
    source: null,
    placeholder: true,
  },
  {
    src: "images/moodboard/matieres-02.jpg",
    category: "matieres",
    title: "Tissage",
    caption: "Visuel temporaire. Idée : échantillons, nuancier, toile enduite.",
    source: null,
    placeholder: true,
  },
  {
    src: "images/moodboard/design-02.jpg",
    category: "design",
    title: "Esquisse",
    caption: "Visuel temporaire. Idée : croquis ou dessin technique produit.",
    source: null,
    placeholder: true,
  },
  {
    src: "images/moodboard/branding-02.jpg",
    category: "branding",
    title: "Étiquette",
    caption: "Visuel temporaire. Idée : packaging, étiquette, hangtag.",
    source: null,
    placeholder: true,
  },
  {
    src: "images/moodboard/ecommerce-02.jpg",
    category: "ecommerce",
    title: "Parcours mobile",
    caption: "Visuel temporaire. Idée : capture d'un parcours d'achat sur mobile.",
    source: null,
    placeholder: true,
  },
];
