// Ground.jsx
// Placeholder terrain for Kowinga village.
// A flat plane for now — later we can add height variation, paths, and textures.
//
// Wrapped in a fixed RigidBody so it has a physics presence — without this,
// the visual ground would render but Fonsi would fall straight through it,
// since Rapier only knows about objects it's told to track.

import { RigidBody } from '@react-three/rapier';

export default function Ground() {
  return (
    // type="fixed" = never moves, never affected by forces (correct for terrain)
    <RigidBody type="fixed" colliders="cuboid">
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        {/* planeGeometry args: [width, height] in 3D units (meters, by convention) */}
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4c7a3a" />
      </mesh>
    </RigidBody>
  );
}
