// ControlsHint.jsx
// A small, unobtrusive on-screen reminder of the current controls.
// Plain HTML overlay, same pattern as NarrationText — sits outside the
// Canvas, positioned with CSS.

export default function ControlsHint() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        color: 'white',
        fontFamily: 'sans-serif',
        fontSize: '0.85rem',
        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        pointerEvents: 'none',
        lineHeight: 1.6,
      }}
    >
      WASD / Arrows — move
      <br />
      E — plant (garden) / sit (meditation spot)
    </div>
  );
}
