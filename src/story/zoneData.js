// zoneData.js
// THE single source of truth for every zone's position/size numbers —
// deliberately a plain data file with ZERO imports of React, Three.js,
// or Rapier. This matters for code-splitting: UI components that only
// need "where is the river" (like MiniMap or ProgressTracker) must NOT
// import that position from River.jsx itself, because River.jsx also
// imports the Water shader and Rapier — pulling those heavy libraries
// back into the eager bundle even for a UI component that never
// actually renders 3D content.
//
// Component files (River.jsx, Garden.jsx, etc.) import FROM this file,
// not the other way around.

export const RIVER_POSITION = [12, 0.01, 0]; // slightly above 0 to avoid z-fighting with ground
export const RIVER_SIZE = [8, 20]; // [width, length]
export const RIVER_SURFACE_Y = 0.3; // roughly where the "water line" sits

export const SKATING_PATH_CENTER = [-10, 0.02, 0];
export const SKATING_PATH_RADIUS = 6;
export const SKATING_PATH_WIDTH = 2;

export const HOMESTEAD_CENTER = [0, 0, -18];

export const GARDEN_CENTER = [8, 0, -14];
const GARDEN_PLOT_SIZE = [1.5, 0.3, 1.5];
const GARDEN_GRID_ROWS = 3;
const GARDEN_GRID_COLS = 3;
const GARDEN_SPACING = 2;
export const PLOT_SIZE = GARDEN_PLOT_SIZE;

export const PLOT_POSITIONS = [];
for (let row = 0; row < GARDEN_GRID_ROWS; row++) {
  for (let col = 0; col < GARDEN_GRID_COLS; col++) {
    const localX = (col - (GARDEN_GRID_COLS - 1) / 2) * GARDEN_SPACING;
    const localZ = (row - (GARDEN_GRID_ROWS - 1) / 2) * GARDEN_SPACING;
    PLOT_POSITIONS.push([
      GARDEN_CENTER[0] + localX,
      GARDEN_CENTER[1],
      GARDEN_CENTER[2] + localZ,
    ]);
  }
}

// Position moved to x=20 (was x=16) after an audit found the platform's
// edge overlapped the river's sensor collider box — see git history.
export const MEDITATION_SPOT_POSITION = [20, 0, -10];

export const BUSH_AREA_CENTER = [-10, 0, -14];
const BUSH_OFFSETS = [
  [0, 0, 0.6],
  [1.2, 0, -0.3],
  [-1.4, 0, 0.2],
  [0.5, 0, 1.6],
  [-0.8, 0, -1.5],
  [1.8, 0, 1.1],
  [-2.0, 0, -0.6],
  [0.2, 0, -2.1],
];
export const BUSH_POSITIONS = BUSH_OFFSETS.map(([x, , z]) => [
  BUSH_AREA_CENTER[0] + x,
  BUSH_AREA_CENTER[1],
  BUSH_AREA_CENTER[2] + z,
]);
