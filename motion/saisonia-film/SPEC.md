GOAL:    on comprend en 25 s ce que fait Saisonia : un jeune d'Auvergne trouve un job près de chez lui et suit sa candidature.
OUTPUT:  HyperFrames, 1080 x 1920 (vertical, référence TikTok de Sacha), 30 fps
TIME:    27 s x 30 = 810 frames ; pas de musique (livré muet)
LOOK:    fond #eef2f8 + halos de l'app (bleu 0.20 en haut à gauche, turquoise 0.14 en haut à droite, pêche 0.12 en bas) ;
         encre #0b1220, secondaire #586071 ; accent #316fdf sur UN mot par titre, sur le flood final ;
         Inter 700, titres 84 px, tracking -0.03em, 2 lignes max, centrés en x dans la bande 200–420 px ;
         médium : vraie UI de l'app (captures 3x) dans un iPhone noir (rayon 96 px, île 126x37) ;
         widgets iOS blancs (rayon 56 px), ombre 0 30px 60px rgba(11,18,32,.12)
OBJECTS: téléphone (cadre noir, île dynamique, barre d'état 17:02) ; widget calendrier (VENDREDI 15 mai) ;
         widget météo (Clermont-Ferrand 21°) ; widget Messages (« Les potes ») ; logo Saisonia (fichier de la marque)
MOTION:  arrivée expo.out 0.7–0.9 s ; caméra power2.inOut 0.6 s ; sortie power3.in 0.3 s ;
         titres : mot par mot blur 6px→0 + opacité, 0.067 s d'écart, 0.13 s chacun ; sortie blur-out 0.18 s ;
         navigation iOS : push 0.5 s power3.out (ancien écran -30 %) ; feuille : montée 0.55 s expo.out ;
         carte isolée : scale 1→1.7 power2.inOut 0.6 s, ombre 0 40px 80px .18
SHOTS:   0–3.4    widgets à l'écran dès frame 0, bulles de message 0.6 s / 1.5 s ; titres « Vendredi, 17 h » → « L'été approche »
         3.4–7.2  widgets sortent, le téléphone monte (accueil « Bonjour Léa ») ; « Elle ouvre Saisonia » ; push vers Rechercher « Job d'été »
         7.2–9.6  la carte « Vendeur·se en magasin de sport » sort de l'écran x1.7 ; « Un job d'été à 13 km »
         9.6–12.6 la carte rentre et devient la fiche ; Postuler isolé, pressé ; « Elle postule »
         12.6–16.6 feuille « Ton dossier » monte, étape 2, « C'est envoyé ! » ; « Son dossier est déjà prêt » → « Envoyé en deux étapes »
         16.6–21.2 push vers le suivi, toast « Nouvelle réponse » ; zoom sur l'entretien ; « L'entreprise répond »
         21.2–27  flood bleu, le téléphone devient l'icône, wordmark, baseline, mention prototype ; tenu 3 s
BANNED:  fond noir/navy vide, glow, particules, dégradés violets, labels monospace numérotés, trois cartes en ligne,
         logo dans un coin, titres qui bougent après arrivée, UI inclinée en 3D, faux écran inventé, anneaux de clic
QA:      t=0 (vignette), 2.5, 5, 8.5, 11, 14, 16, 19.5, 24, 26.5
