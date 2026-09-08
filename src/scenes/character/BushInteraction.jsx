// BushInteraction.jsx
// Non-visual component: pressing E near an untended bush "tends" it
// (trims/cares for it), same interaction pattern as GardenInteraction —
// find the closest eligible target within range and act on it.

import { useGameStore } from '../../state/useGameStore';
import { useInteractKey } from '../../hooks/useInteractKey';
import { BUSH_POSITIONS } from '../../story/zoneData';
import { playSfx } from '../../audio/sfx/playSfx';

const INTERACT_RADIUS = 2.5;

export default function BushInteraction({ targetRef }) {
  const tendedBushes = useGameStore((state) => state.tendedBushes);
  const tendBush = useGameStore((state) => state.tendBush);
  const unlockAchievement = useGameStore((state) => state.unlockAchievement);

  useInteractKey(() => {
    if (!targetRef.current) return;
    const pos = targetRef.current.translation();

    let closestIndex = -1;
    let closestDistance = INTERACT_RADIUS;

    BUSH_POSITIONS.forEach((bushPos, index) => {
      if (tendedBushes.has(index)) return; // already tended, skip

      const dx = pos.x - bushPos[0];
      const dz = pos.z - bushPos[2];
      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== -1) {
      tendBush(closestIndex);
      playSfx('bush-tend');
      unlockAchievement('firstTend', '🌿 First bush tended!');
    }
  });

  return null;
}
