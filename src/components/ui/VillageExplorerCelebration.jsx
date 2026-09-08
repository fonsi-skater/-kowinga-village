// VillageExplorerCelebration.jsx
// A one-time congratulations overlay shown once the visitor has: visited
// all 6 zones, planted all 9 garden plots, and tended all 8 bushes.
// Uses hasCelebrated to make sure it only ever shows once per session,
// even though the completion conditions stay true afterward.

import { useEffect } from 'react';
import { useGameStore } from '../../state/useGameStore';
import { PLOT_POSITIONS, BUSH_POSITIONS } from '../../story/zoneData';

const TOTAL_ZONES = 6;

export default function VillageExplorerCelebration() {
  const playedZonesCount = useGameStore((state) => state.playedZones.size);
  const plantedCount = useGameStore((state) => state.plantedPlots.size);
  const tendedCount = useGameStore((state) => state.tendedBushes.size);
  const hasCelebrated = useGameStore((state) => state.hasCelebrated);
  const setHasCelebrated = useGameStore((state) => state.setHasCelebrated);

  const isComplete =
    playedZonesCount >= TOTAL_ZONES &&
    plantedCount >= PLOT_POSITIONS.length &&
    tendedCount >= BUSH_POSITIONS.length;

  // Only show ONCE: the moment completion first becomes true, mark
  // hasCelebrated so this effect (and the visible overlay) never
  // triggers again even though isComplete stays true afterward.
  const shouldShow = isComplete && !hasCelebrated;

  useEffect(() => {
    if (shouldShow) {
      // Small delay so the celebration doesn't feel like it's interrupting
      // whatever action (e.g. tending the last bush) just triggered it.
      const timer = setTimeout(() => setHasCelebrated(true), 4000);
      return () => clearTimeout(timer);
    }
  }, [shouldShow, setHasCelebrated]);

  if (!shouldShow) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 15,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: '#1e2a20',
          color: 'white',
          fontFamily: 'sans-serif',
          borderRadius: '12px',
          padding: '28px 36px',
          textAlign: 'center',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉</div>
        <h2 style={{ margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>
          Village Explorer!
        </h2>
        <p style={{ margin: 0, opacity: 0.85, maxWidth: '320px' }}>
          You've explored every corner of Kowinga, planted every plot, and
          tended every bush. Thanks for spending the time here with Fonsi.
        </p>
      </div>
    </div>
  );
}
