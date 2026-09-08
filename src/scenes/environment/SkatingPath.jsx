// SkatingPath.jsx
// A looping path for Fonsi to skate around — purely visual for now.
// No physics body needed here: it sits flush on top of Ground, which
// already provides the walkable surface. We only add a separate physics
// body when something needs DIFFERENT behavior than plain ground (like
// River's sensor, which detects "entering water").

import { SKATING_PATH_CENTER, SKATING_PATH_RADIUS, SKATING_PATH_WIDTH } from '../../story/zoneData';

export default function SkatingPath() {
  return (
    <mesh
      position={SKATING_PATH_CENTER}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      {/* ringGeometry args: [innerRadius, outerRadius, segments] —
          the gap between inner/outer radius is the path's width. */}
      <ringGeometry
        args={[
          SKATING_PATH_RADIUS - SKATING_PATH_WIDTH / 2,
          SKATING_PATH_RADIUS + SKATING_PATH_WIDTH / 2,
          32,
        ]}
      />
      <meshStandardMaterial color="#8a8a8a" />
    </mesh>
  );
}
