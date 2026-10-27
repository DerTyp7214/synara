// Deep imports from @material/material-color-utilities for the client bundle. The package's entry point
// re-exports everything, including classes with static initialisers that bundlers can't drop, which
// costs ~50 kB; its exports map has no subpaths, hence the relative path. Only what the cover tint needs.
export { Hct } from '../../../../node_modules/@material/material-color-utilities/hct/hct.js';
export { TonalPalette } from '../../../../node_modules/@material/material-color-utilities/palettes/tonal_palette.js';
export { QuantizerCelebi } from '../../../../node_modules/@material/material-color-utilities/quantize/quantizer_celebi.js';
export { Score } from '../../../../node_modules/@material/material-color-utilities/score/score.js';
export { argbFromRgb } from '../../../../node_modules/@material/material-color-utilities/utils/color_utils.js';
export { hexFromArgb } from '../../../../node_modules/@material/material-color-utilities/utils/string_utils.js';
