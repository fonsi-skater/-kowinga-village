// TouchJoystick.jsx
// A draggable virtual joystick for touch devices. Rather than rewriting
// Character.jsx's movement logic to accept a second input source, this
// dispatches SYNTHETIC keyboard events (keydown/keyup for W/A/S/D) that
// our existing useKeyboardControls hook already listens for — meaning
// movement code needs zero changes to support touch.

import { useRef, useState } from 'react';

const BASE_SIZE = 110;
const KNOB_SIZE = 50;
const MAX_DRAG = (BASE_SIZE - KNOB_SIZE) / 2;

// Converts a drag angle into which WASD keys should be "held". Using a
// simple quadrant split (not just 4 exact directions) means diagonal
// drags correctly hold two keys at once, matching real WASD diagonal movement.
function getActiveKeysFromAngle(dx, dy) {
  const keys = new Set();
  const threshold = 0.3; // ignores tiny accidental drag noise
  if (dx < -threshold) keys.add('KeyA');
  if (dx > threshold) keys.add('KeyD');
  if (dy < -threshold) keys.add('KeyW');
  if (dy > threshold) keys.add('KeyS');
  return keys;
}

export default function TouchJoystick() {
  const baseRef = useRef(null);
  const activeKeysRef = useRef(new Set());
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  function updateActiveKeys(newKeys) {
    const old = activeKeysRef.current;
    // Release keys that are no longer active
    for (const key of old) {
      if (!newKeys.has(key)) {
        window.dispatchEvent(new KeyboardEvent('keyup', { code: key }));
      }
    }
    // Press keys that just became active
    for (const key of newKeys) {
      if (!old.has(key)) {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: key }));
      }
    }
    activeKeysRef.current = newKeys;
  }

  function handlePointerDown(e) {
    setDragging(true);
    baseRef.current?.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e) {
    if (!dragging || !baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let dx = e.clientX - centerX;
    let dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Clamp the knob so it never visually drags outside the base circle
    if (distance > MAX_DRAG) {
      dx = (dx / distance) * MAX_DRAG;
      dy = (dy / distance) * MAX_DRAG;
    }

    setKnobPos({ x: dx, y: dy });
    // Normalize by MAX_DRAG (not raw distance) so the angle threshold in
    // getActiveKeysFromAngle works consistently regardless of drag distance.
    updateActiveKeys(getActiveKeysFromAngle(dx / MAX_DRAG, dy / MAX_DRAG));
  }

  function handlePointerUp() {
    setDragging(false);
    setKnobPos({ x: 0, y: 0 });
    updateActiveKeys(new Set()); // release all keys on release
  }

  return (
    <div
      ref={baseRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '24px',
        width: `${BASE_SIZE}px`,
        height: `${BASE_SIZE}px`,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.15)',
        border: '2px solid rgba(255,255,255,0.4)',
        touchAction: 'none', // prevents the page from scrolling while dragging
        pointerEvents: 'auto',
        zIndex: 6,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${KNOB_SIZE}px`,
          height: `${KNOB_SIZE}px`,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.6)',
          transform: `translate(calc(-50% + ${knobPos.x}px), calc(-50% + ${knobPos.y}px))`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
