var difficulty = 1;
var size = 6 + difficulty;
var direction_s = [
  { x: 0, y: 1 },
  { x: 1, y: 1 },
  { x: 1, y: 0 },
  { x: 1, y: -1 },
  { x: 0, y: -1 },
  { x: -1, y: -1 },
  { x: -1, y: 0 },
  { x: -1, y: 1 },
];
var selected_pos = { x: 0, y: 0 };
var num_pegs_left = 0;

export { difficulty };
export { size };
export { direction_s };
export { selected_pos };
export { num_pegs_left };
