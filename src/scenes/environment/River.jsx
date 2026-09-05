// River.jsx
// Real animated water for Kowinga village, using Three.js's own Water
// shader (a reflective, rippling effect) instead of a flat plane.
// Positioned off to one side of the ground so it reads as a distinct zone.
//
// The collider here is a "sensor" — sensors detect overlap (so we'll know
// when Fonsi enters the water) WITHOUT physically blocking or bouncing him,
// which is what we want for swimming (he should be able to go IN the water,
// not collide with it like a wall).

import { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGameStore } from '../../state/useGameStore';

// Position and size are exported so other files (like a future "zones" map
// or minimap) can reference the same values instead of duplicating numbers.
export const RIVER_POSITION = [12, 0.01, 0]; // slightly above 0 to avoid z-fighting with ground
export const RIVER_SIZE = [8, 20]; // [width, length]
export const RIVER_SURFACE_Y = 0.3; // roughly where the "water line" sits

// Separate component for just the visual water surface — keeps the
// Water-specific setup (texture loading, per-frame time update) isolated
// from the physics/sensor logic below.
function WaterSurface() {
  // Loads the water ripple normal-map texture (public/textures/waternormals.jpg)
  const waterNormals = useLoader(THREE.TextureLoader, '/textures/waternormals.jpg');

  // useMemo so the Water object (and its expensive render-target setup)
  // is only created ONCE, not on every re-render — re-creating it every
  // render would be a serious performance problem and would also reset
  // the ripple animation constantly.
  const water = useMemo(() => {
    // RepeatWrapping lets the normal map tile seamlessly across the
    // water's surface instead of stretching one copy across it.
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

    const geometry = new THREE.PlaneGeometry(RIVER_SIZE[0], RIVER_SIZE[1]);

    const waterObj = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(0.5, 1, 0.3).normalize(),
      sunColor: 0xffffff,
      waterColor: 0x2e6f9e, // matches our original placeholder blue
      distortionScale: 3.0,
      fog: false,
    });

    waterObj.rotation.x = -Math.PI / 2;
    waterObj.position.set(...RIVER_POSITION);

    return waterObj;
  }, [waterNormals]);

  // Advance the water's internal "time" uniform every frame — this is
  // what actually animates the ripples; without this it would render as
  // a static (but still reflective) surface.
  useFrame((state, delta) => {
    water.material.uniforms['time'].value += delta;
  });

  // `primitive` is R3F's escape hatch for embedding a raw, non-JSX
  // Three.js object (like this Water instance) directly into the scene.
  return <primitive object={water} />;
}

export default function River() {
  const setIsSwimming = useGameStore((state) => state.setIsSwimming);

  return (
    <RigidBody type="fixed" colliders={false}>
      {/* Explicit cuboid collider matching the water's footprint.
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
      <WaterSurface />
    </RigidBody>
  );
}
