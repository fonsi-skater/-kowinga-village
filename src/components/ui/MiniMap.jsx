// MiniMap.jsx
// A small top-down map showing each zone's location and Fonsi's live
// position — helps with orientation beyond just the floating 3D labels,
// especially useful from a distance where those labels are hard to read.

import { useGameStore } from '../../state/useGameStore';
import { ZONE_POSITIONS } from '../../story/zonePositions';

const MAP_SIZE = 130; // pixels
const WORLD_MIN = -25; // matches the ground's 50x50 extent (-25 to 25)
const WORLD_MAX = 25;

// Converts a world x/z coordinate into a pixel position on the map.
// Z maps to vertical position (forward/-z = up/north, matching how
// Fonsi's "forward" movement key decreases z).
function worldToMapPixels(x, z) {
  const px = ((x - WORLD_MIN) / (WORLD_MAX - WORLD_MIN)) * MAP_SIZE;
  const py = ((z - WORLD_MIN) / (WORLD_MAX - WORLD_MIN)) * MAP_SIZE;
  return { px, py };
}

const ZONE_COLORS = {
  river: '#2e6f9e',
  skatingPath: '#9a9a9a',
  homestead: '#c9a679',
  garden: '#5c3d21',
  meditationSpot: '#3d6b35',
  bushArea: '#4a6b2f',
};

export default function MiniMap() {
  const fonsiPos = useGameStore((state) => state.fonsiMapPosition);
  const fonsiPixel = worldToMapPixels(fonsiPos.x, fonsiPos.z);

  return (
    <div
      style={{
        position: 'absolute',
        top: '80px',
        left: '16px',
        width: `${MAP_SIZE}px`,
        height: `${MAP_SIZE}px`,
        background: 'rgba(0,0,0,0.45)',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '6px',
        pointerEvents: 'none',
      }}
    >
      {Object.entries(ZONE_POSITIONS).map(([zoneKey, pos]) => {
        const { px, py } = worldToMapPixels(pos[0], pos[2]);
        return (
          <div
            key={zoneKey}
            style={{
              position: 'absolute',
              left: `${px}px`,
              top: `${py}px`,
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: ZONE_COLORS[zoneKey],
              transform: 'translate(-50%, -50%)',
              border: '1px solid rgba(255,255,255,0.6)',
            }}
          />
        );
      })}

      {/* Fonsi's live position — slightly bigger and brighter to stand out */}
      <div
        style={{
          position: 'absolute',
          left: `${fonsiPixel.px}px`,
          top: `${fonsiPixel.py}px`,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#ff6f91',
          transform: 'translate(-50%, -50%)',
          border: '2px solid white',
          boxShadow: '0 0 6px rgba(255,111,145,0.8)',
        }}
      />
    </div>
  );
}
