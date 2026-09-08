// ProgressTracker.jsx
// Small HUD showing how many garden plots are planted and bushes tended,
// out of the known totals. Gives the player a sense of "things to do" and
// progress toward tending the whole village.

import { useGameStore } from '../../state/useGameStore';
import { PLOT_POSITIONS, BUSH_POSITIONS } from '../../story/zoneData';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

export default function ProgressTracker() {
  const plantedCount = useGameStore((state) => state.plantedPlots.size);
  const tendedCount = useGameStore((state) => state.tendedBushes.size);
  const isTouchDevice = useIsTouchDevice();

  return (
    <div
      style={{
        position: 'absolute',
        // On touch devices, the joystick occupies bottom-left, so this
        // moves up out of the way instead of overlapping it.
        bottom: isTouchDevice ? '150px' : '16px',
        left: '16px',
        color: 'white',
        fontFamily: 'sans-serif',
        fontSize: '0.8rem',
        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        pointerEvents: 'none',
        lineHeight: 1.6,
      }}
    >
      Plots planted: {plantedCount}/{PLOT_POSITIONS.length}
      <br />
      Bushes tended: {tendedCount}/{BUSH_POSITIONS.length}
    </div>
  );
}
