// FollowCamera.jsx
// A third-person camera that trails behind whatever RigidBody ref it's given.
// Instead of snapping directly to the target position (which feels jarring
// and robotic), we "lerp" (linearly interpolate) toward it each frame —
// this is the standard trick for smooth game cameras.

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// How far behind and above the character the camera sits.
const OFFSET = new THREE.Vector3(0, 4, 7);

// How quickly the camera "catches up" to its ideal position each frame.
// Lower = smoother/laggier, higher = snappier/more rigid. 0.1 is a common
// starting point — feel free to tune once you see it in action.
const SMOOTHING = 0.08;

export default function FollowCamera({ targetRef }) {
  const { camera } = useThree();
  // Reused vector objects (avoids creating new ones every frame, which
  // would pressure the garbage collector at 60fps — a common perf tip).
  const desiredPosition = new THREE.Vector3();
  const lookAtPosition = new THREE.Vector3();

  useFrame(() => {
    if (!targetRef.current) return;

    const targetPos = targetRef.current.translation(); // Rapier gives {x, y, z}

    desiredPosition.set(
      targetPos.x + OFFSET.x,
      targetPos.y + OFFSET.y,
      targetPos.z + OFFSET.z
    );

    // Smoothly move the camera toward the desired position instead of snapping
    camera.position.lerp(desiredPosition, SMOOTHING);

    // Always look at the character (slightly above their base, at "head" height)
    lookAtPosition.set(targetPos.x, targetPos.y + 1, targetPos.z);
    camera.lookAt(lookAtPosition);
  });

  return null; // this component only manipulates the camera, renders nothing itself
}
