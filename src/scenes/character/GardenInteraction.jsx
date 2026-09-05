// GardenInteraction.jsx
// Non-visual component: listens for the E key (via useInteractKey) and,
// when pressed, checks whether Fonsi is close enough to any garden plot
// to "plant" it. Lives inside the Canvas since it needs Fonsi's live
// position from the shared physics ref.

import { useGameStore } from '../../state/useGameStore';
import { useInteractKey } from '../../hooks/useInteractKey';
import { PLOT_POSITIONS } from '../environment/Garden';

const INTERACT_RADIUS = 2.5; // how close Fonsi must be to a plot to plant it

export default function GardenInteraction({ targetRef }) {
  const plantedPlots = useGameStore((state) => state.plantedPlots);
  const plantPlot = useGameStore((state) => state.plantPlot);

  useInteractKey(() => {
    if (!targetRef.current) return;
    const pos = targetRef.current.translation();

    // Find the closest UNPLANTED plot within range, if any.
    let closestIndex = -1;
    let closestDistance = INTERACT_RADIUS;

    PLOT_POSITIONS.forEach((plotPos, index) => {
      if (plantedPlots.has(index)) return; // already planted, skip

      const dx = pos.x - plotPos[0];
      const dz = pos.z - plotPos[2];
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== -1) {
      plantPlot(closestIndex);
    }
  });

  return null; // manages state only, renders nothing
}
