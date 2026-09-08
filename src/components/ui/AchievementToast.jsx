// AchievementToast.jsx
// Small toast notification for individual "first time" achievements
// (first swim, first skate, etc.) — reads currentToast directly from
// the store (set/cleared by unlockAchievement's own timeout), so this
// component needs no local state or effect of its own.

import { useGameStore } from '../../state/useGameStore';

export default function AchievementToast() {
  const currentToast = useGameStore((state) => state.currentToast);

  return (
    <div
      style={{
        position: 'absolute',
        top: '110px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(143,214,148,0.9)',
        color: '#1e2a20',
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        padding: '8px 18px',
        borderRadius: '20px',
        pointerEvents: 'none',
        boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
        opacity: currentToast ? 1 : 0,
        transition: 'opacity 0.4s ease-in-out',
        zIndex: 8,
      }}
    >
      {currentToast}
    </div>
  );
}
