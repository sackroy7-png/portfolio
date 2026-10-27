/* ==========================================================================
   PROFIL — textes de l'accueil, À propos, compétences, outils, CV et contact
   --------------------------------------------------------------------------
   Règles simples :
   • Modifie uniquement le texte entre guillemets "…".
   • Garde les virgules à la fin des lignes.
   • Un texte qui commence par "[À compléter" s'affiche en pointillés sur le
     site : remplace-le par ton vrai contenu avant de publier.
   • Les chemins d'images partent du dossier public/ (ex. "images/hero.jpg"
     = public/images/hero.jpg).
   • "placeholder: true" signale un visuel temporaire : passe-le à false (ou
     supprime la ligne) quand tu mets ta vraie photo.
   ========================================================================== */

export const profile = {
  name: "Sacha Roy",
  title: "Marketing digital · E-commerce · Outdoor",

  // Courte présentation affichée sur l'accueil (2 à 3 phrases).
  intro:
    "Étudiant en deuxième année de BUT Techniques de Commercialisation, parcours Marketing digital, e-commerce et entrepreneuriat. Je m'intéresse à la manière dont un produit de sport — une chaussure, un textile, un vélo — se présente, se raconte et se vend en ligne.",

  location: "", // facultatif, ex. "Lyon"

  heroImage: {
    src: "images/hero.jpg",
    alt: "Paysage de montagne en couches successives",
    caption: "Visuel d'ouverture — à remplacer par une photo outdoor personnelle.",
    placeholder: true,
  },

  /* ---------------------------------------------------------------- À PROPOS */
  about: {
    portrait: {
      src: "images/portrait.jpg",
      alt: "Portrait de Sacha Roy",
      placeholder: true,
    },
    detailImage: {
      src: "images/apropos-detail.jpg",
      alt: "Détail de carte topographique",
      caption: "Détail matière ou terrain — à remplacer.",
      placeholder: true,
    },
    // Chaque élément du tableau = un paragraphe.
    paragraphs: [
      "Je me forme au marketing digital et à l'e-commerce à travers le BUT Techniques de Commercialisation. Ce qui m'attire, c'est le lien entre un produit technique et la façon dont on le met en valeur : la photo, la fiche produit, le discours de marque, le parcours d'achat.",
    ],
    interests: [
      "Sport outdoor",
      "Chaussures techniques",
      "Matériaux et textiles",
      "Biomécanique",
      "Design produit",
      "Identité de marque",
    ],
    goal:
      "À long terme, je souhaite devenir chef de produit dans le secteur du sport, en particulier dans l'outdoor et la chaussure technique.",
  },

  // Formation : du plus récent au plus ancien.
  education: [
    {
      period: "2025 — 2028",
      title: "BUT Techniques de Commercialisation",
      detail: "Parcours Marketing digital, e-commerce et entrepreneuriat · 2e année en cours",
      school: "", // facultatif, ex. "IUT de …"
    },
  ],

  /* ------------------------------------------------------- RECHERCHE DE STAGE */
  internship: {
    duration: "2 mois",
    // Modifie librement les dates (texte libre).
    dates: "Du 5 avril au 28 mai 2027",
    missions: [
      "Marketing digital",
      "E-commerce",
      "Communication digitale",
      "Valorisation des produits",
    ],
    sectors: "Sport · Outdoor",
  },

  /* ------------------------------------------------------------- COMPÉTENCES
     level : 1 = Découverte · 2 = Bases acquises · 3 = Opérationnel · 4 = Avancé
     Les niveaux ci-dessous sont des valeurs de départ : ajuste-les
     honnêtement selon ton ressenti.                                          */
  levels: {
    1: "Découverte",
    2: "Bases acquises",
    3: "Opérationnel",
    4: "Avancé",
  },

  skills: [
    {
      name: "Marketing digital",
      level: 2,
      detail: "Réseaux sociaux, contenus, indicateurs de performance.",
    },
    {
      name: "E-commerce",
      level: 2,
      detail: "Fiches produit, parcours d'achat, mise en avant de l'offre.",
    },
    {
      name: "Analyse de marché et benchmark",
      level: 2,
      detail: "Comparaison d'offres, positionnement, veille concurrentielle.",
    },
    {
      name: "Identité de marque et communication",
      level: 2,
      detail: "Univers visuel, ton, cohérence entre les supports.",
    },
  ],

  /* ------------------------------------------------------------------ OUTILS
     status : "utilisé" ou "en apprentissage"                                 */
  tools: [
    { name: "Canva", level: 3, status: "utilisé" },
    { name: "Excel", level: 2, status: "utilisé" },
    { name: "Shopify", level: 2, status: "utilisé" },
    { name: "Lightroom", level: 2, status: "utilisé" },
    { name: "Photoshop", level: 1, status: "en apprentissage" },
    { name: "Procreate", level: 1, status: "en apprentissage" },
  ],

  /* --------------------------------------------------------------- DOCUMENTS
     Remplace le fichier dans public/documents/ en gardant le même nom,
     ou modifie le chemin "file". Mets file: null pour masquer un bouton.     */
  documents: [
    {
      label: "Curriculum vitæ",
      file: null, // quand ton CV est prêt : "documents/cv-sacha-roy.pdf"
      updated: "",
      note: "En préparation — disponible sur demande",
    },
    {
      label: "Lettre de motivation",
      file: null, // ex. "documents/lettre-motivation.pdf"
      note: "Disponible sur demande",
    },
  ],

  /* ----------------------------------------------------------------- CONTACT */
  contact: {
    email: "sack.roy7@gmail.com",
    linkedin: "https://www.linkedin.com/in/sacha-roy-bb004a351",
    message: "Une offre de stage, une question sur un projet ? Écrivez-moi.",
  },
};
