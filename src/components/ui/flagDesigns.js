// Signal-flag designs (design/flags.svg) on a 100×100 tile, shared by
// FlagPlaceholder and FlagWall. Each shape ends with its colour role:
// p plava, m modra, w bijela, b the tone's base (each component maps the
// roles to its own palette).
export const FLAG_DESIGNS = [
  [["rect", 0, 0, 100, 25, "p"], ["rect", 0, 25, 100, 25, "m"], ["rect", 0, 50, 100, 25, "p"], ["rect", 0, 75, 100, 25, "m"]],
  [["rect", 0, 0, 100, 100, "b"], ["rect", 40, 0, 20, 100, "p"], ["rect", 0, 40, 100, 20, "p"]],
  [["rect", 0, 0, 100, 100, "b"], ["poly", "0,0 100,0 0,100", "p"]],
  [["rect", 0, 0, 34, 100, "w"], ["rect", 34, 0, 33, 100, "m"], ["rect", 67, 0, 33, 100, "p"]],
  [["rect", 0, 0, 100, 100, "p"], ["poly", "0,0 14,0 100,86 100,100 86,100 0,14", "m"], ["poly", "100,0 100,14 14,100 0,100 0,86 86,0", "m"]],
  [["rect", 0, 0, 100, 100, "p"], ["rect", 22, 22, 56, 56, "m"], ["rect", 38, 38, 24, 24, "w"]],
  [["rect", 0, 0, 100, 100, "p"], ["circle", 50, 50, 24, "m"]],
  [["rect", 0, 0, 100, 100, "w"], ["poly", "0,100 100,0 100,100", "b"]],
];
