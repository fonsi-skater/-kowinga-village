// Garden.jsx
// Placeholder vegetable garden (shamba) for Kowinga — a grid of simple
// raised brown plots for now. Later this connects to Zustand state to
// track growth stages per plot as Fonsi "plants" and tends them.

import { useGameStore } from '../../state/useGameStore';
import { GARDEN_CENTER, PLOT_POSITIONS, PLOT_SIZE } from '../../story/zoneData';

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
