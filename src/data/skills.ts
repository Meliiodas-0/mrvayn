// Arsenal — grouped tech (a grid, not progress bars).
// Full union of both résumés (SDE + Game Dev). Keep every skill represented.

export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Unreal Engine 5",
    items: [
      "Gameplay Frameworks",
      "Multiplayer & Server Architecture",
      "C++ Systems",
      "Blueprints",
      "Niagara VFX",
      "Sequencer & Cinematics",
      "Control Rig",
      "Rigging & Skinning",
      "Animation & IK Pipelines",
      "Real-Time Rendering",
      "Environmental Design",
    ],
  },
  {
    label: "Languages",
    items: ["C++", "TypeScript", "JavaScript", "Python", "C# (.NET)", "SQL", "Luau"],
  },
  {
    label: "Frontend",
    items: ["Next.js 14", "React.js", "Tailwind CSS", "HTML", "CSS", "Responsive Design", "Accessibility (WCAG-AA)"],
  },
  {
    label: "Backend & Cloud",
    items: ["Node.js", "REST APIs", ".NET", "Supabase", "PostgreSQL", "Prisma (ORM)", "RBAC", "Razorpay"],
  },
  {
    label: "AI / ML",
    items: ["LangChain", "Retrieval-Augmented Generation (RAG)", "AI Agent Frameworks", "Generative AI"],
  },
  {
    label: "CS Fundamentals",
    items: ["Object-Oriented Programming", "Data Structures & Algorithms", "System Design", "Networking", "Databases"],
  },
  {
    label: "Engines & Tools",
    items: ["Roblox Studio", "Git", "Blender", "Adobe Premiere Pro", "Adobe Photoshop", "FL Studio"],
  },
];
