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
import { useAmbientMusic } from './audio/music/useAmbientMusic';
import { playNarrationAudio } from './audio/narration/playNarrationAudio';
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
import MiniMapManager from './scenes/character/MiniMapManager';
import EasterEggManager from './scenes/character/EasterEggManager';
import NarrationText from './components/ui/NarrationText';
import ControlsHint from './components/ui/ControlsHint';
import ActivityStatus from './components/ui/ActivityStatus';
import ProgressTracker from './components/ui/ProgressTracker';
import PortfolioNav from './components/ui/PortfolioNav';
import PortfolioPanel from './components/ui/PortfolioPanel';
import SiteTitle from './components/ui/SiteTitle';
import HobbiesPanel from './components/ui/HobbiesPanel';
import ZoneLegend from './components/ui/ZoneLegend';
import IntroScreen from './components/ui/IntroScreen';
import TouchJoystick from './components/ui/TouchJoystick';
import TouchInteractButton from './components/ui/TouchInteractButton';
import MiniMap from './components/ui/MiniMap';
import VillageExplorerCelebration from './components/ui/VillageExplorerCelebration';
import EasterEggMessage from './components/ui/EasterEggMessage';
import { useIsTouchDevice } from './hooks/useIsTouchDevice';

function App() {
  const isTouchDevice = useIsTouchDevice();
  // Refs for the day/night cycle to animate — created here since the
  // lights themselves are declared in JSX below, and DayNightCycle needs
  // direct references to update their .intensity each frame.
  const ambientLightRef = useRef();
  const directionalLightRef = useRef();
  // This ref is created HERE (not inside Character) and shared with both
  // Character (which moves the body) and FollowCamera (which reads its
  // position) — this is the standard React pattern for "two siblings need
  // access to the same thing": lift the shared value up to their parent.
  const characterRef = useRef();
  const setActiveNarration = useGameStore((state) => state.setActiveNarration);
  const showIntroScreen = useGameStore((state) => state.showIntroScreen);

  // Starts ambient background music once the intro screen is dismissed —
  // clicking "Enter Kowinga" is a real user interaction, which is exactly
  // what browsers require before allowing audio to play at all.
  useAmbientMusic(!showIntroScreen);

  // Show the intro narration TEXT once the intro screen is dismissed
  // (not on raw mount — the splash screen itself now covers that moment).
  useEffect(() => {
    if (showIntroScreen) return; // wait until the player has clicked Enter

    setActiveNarration(INTRO_NARRATION);
    const timer = setTimeout(() => setActiveNarration(null), 7000);
    playNarrationAudio('intro'); // safe now — this runs AFTER the Enter click

    return () => clearTimeout(timer);
  }, [showIntroScreen, setActiveNarration]);

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
        // preserveDrawingBuffer is required for ScreenshotButton's
        // canvas.toDataURL() to work — without it, WebGL clears its
        // buffer right after each frame renders, so a screenshot taken
        // any time after that would just capture a blank image.
        gl={{ preserveDrawingBuffer: true }}
      >
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
      </Canvas>

      {/* NarrationText is plain HTML, deliberately OUTSIDE the Canvas —
          it reads the same shared store that NarrationManager writes to. */}
      <NarrationText />
      <ControlsHint />
      <ActivityStatus />
      <ProgressTracker />
      <PortfolioNav />
      <PortfolioPanel />
      <SiteTitle />
      <HobbiesPanel />
      <ZoneLegend />
      <IntroScreen />
      <MiniMap />
      <VillageExplorerCelebration />
      <EasterEggMessage />

      {/* Touch controls only render on touch devices — desktop users keep
          using WASD/E, so nothing changes for them. */}
      {isTouchDevice && (
        <>
          <TouchJoystick />
          <TouchInteractButton />
        </>
      )}
    </div>
  );
}

export default App;
