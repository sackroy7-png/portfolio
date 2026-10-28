# La diagonale → HyperFrames

- Niveau : **hébergé** (hosted). Le dessin SVG d'origine (`../saisonia-reel/index.html`) est gardé tel quel
  et piloté par l'horloge HyperFrames (`hf-seek`). La bande-son (Web Audio, rendue en WAV puis normalisée
  à -14 LUFS) est un clip `<audio id="soundtrack">`.
- Modifiable dans HyperFrames : textes des 6 écrans (titre + phrase), 4 mots du final, 3 premiers contrats
  (panneau Variables : `|` = retour à la ligne, `*` devant un mot = en bleu) ; volume et position du son.
- Non modifiable dans Studio : le dessin lui-même (formes, minutage des animations) → dans le code.
- Différence avec l'original : pas de mélange de 3 sous-images (flou de mouvement par tmix) ;
  le flou directionnel calculé reste. Comparaison : SSIM 0,994 sur les 35 s.
- Avertissements gardés : `line_unread` (le SVG est redessiné à chaque image, faux positifs),
  `composition_file_too_large` / `nested_structure_needs_subcomposition` (un seul dessin hébergé).
