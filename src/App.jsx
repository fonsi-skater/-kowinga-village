// App.jsx
// Entry point for the Kowinga village 3D scene.
// This is intentionally minimal for now: a Canvas (the 3D "window"),
// a camera, one light, and the ground. We add the character and
// zones one piece at a time so each step is easy to test/debug.

import { useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useGameStore } from './state/useGameStore';
import { INTRO_NARRATION } from './story/narrationLines';
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
import NarrationText from './components/ui/NarrationText';
import ControlsHint from './components/ui/ControlsHint';
import ActivityStatus from './components/ui/ActivityStatus';
import ProgressTracker from './components/ui/ProgressTracker';

function App() {
  // This ref is created HERE (not inside Character) and shared with both
  // Character (which moves the body) and FollowCamera (which reads its
  // position) — this is the standard React pattern for "two siblings need
  // access to the same thing": lift the shared value up to their parent.
  const characterRef = useRef();
  const setActiveNarration = useGameStore((state) => state.setActiveNarration);

  // Show the intro narration once, on first load — doesn't depend on
  // Fonsi's position like the zone narrations do, so it's a simple
  // effect that runs once when the component mounts.
  useEffect(() => {
    setActiveNarration(INTRO_NARRATION);
    const timer = setTimeout(() => setActiveNarration(null), 7000);
    return () => clearTimeout(timer);
  }, [setActiveNarration]);

  return (
    // Wrapper div with position: relative so NarrationText (position:
    // absolute) overlays correctly on top of the Canvas beneath it.
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* The Canvas is where all 3D rendering happens — everything inside
          it is a Three.js object, not regular HTML/DOM. */}
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 50 }}
        style={{ width: '100%', height: '100%', background: '#87ceeb' }}
      >
        {/* Ambient light: soft light from all directions, prevents pure-black shadows */}
        <ambientLight intensity={0.6} />

        {/* Directional light: acts like the sun, casts shadows */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
        />

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
      </Canvas>

      {/* NarrationText is plain HTML, deliberately OUTSIDE the Canvas —
          it reads the same shared store that NarrationManager writes to. */}
      <NarrationText />
      <ControlsHint />
      <ActivityStatus />
      <ProgressTracker />
    </div>
  );
}

export default App;
