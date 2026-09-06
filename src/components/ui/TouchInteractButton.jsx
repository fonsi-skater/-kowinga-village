// TouchInteractButton.jsx
// A tappable button for touch devices that stands in for the E key —
// dispatches the same synthetic keydown event our useInteractKey hook
// already listens for, so GardenInteraction/MeditationInteraction/
// BushInteraction all work identically with zero code changes.

export default function TouchInteractButton() {
  function handleTap() {
    // No `repeat` property needed — it defaults to false/undefined, which
    // is exactly what useInteractKey checks for (fires once per tap).
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE' }));
  }

  return (
    <button
      onClick={handleTap}
      style={{
        position: 'absolute',
        bottom: '34px',
        right: '24px',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)',
        border: '2px solid rgba(255,255,255,0.5)',
        color: 'white',
        fontSize: '1.3rem',
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        touchAction: 'none',
        pointerEvents: 'auto',
        zIndex: 6,
      }}
    >
      E
    </button>
  );
}
