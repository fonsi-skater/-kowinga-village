// ProgressTracker.jsx
// Small HUD showing how many garden plots are planted and bushes tended,
// out of the known totals. Gives the player a sense of "things to do" and
// progress toward tending the whole village.

import { useGameStore } from '../../state/useGameStore';
import { PLOT_POSITIONS } from '../../scenes/environment/Garden';
import { BUSH_POSITIONS } from '../../scenes/environment/BushArea';

export default function ProgressTracker() {
  const plantedCount = useGameStore((state) => state.plantedPlots.size);
  const tendedCount = useGameStore((state) => state.tendedBushes.size);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
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
