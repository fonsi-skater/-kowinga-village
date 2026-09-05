// MeditationSpot.jsx
// Placeholder meditation spot for Kowinga — a large simple tree (trunk +
// canopy spheres) over a small raised platform, deliberately placed away
// from the skating/homestead noise, near the river for a calm edge-of-world
// feel. Real tree models come later; this proves positioning + mood first.

import { RigidBody } from '@react-three/rapier';

// Position moved to x=20 (was x=16) after an audit found the platform's
// edge overlapped the river's sensor collider box at the old position —
// that would have let standing on the platform also trigger isSwimming.
export const MEDITATION_SPOT_POSITION = [20, 0, -10];

function BigTree() {
  return (
    <group>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.6, 4, 10]} />
        <meshStandardMaterial color="#5c4326" />
      </mesh>
      {/* Canopy made of a few overlapping spheres for a fuller, less
          perfectly-round look than a single sphere */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <sphereGeometry args={[2.2, 12, 12]} />
        <meshStandardMaterial color="#3d6b35" />
      </mesh>
      <mesh position={[1, 4, 1]} castShadow>
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshStandardMaterial color="#3d6b35" />
      </mesh>
      <mesh position={[-1.2, 4.2, -0.8]} castShadow>
        <sphereGeometry args={[1.6, 12, 12]} />
        <meshStandardMaterial color="#3d6b35" />
      </mesh>
    </group>
  );
}

export default function MeditationSpot() {
  return (
    <group position={MEDITATION_SPOT_POSITION}>
      <BigTree />

      {/* A small raised circular platform to sit/meditate on, solid so
          Fonsi can stand on it */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <cylinderGeometry args={[1.8, 1.8, 0.2, 16]} />
          <meshStandardMaterial color="#d8c9a3" />
        </mesh>
      </RigidBody>
    </group>
  );
}
