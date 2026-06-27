// Theme presets, each overrides the design-token CSS variables (R G B triplets).
// Applied by ThemeControl; the default is also baked into :root (globals.css) so
// there's no flash for first-time visitors.

export interface Theme {
  id: string;
  name: string;
  /** three accent hexes for the picker swatch (purely cosmetic) */
  swatch: [string, string, string];
  /** css-var name -> "r g b" */
  vars: Record<string, string>;
}

export const DEFAULT_THEME = "mono"; // "Ghost", monochrome, set as the default look

export const themes: Theme[] = [
  {
    id: "wraith",
    name: "Wraith",
    swatch: ["#2DD4BF", "#38BDF8", "#A78BFA"],
    vars: {
      "--void": "6 9 16", "--carbon": "13 18 30", "--steel": "26 34 52",
      "--mist": "132 145 168", "--bone": "232 240 255",
      "--surge": "45 212 191", "--volt": "56 189 248", "--ion": "167 139 250",
    },
  },
  {
    id: "overdrive",
    name: "Overdrive",
    swatch: ["#FF2D6B", "#19E0FF", "#B26BFF"],
    vars: {
      "--void": "7 9 15", "--carbon": "14 19 32", "--steel": "26 34 51",
      "--mist": "138 148 167", "--bone": "234 240 255",
      "--surge": "255 45 107", "--volt": "25 224 255", "--ion": "178 107 255",
    },
  },
  {
    id: "necro",
    name: "Necro",
    swatch: ["#3FE68C", "#96FFC8", "#5AD2A0"],
    vars: {
      "--void": "8 14 10", "--carbon": "14 24 18", "--steel": "26 44 34",
      "--mist": "140 162 146", "--bone": "234 255 240",
      "--surge": "63 230 140", "--volt": "150 255 200", "--ion": "90 210 160",
    },
  },
  {
    id: "forge",
    name: "Forge",
    swatch: ["#FF8C32", "#FFC85A", "#FF6048"],
    vars: {
      "--void": "16 11 7", "--carbon": "26 18 12", "--steel": "46 32 22",
      "--mist": "168 150 132", "--bone": "255 244 232",
      "--surge": "255 140 50", "--volt": "255 200 90", "--ion": "255 96 72",
    },
  },
  {
    id: "crimson",
    name: "Crimson",
    swatch: ["#F03C48", "#FF8A80", "#C82C60"],
    vars: {
      "--void": "14 8 10", "--carbon": "24 13 16", "--steel": "44 24 28",
      "--mist": "168 140 145", "--bone": "255 236 238",
      "--surge": "240 60 72", "--volt": "255 138 128", "--ion": "200 44 96",
    },
  },
  {
    id: "mono",
    name: "Ghost",
    swatch: ["#E6ECF8", "#96A0B4", "#6C768C"],
    vars: {
      "--void": "8 9 12", "--carbon": "16 18 22", "--steel": "30 33 40",
      "--mist": "140 146 158", "--bone": "236 240 248",
      "--surge": "226 232 244", "--volt": "150 160 180", "--ion": "108 118 140",
    },
  },
  {
    id: "abyss",
    name: "Abyss",
    swatch: ["#22D3EE", "#38BDF8", "#5EEAD4"],
    vars: {
      "--void": "5 10 16", "--carbon": "10 18 28", "--steel": "20 34 50",
      "--mist": "128 148 170", "--bone": "228 240 255",
      "--surge": "34 211 238", "--volt": "56 189 248", "--ion": "94 234 212",
    },
  },
  {
    id: "vapor",
    name: "Vapor",
    swatch: ["#FF71CE", "#3CD9FE", "#B967FF"],
    vars: {
      "--void": "12 8 20", "--carbon": "20 14 32", "--steel": "40 28 56",
      "--mist": "168 150 185", "--bone": "248 236 255",
      "--surge": "255 113 206", "--volt": "60 217 254", "--ion": "185 103 255",
    },
  },
  {
    id: "royal",
    name: "Royal",
    swatch: ["#D4AF37", "#A78BFA", "#818CF8"],
    vars: {
      "--void": "12 10 18", "--carbon": "20 17 28", "--steel": "40 34 52",
      "--mist": "160 152 175", "--bone": "250 244 255",
      "--surge": "212 175 55", "--volt": "167 139 250", "--ion": "129 140 248",
    },
  },
  {
    id: "toxic",
    name: "Toxic",
    swatch: ["#BEF264", "#A3E635", "#D9F99D"],
    vars: {
      "--void": "10 14 8", "--carbon": "16 22 12", "--steel": "30 42 22",
      "--mist": "150 162 130", "--bone": "240 255 230",
      "--surge": "190 242 100", "--volt": "163 230 53", "--ion": "217 249 157",
    },
  },
  {
    id: "frost",
    name: "Frost",
    swatch: ["#7DD3FC", "#A5F3FC", "#818CF8"],
    vars: {
      "--void": "8 12 18", "--carbon": "14 20 30", "--steel": "28 38 54",
      "--mist": "140 152 172", "--bone": "236 244 255",
      "--surge": "125 211 252", "--volt": "165 243 252", "--ion": "129 140 248",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    swatch: ["#FB7185", "#FB923C", "#C084FC"],
    vars: {
      "--void": "16 10 14", "--carbon": "26 16 22", "--steel": "46 28 38",
      "--mist": "172 148 158", "--bone": "255 240 244",
      "--surge": "251 113 133", "--volt": "251 146 60", "--ion": "192 132 252",
    },
  },
];

export const themeById = (id: string) => themes.find((t) => t.id === id) ?? themes[0];
