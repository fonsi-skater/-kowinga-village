// Homestead.jsx
// Placeholder homestead/community area for Kowinga — simple box/cylinder
// shapes standing in for huts and a livestock pen, positioned behind the
// spawn point (positive Z). Real Blender models replace these later; the
// physics/positioning approach stays the same either way.

import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { HOMESTEAD_CENTER } from '../../story/zoneData';

// A simple round hut: cylinder walls + cone roof
function Hut({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 2, 16]} />
        <meshStandardMaterial color="#c9a679" />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[2, 1.5, 16]} />
        <meshStandardMaterial color="#7a5230" />
      </mesh>
    </group>
  );
}

// A simple rectangular pen for livestock — corner/rail fencing, now with
// solid collision so Fonsi can't just walk through the fence lines.
// The ground patch inside stays walkable (no collider on the floor mesh).
function LivestockPen({ position }) {
  const size = [6, 4]; // [width, depth]
  const railHeight = 0.8;
  const railThickness = 0.1;

  return (
    <group position={position}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#8a6d3b" />
      </mesh>

      {/* RigidBody wraps all four fence rails as one solid physics group.
          colliders={false} + explicit CuboidCollider per rail because the
          two side rails are rotated 90° — an explicit collider with a
          matching rotation prop handles that correctly, same as the visual
          mesh does. */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider
          args={[size[0] / 2, railHeight / 2, railThickness / 2]}
          position={[0, 0.4, size[1] / 2]}
        />
        <CuboidCollider
          args={[size[0] / 2, railHeight / 2, railThickness / 2]}
          position={[0, 0.4, -size[1] / 2]}
        />
        <CuboidCollider
          args={[size[1] / 2, railHeight / 2, railThickness / 2]}
          position={[size[0] / 2, 0.4, 0]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <CuboidCollider
          args={[size[1] / 2, railHeight / 2, railThickness / 2]}
          position={[-size[0] / 2, 0.4, 0]}
          rotation={[0, Math.PI / 2, 0]}
        />

        {/* Visual fence rails — same positions as the colliders above */}
        <mesh position={[0, 0.4, size[1] / 2]} castShadow>
          <boxGeometry args={[size[0], railHeight, railThickness]} />
          <meshStandardMaterial color="#5c4326" />
        </mesh>
        <mesh position={[0, 0.4, -size[1] / 2]} castShadow>
          <boxGeometry args={[size[0], railHeight, railThickness]} />
          <meshStandardMaterial color="#5c4326" />
        </mesh>
        <mesh position={[size[0] / 2, 0.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[size[1], railHeight, railThickness]} />
          <meshStandardMaterial color="#5c4326" />
        </mesh>
        <mesh position={[-size[0] / 2, 0.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[size[1], railHeight, railThickness]} />
          <meshStandardMaterial color="#5c4326" />
        </mesh>
      </RigidBody>
    </group>
  );
}

export default function Homestead() {
  return (
    <group position={HOMESTEAD_CENTER}>
      {/* RigidBody wraps the huts so Fonsi can't walk through them */}
      <RigidBody type="fixed" colliders="cuboid">
        <Hut position={[-4, 0, 0]} />
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <Hut position={[4, 0, 0]} />
      </RigidBody>

      {/* Pen is walkable-around but not solid yet — just visual for now */}
      <LivestockPen position={[0, 0, 6]} />
    </group>
  );
}
