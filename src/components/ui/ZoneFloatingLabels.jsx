// ZoneFloatingLabels.jsx
// Floating name labels anchored to each zone's actual 3D position,
// instead of a fixed screen-position overlay. Because these use drei's
// <Html> (which projects a 3D position onto screen space based on the
// camera), each label naturally appears wherever that zone actually is
// on screen — right beside the skating ring when you're near it, right
// over the river when you're near it — and never competes with the
// fixed-position SiteTitle at the top of the screen.
//
// This lives INSIDE the Canvas (Html must be a child of Canvas to access
// the camera/scene context), unlike our other UI components.

import { Html } from '@react-three/drei';
import { ZONE_POSITIONS } from '../../story/zonePositions';
import { ZONE_NAMES } from '../../story/zoneNames';

const LABEL_HEIGHT = 3; // units above ground, so labels float above zones instead of sitting in the dirt

export default function ZoneFloatingLabels() {
  return (
    <>
      {Object.entries(ZONE_POSITIONS).map(([zoneKey, position]) => (
        <Html
          key={zoneKey}
          position={[position[0], LABEL_HEIGHT, position[2]]}
          center
          // occlude="blending" would hide labels behind solid objects,
          // but distance-based fading (occlude not set) keeps things
          // simple and readable for now.
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              color: 'white',
              fontFamily: 'Georgia, serif',
              fontSize: '1rem',
              fontStyle: 'italic',
              textShadow: '0 2px 8px rgba(0,0,0,0.9)',
              background: 'rgba(0,0,0,0.35)',
              padding: '4px 14px',
              borderRadius: '20px',
              whiteSpace: 'nowrap',
            }}
          >
            📍 {ZONE_NAMES[zoneKey]}
          </div>
        </Html>
      ))}
    </>
  );
}
