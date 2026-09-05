# Kowinga Village — Tech Stack & Structure

## Story premise
Fonsi once dreamed of working in computers. Realizing AI is taking over his job,
he leaves the tech world and resorts to Kowinga, a village deep in the countryside.
There he finds peace: a river, inline skating paths, livestock and poultry, a
vegetable garden, and quiet space to meditate and tend the bushes.

## Core 3D stack
- **React + Vite** — app shell (already scaffolded)
- **React Three Fiber (R3F)** — declarative Three.js scene, camera, character controller
- **@react-three/drei** — helpers: `<Html>` (speech bubbles / UI-in-3D), `<Water>`
  (river shader), environment/sky helpers, loaders
- **@react-three/rapier** — physics: skating momentum & collision, river buoyancy/swim feel

## Assets
- **Blender** — custom models specific to the story: Fonsi character, huts,
  chicken coop, livestock pen, garden plots
- **Kenney.nl / Poly Haven (CC0)** — filler nature assets: trees, rocks, grass, bushes
- **glTF/GLB** — asset export format
- **gltfjsx** — converts .glb → ready R3F component

## State management
- **Zustand** — tracks: current zone Fonsi is in, active activity (skating/
  gardening/swimming/meditating), garden growth stage, time of day, which
  narration/dialogue lines have already played

## Audio & Narration (v1 priority: zone-entry narration + ambient music)
- **Narration:**
  - Intro narration over a "Nairobi skyline fading into village" opening
    sequence — sets up the whole premise in ~20-30 seconds
  - Zone-entry narration: a short line plays once when Fonsi first reaches
    a new zone (river, garden, meditation spot, skating path)
  - Voice source options: record own voice (English/Kiswahili mix), or
    free-tier AI voice (e.g. ElevenLabs free tier) for a handful of key lines
  - Fallback: on-screen fading text narration if audio production is a
    time sink
- **Music:**
  - Ambient background track, free royalty-free source: Pixabay Music,
    Free Music Archive, or YouTube Audio Library
  - Optional dynamic layer with **Tone.js**: crossfade calmer music near
    meditation spot vs. more upbeat near skating path
- **NPC dialogue (v2, deferred):**
  - Proximity-triggered speech bubbles via drei's `<Html>`
  - Optional short pre-recorded or AI voice clips per line

## Hosting
- **Vercel (free tier)** — same as other projects

## Folder structure
```
kowinga-village/
├── docs/
│   └── tech-stack.md          ← this file
├── public/
│   ├── models/                ← exported .glb files served statically
│   └── audio/
│       ├── music/             ← ambient/background tracks
│       ├── narration/         ← narration voice clips
│       └── sfx/               ← misc sound effects
└── src/
    ├── assets/
    │   ├── models/            ← source model files (pre-export)
    │   └── textures/
    ├── audio/
    │   ├── music/             ← music playback logic (Tone.js/howler)
    │   ├── narration/         ← narration trigger/playback logic
    │   └── sfx/
    ├── components/
    │   └── ui/                ← HUD, subtitles, speech bubble overlays
    ├── hooks/                 ← custom hooks (proximity detection, etc.)
    ├── scenes/
    │   ├── character/         ← Fonsi character + controller
    │   ├── environment/       ← river, skating paths, huts, garden, bush
    │   └── zones/             ← per-zone composition (river zone, garden zone, etc.)
    ├── state/                 ← Zustand stores
    └── story/                 ← narration script text, zone-entry line mapping
```
