// Character.jsx
// Placeholder Fonsi character: a capsule shape with physics.
// This will later be swapped for the real Blender-modeled character —
// the RigidBody wrapper and movement logic stay the same either way,
// so replacing the visual mesh later is a small, safe change.

import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { useKeyboardControls } from '../../hooks/useKeyboardControls';
import { useGameStore } from '../../state/useGameStore';
import { RIVER_SURFACE_Y } from '../environment/River';

const MOVE_SPEED = 4; // units per second, on land
const SWIM_SPEED = 2; // slower — water should feel heavier than walking
const SWIM_RISE_SPEED = 3; // how quickly Fonsi rises/settles toward the water surface
const SKATE_SPEED = 7; // faster — the whole point of the skating path

// Note: bodyRef is now passed IN from App.jsx (instead of created here)
// so the FollowCamera can read Fonsi's position too — both components
// need access to the same physics body reference.
export default function Character({ bodyRef }) {
  const movement = useKeyboardControls();
  const isSwimming = useGameStore((state) => state.isSwimming);
  const isSkating = useGameStore((state) => state.isSkating);
  const isMeditating = useGameStore((state) => state.isMeditating);

  // useFrame runs on every rendered frame (usually ~60 times/sec).
  // This is where we read current key state and push the character body.
  useFrame((state, delta) => {
    if (!bodyRef.current) return;

    // While meditating, Fonsi is deliberately still — ignore all movement
    // input entirely and let him settle to a stop (except gravity, so he
    // doesn't float if meditating mid-air somehow).
    if (isMeditating) {
      const currentVel = bodyRef.current.linvel();
      bodyRef.current.setLinvel({ x: 0, y: currentVel.y, z: 0 }, true);
      return;
    }

    const { forward, backward, left, right } = movement.current;

    // Build a direction vector from whichever keys are held.
    let x = 0;
    let z = 0;
    if (forward) z -= 1;
    if (backward) z += 1;
    if (left) x -= 1;
    if (right) x += 1;

    // Priority: swimming and skating shouldn't both apply at once in this
    // simple version (the zones don't overlap anyway) — swimming checked
    // first since entering water is the more "overriding" state.
    let speed = MOVE_SPEED;
    if (isSwimming) speed = SWIM_SPEED;
    else if (isSkating) speed = SKATE_SPEED;

    const currentVel = bodyRef.current.linvel();
    const currentPos = bodyRef.current.translation();

    // Vertical velocity: on land, let gravity behave normally (keep
    // whatever Rapier's gravity has already set). While swimming, instead
    // steer gently toward the water surface height — this is a very simple
    // stand-in for buoyancy, not a real fluid simulation.
    let y = currentVel.y;
    if (isSwimming) {
      const heightDiff = RIVER_SURFACE_Y - currentPos.y;
      // Move toward the surface proportionally to how far away we are —
      // this creates a gentle "settle at the surface" feel instead of
      // snapping instantly to one exact height.
      y = heightDiff * SWIM_RISE_SPEED;
    }

    if (x !== 0 || z !== 0) {
      // Normalize so diagonal movement isn't faster than straight movement
      const length = Math.sqrt(x * x + z * z);
      x = (x / length) * speed;
      z = (z / length) * speed;
      bodyRef.current.setLinvel({ x, y, z }, true);
    } else {
      // No movement key held — stop horizontal motion but keep
      // whatever vertical behavior we computed above.
      bodyRef.current.setLinvel({ x: 0, y, z: 0 }, true);
    }
  });

  return (
    // colliders={false} disables RigidBody's own shorthand auto-collider
    // detection (which only supports cuboid/ball/hull/trimesh, NOT capsule).
    // Instead we explicitly declare a CapsuleCollider as a child — this is
    // the correct way to get a capsule-shaped collider in this library.
    <RigidBody
      ref={bodyRef}
      position={[0, 2, 0]}
      enabledRotations={[false, false, false]} // prevent capsule from tipping over
      colliders={false}
    >
      {/* args: [halfHeight, radius] — half the cylindrical length, then radius.
          These should roughly match the visual capsuleGeometry below. */}
      <CapsuleCollider args={[0.5, 0.5]} />
      <mesh castShadow>
        <capsuleGeometry args={[0.5, 1, 8, 16]} />
        <meshStandardMaterial color="#d98e4a" />
      </mesh>
    </RigidBody>
  );
}
