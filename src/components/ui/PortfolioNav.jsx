// PortfolioNav.jsx
// A small, unobtrusive floating nav — three buttons (About, Projects,
// Contact) that open the matching panel. Pure UI/UX overlay, no 3D
// changes involved. Positioned bottom-right so it doesn't compete with
// NarrationText (bottom-center) or the existing HUD elements.

import { useGameStore } from '../../state/useGameStore';

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

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        display: 'flex',
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
