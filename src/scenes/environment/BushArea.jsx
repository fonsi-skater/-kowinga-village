// BushArea.jsx
// Placeholder wild bush/shrub area for Kowinga — scattered irregular
// clumps of green, deliberately messier/denser than the neat Garden grid,
// since this represents untended nature Fonsi "takes care of" rather than
// cultivated rows. Positions are slightly randomized for a natural feel.

import { useGameStore } from '../../state/useGameStore';
import { BUSH_AREA_CENTER } from '../../story/zoneData';

// Fixed pseudo-random offsets (not Math.random(), so the layout is stable
// across reloads instead of reshuffling every time the component mounts).
// Kept here (not in zoneData.js) since it's only needed for this
// component's own relative-position render loop below — BUSH_POSITIONS
// (the absolute version other files need) is computed once in zoneData.js
// from this same shape of data.
const BUSH_OFFSETS = [
  [0, 0, 0.6],
  [1.2, 0, -0.3],
  [-1.4, 0, 0.2],
  [0.5, 0, 1.6],
  [-0.8, 0, -1.5],
  [1.8, 0, 1.1],
  [-2.0, 0, -0.6],
  [0.2, 0, -2.1],
];

function Bush({ position, scale, index }) {
  // "Tended" bushes (trimmed/cared for by Fonsi) turn a brighter, tidier
  // green and shrink slightly — a small but visible sign of care, same
  // spirit as a planted garden plot changing color.
  const isTended = useGameStore((state) => state.tendedBushes.has(index));

  return (
    <mesh
      position={position}
      scale={isTended ? scale * 0.85 : scale}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.7, 8, 8]} />
      <meshStandardMaterial color={isTended ? '#6fa84a' : '#4a6b2f'} />
    </mesh>
  );
}

export default function BushArea() {
  return (
    <group position={BUSH_AREA_CENTER}>
      {BUSH_OFFSETS.map(([x, _y, z], i) => (
        <Bush
          key={`bush-${i}`}
          index={i}
          position={[x, 0.5, z]}
          // Slight scale variation per bush for a less uniform, wilder look
          scale={0.8 + (i % 3) * 0.2}
        />
      ))}
    </group>
  );
}
