// EasterEggMessage.jsx
// A one-time fun reveal shown when the hidden secret spot is found
// (see EasterEggManager.jsx). Reads showEasterEggMessage directly from
// the store — EasterEggManager handles setting it true then false again
// via a plain timeout, so this component needs no local state or effect
// of its own, just a direct render based on external state (same pattern
// as NarrationText).

import { useGameStore } from '../../state/useGameStore';

export default function EasterEggMessage() {
  const showEasterEggMessage = useGameStore((state) => state.showEasterEggMessage);

  if (!showEasterEggMessage) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(20,20,20,0.85)',
        color: 'white',
        fontFamily: 'sans-serif',
        padding: '20px 28px',
        borderRadius: '10px',
        textAlign: 'center',
        maxWidth: '320px',
        pointerEvents: 'none',
        zIndex: 12,
      }}
    >
      <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🥚✨</div>
      <strong>You found the secret spot!</strong>
      <p style={{ margin: '8px 0 0', opacity: 0.85, fontSize: '0.9rem' }}>
        Fonsi says: even code needs rest. Here's a virtual high-five ✋
      </p>
    </div>
  );
}
