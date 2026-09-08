// Scene.jsx
// Everything that lives INSIDE the <Canvas> — lights, physics, all zones,
// character, cameras, and all the frame-by-frame managers. Extracted into
// its own file (and lazy-loaded from App.jsx) so this heavy code — Three.js,
// Rapier's physics WASM, the water shader — only downloads once the intro
// screen is dismissed, instead of blocking the very first paint.

import { useRef, Suspense } from 'react';
import { Physics } from '@react-three/rapier';
import Ground from './scenes/environment/Ground';
import River from './scenes/environment/River';
import SkatingPath from './scenes/environment/SkatingPath';
import Homestead from './scenes/environment/Homestead';
import Garden from './scenes/environment/Garden';
import MeditationSpot from './scenes/environment/MeditationSpot';
import BushArea from './scenes/environment/BushArea';
import Character from './scenes/character/Character';
import FollowCamera from './scenes/character/FollowCamera';
import NarrationManager from './scenes/character/NarrationManager';
import GardenInteraction from './scenes/character/GardenInteraction';
import SpeedBoostManager from './scenes/character/SpeedBoostManager';
import MeditationInteraction from './scenes/character/MeditationInteraction';
import BushInteraction from './scenes/character/BushInteraction';
import ZoneFloatingLabels from './components/ui/ZoneFloatingLabels';
import DayNightCycle from './scenes/environment/DayNightCycle';
import Fireflies from './scenes/environment/Fireflies';
import MiniMapManager from './scenes/character/MiniMapManager';
import EasterEggManager from './scenes/character/EasterEggManager';

export default function Scene() {
  // Refs for the day/night cycle to animate — created here since the
  // lights themselves are declared in JSX below, and DayNightCycle needs
  // direct references to update their .intensity each frame.
  const ambientLightRef = useRef();
  const directionalLightRef = useRef();
  // This ref is shared with both Character (which moves the body) and
  // FollowCamera (which reads its position) — the standard React pattern
  // for "two siblings need access to the same thing": lift it up to their
  // shared parent (this component).
  const characterRef = useRef();

  return (
    <>
      {/* Ambient light: soft light from all directions, prevents pure-black shadows */}
      <ambientLight ref={ambientLightRef} intensity={0.6} />

      {/* Directional light: acts like the sun, casts shadows */}
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={1}
        castShadow
      />

      {/* Animates sky color and light intensities through a repeating
          day/night cycle — purely atmospheric, no new 3D objects. */}
      <DayNightCycle ambientRef={ambientLightRef} directionalRef={directionalLightRef} />

      {/* Small glowing particles, visible only during the night portion
          of the cycle above. */}
      <Fireflies />

      {/* Physics provider: everything that needs collision/gravity (Ground,
          Character) must live inside this. Nothing outside it is physics-aware.
          IMPORTANT: Physics loads its engine asynchronously (it's WASM under
          the hood), so it must be wrapped in Suspense — without this, colliders
          can try to build before the engine finishes loading and crash. */}
      <Suspense fallback={null}>
        <Physics gravity={[0, -9.81, 0]}>
          <Ground />
          <River />
          <SkatingPath />
          <Homestead />
          <Garden />
          <MeditationSpot />
          <BushArea />
          <Character bodyRef={characterRef} />
        </Physics>
      </Suspense>

      {/* FollowCamera automatically trails Fonsi as he moves. */}
      <FollowCamera targetRef={characterRef} />

      {/* NarrationManager watches Fonsi's position and triggers narration
          lines — it renders nothing itself, just manages state. */}
      <NarrationManager targetRef={characterRef} />

      {/* GardenInteraction listens for the E key and plants the nearest
          garden plot if Fonsi is close enough — see the file for details. */}
      <GardenInteraction targetRef={characterRef} />

      {/* SpeedBoostManager checks if Fonsi is on the skating path ring
          and toggles isSkating (read by Character for the speed boost). */}
      <SpeedBoostManager targetRef={characterRef} />

      {/* MeditationInteraction listens for E near the meditation platform
          to toggle isMeditating (read by Character to freeze movement). */}
      <MeditationInteraction targetRef={characterRef} />

      {/* BushInteraction listens for E near an untended bush to tend it. */}
      <BushInteraction targetRef={characterRef} />

      {/* ZoneFloatingLabels renders each zone's name anchored to its
          actual 3D position — appears naturally beside/above wherever
          that zone is on screen, never competing with fixed-position
          UI like SiteTitle. */}
      <ZoneFloatingLabels />

      {/* MiniMapManager tracks Fonsi's live position for the MiniMap UI. */}
      <MiniMapManager targetRef={characterRef} />

      {/* EasterEggManager watches for the hidden secret spot being found. */}
      <EasterEggManager targetRef={characterRef} />
    </>
  );
}
