// NarrationText.jsx
// Plain HTML overlay (NOT inside the 3D canvas) that displays whatever
// narration line is currently active in the game store. Fades in/out via
// simple CSS transitions rather than a 3D text object, since subtitle-style
// text is easier to keep readable as an HTML overlay.

import { useGameStore } from '../../state/useGameStore';

export default function NarrationText() {
  const activeNarration = useGameStore((state) => state.activeNarration);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '600px',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Georgia, serif',
        fontSize: '1.1rem',
        fontStyle: 'italic',
        textShadow: '0 2px 6px rgba(0,0,0,0.8)',
        padding: '0 20px',
        pointerEvents: 'none', // never blocks clicks/drags on the canvas below
        opacity: activeNarration ? 1 : 0,
        transition: 'opacity 1s ease-in-out',
      }}
    >
      {activeNarration}
    </div>
  );
}
