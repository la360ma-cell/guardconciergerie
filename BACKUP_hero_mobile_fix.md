# SAUVEGARDE — Hero Mobile Fix
**Date :** 2026-04-01
**Déploiement Vercel :** AXTcC8vx5 (Current ✅)

---

## SHAs des fichiers sauvegardés

| Fichier | SHA |
|---------|-----|
| `components/site/Hero.tsx` | `9a4dd9e7a1c0bd998d7979d41b670b018eded15b` |
| `components/site/DynamicForm.tsx` | `80d1f483527f97aed8d8ec95949f804163348b02` |

---

## Commits de cette session (dans l'ordre)

| SHA | Description |
|-----|-------------|
| `fc8f241` | fix: mobile hero - center text/buttons, add padding top |
| `c8d7777` | fix: mobile hero - use lg:overflow-hidden so mobile content not clipped |
| `c5e7347` | fix: DynamicForm hero lg:h-full only, remove flex-1 constraints for mobile |
| `0b79f28` | fix: hero minHeight+items-start+lg:max-h for proper layout |
| `9a679fd` | fix: add overflow-hidden to flex container to clip background |
| `2253f88` | fix: use items-stretch grid + h-full on form |
| `d6ae37c` | fix: reduce hero form padding/gaps to fit within hero |
| `4fd29c9` | fix: reduce hero form padding p-8→p-5 |
| `4ac62a9` | fix: form element uses flex flex-col to enable flex-1 |
| `bb0b6be` | fix: add min-h-0 to form |
| `f612aa1` | fix: form height fixed + overflow visible |

---

## Changements clés appliqués

### Hero.tsx — Section principale
```
// Section hero — mobile: pas de overflow-hidden, desktop seulement
className="relative flex flex-col pt-20 bg-white dark:bg-obsidian-950 lg:overflow-hidden"

// Container principal — padding vertical mobile
className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-0 w-full z-10 flex-1 flex flex-col justify-center min-h-0"

// Colonne texte gauche — centré mobile, gauche desktop
className={isCenter ? 'text-center flex flex-col justify-center items-center' : 'flex flex-col justify-center text-center items-center lg:text-left lg:items-start'}

// Badges de confiance — centrés mobile
className={`flex flex-wrap gap-4 mb-10 justify-center${isCenter ? '' : ' lg:justify-start'}`}

// Boutons CTA — centrés mobile
className={`flex flex-wrap gap-4 justify-center${isCenter ? '' : ' lg:justify-start'}`}

// Paragraphe — centré mobile
className="text-lg text-obsidian-500 dark:text-obsidian-300 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"

// Formulaire motion.div — scroll uniquement sur desktop
className="relative will-change-transform lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto"

// Section minHeight (dynamique depuis DB)
minHeight: heroMinHeight  // 'screen' → '100vh'
```

### DynamicForm.tsx — Formulaire hero
```
// Container formulaire hero — h-full uniquement desktop
className="bg-white ... p-3 lg:h-full lg:overflow-y-auto flex flex-col"
```

---

## État de la base de données
- `appearance_hero_height` = `'screen'` (100vh)

---

## Résultat visuel
- **Desktop (≥1024px):** Texte à gauche + formulaire à droite, overflow caché
- **Mobile (<1024px):** Texte centré + formulaire empilé en dessous, pas de coupure, espace sous le header
