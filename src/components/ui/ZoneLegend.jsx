// ZoneLegend.jsx
// A small, always-visible list of every zone's playful name — helps a
// first-time visitor know what's out there to explore, so they're never
// wandering completely blind. Sits unobtrusively in a corner.

import { ZONE_NAMES } from '../../story/zoneNames';

export default function ZoneLegend() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '60px', // below ActivityStatus, which occupies top:16px in the same corner
        right: '16px',
        color: 'white',
        fontFamily: 'sans-serif',
        fontSize: '0.75rem',
        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
        pointerEvents: 'none',
        lineHeight: 1.6,
        textAlign: 'right',
        opacity: 0.85,
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>Explore:</div>
      {Object.values(ZONE_NAMES).map((name) => (
        <div key={name}>{name}</div>
      ))}
    </div>
  );
}
