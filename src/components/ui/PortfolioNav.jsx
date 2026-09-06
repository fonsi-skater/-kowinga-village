// PortfolioNav.jsx
// A small, unobtrusive floating nav — three buttons (About, Projects,
// Contact) that open the matching panel. Pure UI/UX overlay, no 3D
// changes involved. Positioned bottom-right so it doesn't compete with
// NarrationText (bottom-center) or the existing HUD elements.

import { useGameStore } from '../../state/useGameStore';
import { useIsTouchDevice } from '../../hooks/useIsTouchDevice';

const buttonStyle = {
  background: 'rgba(0,0,0,0.55)',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: '6px',
  padding: '8px 16px',
  fontFamily: 'sans-serif',
  fontSize: '0.85rem',
  cursor: 'pointer',
  pointerEvents: 'auto',
};

export default function PortfolioNav() {
  const setActivePanel = useGameStore((state) => state.setActivePanel);
  const isTouchDevice = useIsTouchDevice();

  return (
    <div
      style={{
        position: 'absolute',
        // On touch devices, the interact button occupies bottom-right,
        // so this moves up out of the way instead of overlapping it.
        bottom: isTouchDevice ? '150px' : '16px',
        right: '16px',
        display: 'flex',
        // Stack vertically on touch/narrow screens — three buttons side
        // by side get cramped on a phone-width viewport.
        flexDirection: isTouchDevice ? 'column' : 'row',
        gap: '8px',
        pointerEvents: 'none', // container itself doesn't block canvas drags
      }}
    >
      <button style={buttonStyle} onClick={() => setActivePanel('about')}>
        About
      </button>
      <button style={buttonStyle} onClick={() => setActivePanel('projects')}>
        Projects
      </button>
      <button style={buttonStyle} onClick={() => setActivePanel('contact')}>
        Contact
      </button>
    </div>
  );
}
