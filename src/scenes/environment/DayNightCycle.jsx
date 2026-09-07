// DayNightCycle.jsx
// Continuously cycles the sky color and light intensities through a full
// day, purely for atmosphere — no new 3D objects, just animating existing
// lights and the background color. Runs on a repeating loop (not tied to
// real-world time) so every visitor actually sees the cycle happen.

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CYCLE_DURATION = 120; // seconds for one full day/night loop

// Colors at the extremes of the cycle
const NIGHT_SKY = new THREE.Color('#0a1128');
const DAY_SKY = new THREE.Color('#87ceeb');
const tempColor = new THREE.Color(); // reused each frame to avoid allocating

export default function DayNightCycle({ ambientRef, directionalRef }) {
  const { scene } = useThree();
  const elapsed = useRef(0);

  useFrame((state, delta) => {
    elapsed.current += delta;
    const t = (elapsed.current % CYCLE_DURATION) / CYCLE_DURATION; // 0..1

    // Smooth 0 (deep night) -> 1 (full day) -> 0 curve using sine, peaking
    // at the midpoint of the cycle instead of a linear/jarring transition.
    const daylight = Math.sin(t * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;

    // Sky color: lerp between night and day based on daylight amount
    tempColor.lerpColors(NIGHT_SKY, DAY_SKY, daylight);
    if (scene.background instanceof THREE.Color) {
      scene.background.copy(tempColor);
    } else {
      scene.background = tempColor.clone();
    }

    // Ambient light: dim at night, brighter in day
    if (ambientRef.current) {
      ambientRef.current.intensity = 0.15 + daylight * 0.55;
    }

    // Directional light ("sun"): dimmer + slightly blue-tinted at night
    // (moonlight feel), full warm intensity at midday
    if (directionalRef.current) {
      directionalRef.current.intensity = 0.1 + daylight * 1.0;
    }
  });

  return null; // this component only animates existing objects via refs
}
