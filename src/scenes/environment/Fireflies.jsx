// Fireflies.jsx
// Small glowing particles that fade in during the night portion of the
// day/night cycle and fade out during the day. Uses a single
// InstancedMesh (one draw call for all fireflies) for performance rather
// than dozens of individual mesh components.
//
// Positions are scattered once on mount (not every frame) — only their
// gentle bobbing motion and overall glow intensity update per frame.

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getDaylightAmount } from './dayNightUtils';

const COUNT = 45;
const AREA_HALF_SIZE = 15; // denser cluster than the full ground extent, more likely to be near wherever you're walking
const dummy = new THREE.Object3D(); // reused scratch object for matrix updates

export default function Fireflies() {
  const meshRef = useRef();

  // Generate each firefly's base position and a random phase offset (so
  // they don't all bob in perfect unison) ONCE, memoized rather than
  // recalculated every render.
  const fireflies = useMemo(() => {
    return Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * AREA_HALF_SIZE * 2,
      z: (Math.random() - 0.5) * AREA_HALF_SIZE * 2,
      baseY: 0.8 + Math.random() * 2, // floating height varies per firefly
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const daylight = getDaylightAmount(state.clock.elapsedTime);
    // Only visible at night — 1 - daylight gives 0 at full day, 1 at
    // full night. Setting the material's overall opacity this way means
    // ALL fireflies fade together, which reads as "fireflies appear at
    // night" rather than needing per-instance opacity (a much more
    // complex custom-shader approach not worth it for this effect).
    meshRef.current.material.opacity = Math.max(0, 1 - daylight * 1.4);

    fireflies.forEach((fly, i) => {
      const bob = Math.sin(state.clock.elapsedTime * 1.5 + fly.phase) * 0.3;
      dummy.position.set(fly.x, fly.baseY + bob, fly.z);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, COUNT]}>
      <sphereGeometry args={[0.18, 8, 8]} />
      <meshStandardMaterial
        color="#ffe89a"
        emissive="#ffe89a"
        emissiveIntensity={4}
        transparent
        opacity={0}
      />
    </instancedMesh>
  );
}
