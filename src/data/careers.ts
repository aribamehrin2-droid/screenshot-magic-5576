export type SkillCategory = "Technical" | "Soft Skills" | "Tools";
export type Importance = "Essential" | "Important" | "Nice-to-have";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  importance: Importance;
  target: number; // 1-5
}

export interface Career {
  id: string;
  name: string;
  icon: string; // lucide icon name
  description: string;
  skills: Skill[];
}

export const LEVEL_LABELS = [
  "Not started",
  "Beginner",
  "Basic",
  "Intermediate",
  "Advanced",
  "Expert",
] as const;

export const IMPORTANCE_WEIGHT: Record<Importance, number> = {
  Essential: 3,
  Important: 2,
  "Nice-to-have": 1,
};

const s = (
  name: string,
  category: SkillCategory,
  importance: Importance,
  target: number,
): Skill => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name,
  category,
  importance,
  target,
});

export const CAREERS: Career[] = [
  {
    id: "software-developer",
    name: "Software Developer",
    icon: "Code2",
    description: "Build and ship web, mobile and backend software products.",
    skills: [
      s("Programming Fundamentals", "Technical", "Essential", 5),
      s("Data Structures & Algorithms", "Technical", "Essential", 4),
      s("Web Development", "Technical", "Essential", 4),
      s("Databases & SQL", "Technical", "Important", 4),
      s("Testing & Debugging", "Technical", "Important", 4),
      s("Git & Version Control", "Tools", "Essential", 4),
      s("Cloud & Deployment", "Tools", "Nice-to-have", 3),
      s("Problem Solving", "Soft Skills", "Essential", 5),
      s("Team Communication", "Soft Skills", "Important", 4),
      s("Code Review & Collaboration", "Soft Skills", "Nice-to-have", 3),
    ],
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    icon: "LineChart",
    description: "Turn messy data into models, insight and decisions.",
    skills: [
      s("Python for Data", "Technical", "Essential", 5),
      s("Statistics & Probability", "Technical", "Essential", 5),
      s("Machine Learning", "Technical", "Essential", 4),
      s("Data Wrangling", "Technical", "Important", 4),
      s("SQL & Data Modeling", "Technical", "Important", 4),
      s("Data Visualization", "Tools", "Important", 4),
      s("Notebooks & Experiment Tracking", "Tools", "Nice-to-have", 3),
      s("Business Understanding", "Soft Skills", "Important", 4),
      s("Storytelling with Data", "Soft Skills", "Essential", 4),
    ],
  },
  {
    id: "ux-designer",
    name: "UX Designer",
    icon: "PenTool",
    description: "Research, design and test experiences people love to use.",
    skills: [
      s("User Research", "Technical", "Essential", 5),
      s("Wireframing & Prototyping", "Technical", "Essential", 4),
      s("Interaction Design", "Technical", "Essential", 4),
      s("Visual & Layout Design", "Technical", "Important", 4),
      s("Accessibility", "Technical", "Important", 4),
      s("Figma", "Tools", "Essential", 4),
      s("Design Systems", "Tools", "Nice-to-have", 3),
      s("Empathy & Interviewing", "Soft Skills", "Essential", 4),
      s("Presenting Design Work", "Soft Skills", "Important", 4),
    ],
  },
  {
    id: "product-manager",
    name: "Product Manager",
    icon: "Compass",
    description: "Decide what to build, why it matters and when it ships.",
    skills: [
      s("Product Discovery", "Technical", "Essential", 5),
      s("Roadmapping & Prioritisation", "Technical", "Essential", 4),
      s("Metrics & Analytics", "Technical", "Important", 4),
      s("User Story Writing", "Technical", "Important", 4),
      s("Market & Competitor Research", "Technical", "Nice-to-have", 3),
      s("Analytics Tools", "Tools", "Important", 3),
      s("Roadmap & Tracking Tools", "Tools", "Nice-to-have", 3),
      s("Stakeholder Communication", "Soft Skills", "Essential", 5),
      s("Decision Making", "Soft Skills", "Essential", 4),
      s("Leadership Without Authority", "Soft Skills", "Important", 4),
    ],
  },
  {
    id: "digital-marketer",
    name: "Digital Marketer",
    icon: "Megaphone",
    description: "Grow audiences with content, campaigns and channels.",
    skills: [
      s("SEO Fundamentals", "Technical", "Essential", 4),
      s("Content Strategy", "Technical", "Essential", 4),
      s("Paid Advertising", "Technical", "Important", 4),
      s("Email & Lifecycle Marketing", "Technical", "Important", 3),
      s("Marketing Analytics", "Technical", "Essential", 4),
      s("Analytics & Ads Platforms", "Tools", "Important", 4),
      s("Design & Editing Tools", "Tools", "Nice-to-have", 3),
      s("Copywriting", "Soft Skills", "Essential", 4),
      s("Creative Thinking", "Soft Skills", "Important", 4),
    ],
  },
  {
    id: "cybersecurity-analyst",
    name: "Cybersecurity Analyst",
    icon: "ShieldCheck",
    description: "Defend systems, spot threats and respond to incidents.",
    skills: [
      s("Networking Fundamentals", "Technical", "Essential", 5),
      s("Operating Systems & Linux", "Technical", "Essential", 4),
      s("Threat Detection & Monitoring", "Technical", "Essential", 4),
      s("Incident Response", "Technical", "Important", 4),
      s("Cryptography Basics", "Technical", "Important", 3),
      s("SIEM & Security Tooling", "Tools", "Essential", 4),
      s("Scripting & Automation", "Tools", "Important", 3),
      s("Attention to Detail", "Soft Skills", "Essential", 5),
      s("Clear Incident Reporting", "Soft Skills", "Important", 4),
    ],
  },
  {
    id: "ai-ml-engineer",
    name: "AI/ML Engineer",
    icon: "BrainCircuit",
    description: "Train, evaluate and ship machine learning systems.",
    skills: [
      s("Python & Software Engineering", "Technical", "Essential", 5),
      s("Linear Algebra & Calculus", "Technical", "Essential", 4),
      s("Deep Learning", "Technical", "Essential", 4),
      s("Model Evaluation", "Technical", "Important", 4),
      s("Data Pipelines", "Technical", "Important", 4),
      s("PyTorch / TensorFlow", "Tools", "Essential", 4),
      s("MLOps & Deployment", "Tools", "Important", 3),
      s("Research Reading", "Soft Skills", "Important", 4),
      s("Explaining Models to Others", "Soft Skills", "Nice-to-have", 3),
    ],
  },
  {
    id: "mechanical-engineer",
    name: "Mechanical Engineer",
    icon: "Cog",
    description: "Design, simulate and manufacture physical systems.",
    skills: [
      s("Engineering Mechanics", "Technical", "Essential", 5),
      s("Thermodynamics & Fluids", "Technical", "Essential", 4),
      s("Materials & Manufacturing", "Technical", "Important", 4),
      s("Machine Design", "Technical", "Essential", 4),
      s("Finite Element Analysis", "Technical", "Nice-to-have", 3),
      s("CAD (SolidWorks/Fusion)", "Tools", "Essential", 4),
      s("Simulation Software", "Tools", "Important", 3),
      s("Technical Documentation", "Soft Skills", "Important", 4),
      s("Cross-team Collaboration", "Soft Skills", "Important", 4),
    ],
  },
];

export const CUSTOM_CAREER: Career = {
  id: "custom",
  name: "Custom career",
  icon: "Sparkles",
  description: "Not on the list? Define your own target role and skills.",
  skills: [],
};

export const getCareer = (id: string): Career | undefined =>
  id === "custom" ? CUSTOM_CAREER : CAREERS.find((c) => c.id === id);
