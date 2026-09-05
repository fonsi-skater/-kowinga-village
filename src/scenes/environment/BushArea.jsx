// BushArea.jsx
// Placeholder wild bush/shrub area for Kowinga — scattered irregular
// clumps of green, deliberately messier/denser than the neat Garden grid,
// since this represents untended nature Fonsi "takes care of" rather than
// cultivated rows. Positions are slightly randomized for a natural feel.

export const BUSH_AREA_CENTER = [-10, 0, -14];

// Fixed pseudo-random offsets (not Math.random(), so the layout is stable
// across reloads instead of reshuffling every time the component mounts)
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

function Bush({ position, scale }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <sphereGeometry args={[0.7, 8, 8]} />
      <meshStandardMaterial color="#4a6b2f" />
    </mesh>
  );
}

export default function BushArea() {
  return (
    <group position={BUSH_AREA_CENTER}>
      {BUSH_OFFSETS.map(([x, y, z], i) => (
        <Bush
          key={`bush-${i}`}
          position={[x, 0.5, z]}
          // Slight scale variation per bush for a less uniform, wilder look
          scale={0.8 + (i % 3) * 0.2}
        />
      ))}
    </group>
  );
}
