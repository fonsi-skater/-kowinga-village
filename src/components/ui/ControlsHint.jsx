// ControlsHint.jsx
// A small, unobtrusive on-screen reminder of the current controls.
// Plain HTML overlay, same pattern as NarrationText — sits outside the
// Canvas, positioned with CSS. Text changes based on device type, since
// touch devices use the joystick/button, not WASD/E.

import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

export default function ControlsHint() {
  const isTouchDevice = useIsTouchDevice();

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        color: 'white',
        fontFamily: 'sans-serif',
        fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)',
        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        pointerEvents: 'none',
        lineHeight: 1.6,
      }}
    >
      {isTouchDevice ? (
        <>
          Joystick — move
          <br />
          E button — plant / sit / tend
        </>
      ) : (
        <>
          WASD / Arrows — move
          <br />
          E — plant (garden) / sit (meditation) / tend (bushes)
        </>
      )}
    </div>
  );
}
