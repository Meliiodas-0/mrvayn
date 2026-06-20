// Arsenal — grouped tech (a grid, not progress bars).
// TODO(MrVayn): confirm groupings; add Perforce/GAS/replication if relevant.

export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  { label: "Engines", items: ["Unreal Engine 5", "Roblox Studio"] },
  { label: "Languages", items: ["C++", "Luau", "JavaScript"] },
  {
    label: "Systems",
    items: ["Gameplay Frameworks", "Multiplayer + Server Architecture", "Sequencer + Cutscenes"],
  },
  { label: "VFX & CGI", items: ["Niagara VFX", "Real-time CGI", "Blender"] },
  { label: "Tools", items: ["Git", "Premiere Pro", "FL Studio", "Photoshop"] },
];
