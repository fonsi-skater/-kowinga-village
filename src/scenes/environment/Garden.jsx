// Garden.jsx
// Placeholder vegetable garden (shamba) for Kowinga — a grid of simple
// raised brown plots for now. Later this connects to Zustand state to
// track growth stages per plot as Fonsi "plants" and tends them.

import { useGameStore } from '../../state/useGameStore';

export const GARDEN_CENTER = [8, 0, -14];

const PLOT_SIZE = [1.5, 0.3, 1.5]; // [width, height, depth]
const GRID_ROWS = 3;
const GRID_COLS = 3;
const SPACING = 2; // distance between plot centers

// Absolute world-space positions of every plot, computed once and exported
// so other components (like an interaction manager) can check Fonsi's
// distance to each one without duplicating this grid math.
export const PLOT_POSITIONS = [];
for (let row = 0; row < GRID_ROWS; row++) {
  for (let col = 0; col < GRID_COLS; col++) {
    const localX = (col - (GRID_COLS - 1) / 2) * SPACING;
    const localZ = (row - (GRID_ROWS - 1) / 2) * SPACING;
    PLOT_POSITIONS.push([
      GARDEN_CENTER[0] + localX,
      GARDEN_CENTER[1],
      GARDEN_CENTER[2] + localZ,
    ]);
  }
}

function Plot({ position, index }) {
  // Reading planted state per-plot from the shared store — when Fonsi
  // "plants" this specific plot (handled by GardenInteraction.jsx), its
  // color changes from bare soil to a green sprout to give visible feedback.
  const isPlanted = useGameStore((state) => state.plantedPlots.has(index));

  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={PLOT_SIZE} />
      <meshStandardMaterial color={isPlanted ? '#4a7c3a' : '#5c3d21'} />
    </mesh>
  );
}

export default function Garden() {
  return (
    <group position={GARDEN_CENTER}>
      {/* Plots are low enough that Fonsi can walk over them without a
          dedicated collider for now. Position here is LOCAL (relative to
          the group's GARDEN_CENTER offset), matching PLOT_POSITIONS' math
          but expressed relative instead of absolute. */}
      {PLOT_POSITIONS.map((absPos, index) => (
        <Plot
          key={`plot-${index}`}
          index={index}
          position={[
            absPos[0] - GARDEN_CENTER[0],
            PLOT_SIZE[1] / 2,
            absPos[2] - GARDEN_CENTER[2],
          ]}
        />
      ))}
    </group>
  );
}
