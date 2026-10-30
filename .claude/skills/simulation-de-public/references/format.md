# Formats des fichiers

## spec.json (création du monde)

```json
{
  "title": "Lancement de Saisonia auprès des jeunes d'Auvergne",
  "question": "Quelle part des lycéens et étudiants va essayer l'appli dans le mois qui suit ?",
  "seed": "Résumé du matériau de départ (le post, l'offre, la vidéo…)",
  "assumptions": ["Lancement relayé par 3 lycées", "Tailles de segments : estimations"],
  "segments": [
    { "id": "lyc", "name": "Lycéens 16-18 ans", "size": 20000, "description": "…" }
  ],
  "agents": [
    {
      "id": "lea", "name": "Léa", "segment": "lyc", "age": 17,
      "bio": "Terminale à Clermont, cherche un job d'été, pas de permis.",
      "trait": "suit l'avis de ses amies", "voice": "messages courts, emojis",
      "stance": 0.1, "influence": 0.4, "follows": ["ines", "theo"]
    }
  ]
}
```

## round-N.json (un tour)

```json
{
  "event": "facultatif : ce qui arrive à ce tour (« une influenceuse locale en parle »)",
  "actions": [
    { "agent": "lea", "type": "post", "text": "…", "stance": 0.3 },
    { "agent": "theo", "type": "comment", "target": "lea", "text": "…", "stance": -0.1 },
    { "agent": "ines", "type": "share", "target": "lea", "text": "", "stance": 0.4 },
    { "agent": "karim", "type": "ignore", "text": "", "stance": -0.2 }
  ]
}
```

Chaque personnage a une action par tour (au pire `ignore`). `stance` est son avis après le tour.

## predict (le rapport)

```bash
python3 world.py predict world.json prediction.json
```

```json
{
  "headline": "Une phrase : la prédiction principale, avec une fourchette",
  "scenarios": [
    { "name": "Le plus probable", "likelihood": "≈ 60 %", "text": "…" },
    { "name": "Alternative haute", "likelihood": "≈ 25 %", "text": "… et ce qui la déclenche" },
    { "name": "Alternative basse", "likelihood": "≈ 15 %", "text": "…" }
  ],
  "segments": [{ "segment": "lyc", "text": "ce qui fait basculer ce groupe" }],
  "quotes": [{ "agent": "lea", "text": "citation tirée du fil" }],
  "recommendations": ["…", "…"],
  "limits": "Simulation faite par une IA à partir d'hypothèses : à utiliser pour explorer, pas comme une donnée réelle."
}
```
