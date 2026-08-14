// Arsenal, grouped tech (a grid, not progress bars).
// Full union of the SDE + Game Dev resumes (latest: "new sde", Aug 2026).
// Additive only: never drop a skill, only extend.

export interface SkillGroup {
  label: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Unreal Engine 5",
    items: [
      "Gameplay Frameworks",
      "Gameplay Ability System (GAS)",
      "Multiplayer & Server Architecture",
      "C++ Systems",
      "Blueprints",
      "Niagara VFX",
      "Sequencer & Cinematics",
      "Control Rig",
      "Rigging & Skinning",
      "Animation & IK Pipelines",
      "MetaHuman",
      "Datasmith CAD Pipeline",
      "Real-Time Rendering (Lumen / Nanite)",
      "Environmental Design",
    ],
  },
  {
    label: "Languages",
    items: ["C++", "TypeScript", "JavaScript", "Python", "C# (.NET)", "SQL", "Luau"],
  },
  {
    label: "Web & Mobile",
    items: [
      "Next.js 14",
      "React 19",
      "Capacitor (Android / iOS / PWA)",
      "Tailwind CSS",
      "HTML",
      "CSS",
      "Responsive Design",
      "Accessibility (WCAG-AA)",
    ],
  },
  {
    label: "Backend, APIs & Security",
    items: [
      "Node.js",
      "Express",
      "REST APIs",
      "Server-Sent Events",
      ".NET",
      "Prisma (ORM)",
      "JWT & HMAC Sessions",
      "RBAC",
      "Rate Limiting",
      "CSRF / CORS",
      "Razorpay",
    ],
  },
  {
    label: "Data & Infrastructure",
    items: [
      "PostgreSQL",
      "Supabase",
      "Redis",
      "NATS",
      "MinIO / S3",
      "Docker",
      "GitHub Actions (CI/CD)",
      "Vercel",
    ],
  },
  {
    label: "AI / ML",
    items: [
      "LangChain",
      "Retrieval-Augmented Generation (RAG)",
      "Model Context Protocol (MCP)",
      "AI Agent Orchestration",
      "AI Agent Frameworks",
      "Convai",
      "TensorFlow.js",
      "Generative AI",
    ],
  },
  {
    label: "CS Fundamentals",
    items: [
      "Object-Oriented Programming",
      "Data Structures & Algorithms",
      "System Design",
      "Networking",
      "Concurrency",
      "Databases",
    ],
  },
  {
    label: "Engines & Tools",
    items: [
      "Roblox Studio",
      "Git",
      "Vitest",
      "Blender",
      "Visual Studio",
      "Adobe Premiere Pro",
      "Adobe Photoshop",
      "FL Studio",
    ],
  },
];
