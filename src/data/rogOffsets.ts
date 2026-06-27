// Per-frame horizontal centering offsets (fraction of the drawn width) for the ROG
// sequence. ROG's body mass drifts ~14% of the frame width across the 144 frames as
// his pose/mace sway, so a single static nudge can't keep him centred — when the phone
// scrubs the sequence he visibly slides left↔right. offset[i] re-centres frame i's body
// mass (offset = 0.5 − smoothed alpha-weighted column-centroid fraction), so applying it
// at draw time keeps his centre of mass pinned to the middle and he animates IN PLACE.
// Generated from public/rog/f_*.webp (see scratchpad/rog_perframe.py); 3-tap smoothed.
export const ROG_OFFSETS: number[] = [
  0.0740, 0.0746, 0.0759, 0.0769, 0.0774, 0.0768, 0.0751, 0.0730, 0.0702, 0.0680,
  0.0690, 0.0695, 0.0672, 0.0594, 0.0468, 0.0281, 0.0075, -0.0067, -0.0131, -0.0144,
  -0.0170, -0.0151, -0.0110, -0.0052, -0.0014, 0.0003, 0.0021, 0.0023, 0.0025, 0.0038,
  0.0044, 0.0035, 0.0002, -0.0049, -0.0083, -0.0103, -0.0104, -0.0104, -0.0098, -0.0085,
  -0.0075, -0.0073, -0.0073, -0.0074, -0.0075, -0.0076, -0.0072, -0.0060, -0.0044, -0.0032,
  -0.0019, -0.0036, -0.0055, -0.0075, -0.0047, 0.0018, 0.0076, 0.0200, 0.0347, 0.0542,
  0.0684, 0.0726, 0.0762, 0.0760, 0.0786, 0.0751, 0.0746, 0.0875, 0.0766, 0.0676,
  0.0519, 0.0617, 0.0690, 0.0732, 0.0799, 0.0873, 0.0884, 0.0797, 0.0578, 0.0326,
  0.0047, -0.0057, 0.0104, 0.0473, 0.0814, 0.0940, 0.0872, 0.0774, 0.0705, 0.0770,
  0.0869, 0.0991, 0.1064, 0.1084, 0.1049, 0.1008, 0.0928, 0.0798, 0.0624, 0.0433,
  0.0244, 0.0037, -0.0127, -0.0175, -0.0070, 0.0139, 0.0375, 0.0571, 0.0727, 0.0858,
  0.0978, 0.1064, 0.1040, 0.0925, 0.0703, 0.0477, 0.0250, 0.0073, -0.0048, -0.0090,
  -0.0001, 0.0176, 0.0378, 0.0559, 0.0735, 0.0881, 0.0970, 0.0986, 0.0958, 0.0896,
  0.0801, 0.0705, 0.0640, 0.0633, 0.0670, 0.0722, 0.0775, 0.0846, 0.0898, 0.0924,
  0.0913, 0.0891, 0.0851, 0.0826,
];

// Fallback nudge if a frame index is somehow out of range (mean of the set).
export const ROG_OFFSET_MEAN = 0.0498;
