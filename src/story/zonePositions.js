// zonePositions.js
// Central mapping of zoneKey -> [x, y, z] world position, shared by
// anything that needs to check Fonsi's distance to a named zone
// (NarrationManager, ZoneLabelManager). Sources everything from
// zoneData.js — a plain data file with no heavy imports — rather than
// from the component files directly, so this stays safely importable
// from eager (non-lazy) UI code without dragging in Rapier/Three.js.

import {
  RIVER_POSITION,
  SKATING_PATH_CENTER,
  HOMESTEAD_CENTER,
  GARDEN_CENTER,
  MEDITATION_SPOT_POSITION,
  BUSH_AREA_CENTER,
} from './zoneData';

export const ZONE_POSITIONS = {
  river: RIVER_POSITION,
  skatingPath: SKATING_PATH_CENTER,
  homestead: HOMESTEAD_CENTER,
  garden: GARDEN_CENTER,
  meditationSpot: MEDITATION_SPOT_POSITION,
  bushArea: BUSH_AREA_CENTER,
};
