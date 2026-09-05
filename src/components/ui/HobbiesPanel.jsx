// HobbiesPanel.jsx
// Shows a playful, colorful hobbies display in the middle of the screen
// while Fonsi is in the river zone. Reuses the existing isSwimming state
// (already true exactly when Fonsi overlaps the river's sensor collider)
// rather than building a separate proximity system.

import { useGameStore } from '../../state/useGameStore';
import { HOBBIES_CONTENT } from '../../story/portfolioContent';

// A distinct, vivid color per hobby badge, plus a slight rotation per
// badge for a playful "scattered" feel instead of a rigid straight line.
const BADGE_STYLES = [
  { color: '#ff6f91', rotate: '-6deg' },
  { color: '#ffd93d', rotate: '4deg' },
  { color: '#6fd6ff', rotate: '-3deg' },
  { color: '#8fd694', rotate: '6deg' },
  { color: '#c792ea', rotate: '-4deg' },
];

export default function HobbiesPanel() {
  const isSwimming = useGameStore((state) => state.isSwimming);

  if (!isSwimming) return null; // only show while actually in the river

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '18px',
        maxWidth: '600px',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    >
      {HOBBIES_CONTENT.items.map((hobby, i) => {
        const style = BADGE_STYLES[i % BADGE_STYLES.length];
        return (
          <div
            key={hobby}
            style={{
              background: style.color,
              color: '#1e1e1e',
              fontFamily: 'Georgia, serif',
              fontWeight: 'bold',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)',
              padding: '14px 26px',
              borderRadius: '999px',
              transform: `rotate(${style.rotate})`,
              boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
            }}
          >
            {hobby}
          </div>
        );
      })}
    </div>
  );
}
