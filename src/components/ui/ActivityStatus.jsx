// ActivityStatus.jsx
// Small HUD text showing Fonsi's current activity, if any — reads directly
// from the shared game store (isSwimming/isSkating/isMeditating). Only one
// of these should be true at a time given how Character.jsx prioritizes
// them, so we just check in the same priority order here.

import { useGameStore } from '../../state/useGameStore';

export default function ActivityStatus() {
  const isSwimming = useGameStore((state) => state.isSwimming);
  const isSkating = useGameStore((state) => state.isSkating);
  const isMeditating = useGameStore((state) => state.isMeditating);

  let label = null;
  if (isMeditating) label = 'Meditating...';
  else if (isSwimming) label = 'Swimming';
  else if (isSkating) label = 'Skating!';

  if (!label) return null; // nothing to show while just walking normally

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        color: 'white',
        fontFamily: 'sans-serif',
        fontSize: '0.95rem',
        fontWeight: 'bold',
        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        pointerEvents: 'none',
        background: 'rgba(0,0,0,0.35)',
        padding: '6px 12px',
        borderRadius: '6px',
      }}
    >
      {label}
    </div>
  );
}
