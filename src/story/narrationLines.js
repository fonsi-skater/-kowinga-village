// narrationLines.js
// The actual narration text shown once when Fonsi first enters each zone.
// Keeping this as plain data (not JSX) means non-coders could eventually
// edit these lines without touching component logic, and it's an easy
// place to later swap in real voice-line filenames alongside the text.

export const NARRATION_LINES = {
  river: "The river moves the way his old ambitions used to \u2014 always forward, never in a hurry.",
  skatingPath: "Here, at least, momentum still belongs to him.",
  homestead: "Smoke, dust, familiar voices \u2014 the village never asked him to prove anything.",
  garden: "Dirt under his nails now, instead of code under his fingertips.",
  meditationSpot: "Under this tree, the noise in his head finally goes quiet.",
  bushArea: "Wild, untended, patient \u2014 the bush doesn't care what he used to do for a living.",
};

export const INTRO_NARRATION =
  "Fonsi once dreamed in code. When the machines learned to dream faster than he could, he came home to Kowinga.";
