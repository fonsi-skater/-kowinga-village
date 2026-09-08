// App.jsx
// Entry point for the Kowinga village 3D scene. The heavy 3D content
// (Scene.jsx — Three.js, Rapier physics, the water shader) is lazy-loaded
// via React.lazy, and only starts downloading once the intro screen is
// dismissed — keeping the very first paint fast regardless of how large
// the 3D bundle grows.

import { lazy, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { Analytics } from '@vercel/analytics/react';
import { useGameStore } from './state/useGameStore';
import { INTRO_NARRATION } from './story/narrationLines';
import { useAmbientMusic } from './audio/music/useAmbientMusic';
import { playNarrationAudio } from './audio/narration/playNarrationAudio';
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
import AchievementToast from './components/ui/AchievementToast';
import { useIsTouchDevice } from './hooks/useIsTouchDevice';

// Lazy-loaded: Vite/React won't include Scene.jsx (and everything it
// imports — Three.js, Rapier, the Water shader) in the initial bundle.
// It becomes a separate chunk, fetched only when <Scene /> is first
// actually rendered (see the conditional render below).
const Scene = lazy(() => import('./Scene'));

function App() {
  const isTouchDevice = useIsTouchDevice();
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
        {/* Scene (and its whole dependency chunk) only starts loading once
            the intro screen is gone — this is what makes the code-split
            actually deferred, not just theoretically separate. */}
        {!showIntroScreen && (
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        )}
      </Canvas>

      {/* drei's Loader shows a progress bar (auto-tracking the loading
          manager behind useLoader/Rapier's WASM init) while Scene's chunk
          and assets are still loading — replaces what would otherwise be
          a blank moment with real, professional loading feedback. */}
      <Loader
        containerStyles={{ background: 'rgba(10,20,12,0.9)' }}
        innerStyles={{ width: '200px' }}
        barStyles={{ background: '#8fd694' }}
        dataStyles={{ color: 'white', fontFamily: 'sans-serif', fontSize: '0.85rem' }}
      />

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
      <AchievementToast />

      {/* Touch controls only render on touch devices — desktop users keep
          using WASD/E, so nothing changes for them. */}
      {isTouchDevice && (
        <>
          <TouchJoystick />
          <TouchInteractButton />
        </>
      )}

      {/* Vercel's visitor analytics — renders nothing visible, just tracks
          page views once deployed. Requires enabling Analytics in the
          Vercel project dashboard too (free tier). */}
      <Analytics />
    </div>
  );
}

export default App;
