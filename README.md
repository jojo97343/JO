# Pub « Mon Coach Finance » — Remotion

Publicité de 60 s (60 fps, 3 600 images, calée sur 120 BPM) pour l'application **Mon Coach Finance**.
Les écrans de l'appli sont recréés en composants React (aucune capture d'écran).

## Commandes

```bash
npm install
npx remotion studio
npx remotion render Pub9x16 out/pub-mon-coach-finance-9x16.mp4 --codec=h264 --crf=16
npx remotion render Pub16x9 out/pub-mon-coach-finance-16x9.mp4 --codec=h264 --crf=16
```

Rendu hors ligne (navigateur sans accès à Google Fonts) : préfixer par `REMOTION_FONTS=local`
pour utiliser la copie de Manrope incluse dans `public/fonts`.

Images clés : `node scripts/stills.mjs Pub9x16 450 900 1300` → `out/stills/`.

## Scènes (9:16 et 16:9)

| # | Scène | Timecode | Images |
|---|---|---|---|
| 1 | Le problème | 0:00 → 0:04 | 0 → 240 |
| 2 | Révélation | 0:04 → 0:07 | 240 → 420 |
| 3 | Accueil | 0:07 → 0:12 | 420 → 720 |
| 4 | Ajouter une dépense | 0:12 → 0:19 | 720 → 1140 |
| 5 | Bilan | 0:19 → 0:27 | 1140 → 1620 |
| 6 | Budget | 0:27 → 0:32 | 1620 → 1920 |
| 7 | Clôture et Archives | 0:32 → 0:40 | 1920 → 2400 |
| 8 | Couple et Partenaire | 0:40 → 0:47 | 2400 → 2820 |
| 9 | Vacances | 0:47 → 0:52 | 2820 → 3120 |
| 10 | Ton style | 0:52 → 0:55 | 3120 → 3300 |
| 11 | Final | 0:55 → 1:00 | 3300 → 3600 |

## Son (optionnel)

- Musique : `public/music.mp3` (volume : `MUSIC_VOLUME` dans `src/components/Audio.tsx`, fondu d'entrée et de sortie automatique).
- Bruitages : `public/sfx/tap.mp3`, `public/sfx/whoosh.mp3`, `public/sfx/pop.mp3` (volume : `SFX_VOLUME`).
- Si un fichier manque, il est simplement ignoré : la vidéo se rend sans erreur.

## Organisation

- `src/theme.ts` — tokens de l'appli (clair / sombre, couleurs de catégories, accents)
- `src/data.ts` — données fictives (Enzo, Léa, septembre 2026, Tokyo…)
- `src/layout.ts` — mises en page 9:16 et 16:9, caméra (zoom sur un point de l'écran)
- `src/components/` — Phone, Finger, Background, Kinetic (typo), Logo, Charts (Donut, LineChart), ui (NavBar, Header, Switch, Sheet…)
- `src/screens/` — écrans de l'appli (Accueil, Dépense, Bilan, Budget, Archives, PDF, Couple, Partenaire, Vacances)
- `src/scenes/` — les 11 scènes
