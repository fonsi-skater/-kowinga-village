// zonePositions.js
// Central mapping of zoneKey -> [x, y, z] world position, shared by
// anything that needs to check Fonsi's distance to a named zone
// (NarrationManager, ZoneLabelManager). Keeping this in ONE place means
// the six zone positions never drift out of sync between features.

import { RIVER_POSITION } from '../scenes/environment/River';
import { SKATING_PATH_CENTER } from '../scenes/environment/SkatingPath';
import { HOMESTEAD_CENTER } from '../scenes/environment/Homestead';
import { GARDEN_CENTER } from '../scenes/environment/Garden';
import { MEDITATION_SPOT_POSITION } from '../scenes/environment/MeditationSpot';
import { BUSH_AREA_CENTER } from '../scenes/environment/BushArea';

export const ZONE_POSITIONS = {
  river: RIVER_POSITION,
  skatingPath: SKATING_PATH_CENTER,
  homestead: HOMESTEAD_CENTER,
  garden: GARDEN_CENTER,
  meditationSpot: MEDITATION_SPOT_POSITION,
  bushArea: BUSH_AREA_CENTER,
};
