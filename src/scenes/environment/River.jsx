// River.jsx
// Placeholder river for Kowinga village — a flat blue plane for now.
// Positioned off to one side of the ground so it reads as a distinct zone.
//
// The collider here is a "sensor" — sensors detect overlap (so we'll know
// when Fonsi enters the water) WITHOUT physically blocking or bouncing him,
// which is what we want for swimming (he should be able to go IN the water,
// not collide with it like a wall).

import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGameStore } from '../../state/useGameStore';

// Position and size are exported so other files (like a future "zones" map
// or minimap) can reference the same values instead of duplicating numbers.
export const RIVER_POSITION = [12, 0.01, 0]; // slightly above 0 to avoid z-fighting with ground
export const RIVER_SIZE = [8, 20]; // [width, length]
export const RIVER_SURFACE_Y = 0.3; // roughly where the "water line" sits

export default function River() {
  const setIsSwimming = useGameStore((state) => state.setIsSwimming);

  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Explicit cuboid collider matching the visual plane's footprint.
          `sensor` means it detects overlap without physically blocking
          Fonsi — exactly what we want for "entering" water rather than
          bumping into a wall. Half-extents: [halfWidth, halfHeight(thin), halfLength].

          onIntersectionEnter/Exit fire when ANY other collider (right now,
          just Fonsi) starts/stops overlapping this sensor — this is how
          we know to flip "isSwimming" on and off. */}
      <CuboidCollider
        args={[RIVER_SIZE[0] / 2, 0.5, RIVER_SIZE[1] / 2]}
        position={RIVER_POSITION}
        sensor
        onIntersectionEnter={() => setIsSwimming(true)}
        onIntersectionExit={() => setIsSwimming(false)}
      />
      <mesh position={RIVER_POSITION} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={RIVER_SIZE} />
        <meshStandardMaterial
          color="#2e6f9e"
          transparent
          opacity={0.85}
        />
      </mesh>
    </RigidBody>
  );
}
