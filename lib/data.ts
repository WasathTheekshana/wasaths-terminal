export const PROFILE = {
  name: "Wasath Theekshana",
  handle: "WasathTheekshana",
  title: "DevOps & Cloud Infrastructure Engineer",
  subtitle: "Security researcher · Open-source builder",
  location: "Colombo, Sri Lanka",
  greeting: "It's me Wasath. DevOps & Cloud Infrastructure Engineer from Sri Lanka.",
  bio: "I build scalable pipelines and write Terraform, after once breaking a whole company's infrastructure with a terraform destroy. Now I do it on purpose, with plans.",
  email: "wasath.vt@gmail.com",
  site: "https://wasath.site",
  blog: "https://blog.wasath.site",
  repo: "https://github.com/WasathTheekshana/wasaths-terminal",
  gpg: "9749 CC4F 66B3 2498 6BE1 1E91 D4D8 256B 2F48 9EA7",
} as const;

export const SOCIALS = [
  { key: "github", label: "GitHub", href: "https://github.com/WasathTheekshana", text: "github/WasathTheekshana" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/wasatht/", text: "linkedin/wasatht" },
  { key: "email", label: "Email", href: "mailto:wasath.vt@gmail.com", text: "wasath.vt@gmail.com" },
  { key: "blog", label: "Blog", href: "https://blog.wasath.site", text: "blog.wasath.site" },
  { key: "youtube", label: "YouTube", href: "https://www.youtube.com/@wasaththedev", text: "youtube/wasaththedev" },
  { key: "tiktok", label: "TikTok", href: "https://www.tiktok.com/@wasath_theekshana", text: "tiktok/wasath_theekshana" },
] as const;

export const EXPERIENCE = [
  {
    role: "DevOps Engineer",
    company: "NEXT",
    period: "Present",
    points: [
      "Infrastructure as Code with Terraform across Azure environments",
      "Manage Azure cloud resources, AKS clusters and CI/CD pipelines",
    ],
  },
  {
    role: "Open-source contributor",
    company: "FOSS NSBM",
    period: "Community",
    points: ["Part of the Free & Open Source Software community at NSBM"],
  },
] as const;

export const EDUCATION = [
  {
    degree: "MSc, Cyber Security",
    school: "University of Staffordshire",
    year: "2025",
    focus: "Digital forensics · Ethical hacking",
  },
  {
    degree: "BSc, Software Engineering",
    school: "University of Plymouth",
    year: "2020",
    focus: "Software engineering · Web development",
  },
] as const;

export type SkillGroup = { name: string; items: { label: string; level: number }[] };

export const SKILLS: SkillGroup[] = [
  {
    name: "Cloud & Infra",
    items: [
      { label: "Terraform", level: 95 },
      { label: "Azure", level: 90 },
      { label: "Kubernetes", level: 85 },
      { label: "Docker", level: 88 },
    ],
  },
  {
    name: "CI/CD",
    items: [
      { label: "GitHub Actions", level: 90 },
      { label: "Azure Pipelines", level: 88 },
      { label: "Jenkins", level: 70 },
    ],
  },
  {
    name: "Languages",
    items: [
      { label: "TypeScript", level: 88 },
      { label: "Go", level: 80 },
      { label: "Python", level: 72 },
      { label: "Rust", level: 45 },
    ],
  },
  {
    name: "Web",
    items: [
      { label: "Next.js", level: 88 },
      { label: "React", level: 88 },
      { label: "Node.js", level: 85 },
    ],
  },
  {
    name: "Security",
    items: [
      { label: "Ethical hacking", level: 70 },
      { label: "Digital forensics", level: 65 },
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  blurb: string;
  tags: string[];
  href: string;
  live?: string;
};

/** Curated showcase. Star counts are merged in at request time from the GitHub API. */
export const PROJECTS: Project[] = [
  {
    slug: "terragraph",
    name: "Terragraph",
    blurb: "Terraform visualizer for all kinds of problems, i guess :)",
    tags: ["Go", "Terrafrom", "IaC"],
    href: "https://github.com/WasathTheekshana/terragraph",
  },
  {
    slug: "pipcondition",
    name: "pipcondition",
    blurb: "Simulate Azure Pipelines YAML conditions and dependsOn graphs locally, no PR approvals needed.",
    tags: ["TypeScript", "Next.js", "Azure Pipelines"],
    href: "https://github.com/WasathTheekshana/pipcondition",
    live: "https://pipcondition.vercel.app",
  },
  {
    slug: "montrack",
    name: "montrack",
    blurb: "Open-source personal finance PWA: budgets, expenses and income in many currencies. All data stays on your device.",
    tags: ["TypeScript", "PWA"],
    href: "https://github.com/WasathTheekshana/montrack",
    live: "https://montrack.wasath.site",
  },
  {
    slug: "terragraph",
    name: "terragraph",
    blurb: "Terraform visualizer for all kinds of problems, written in Go.",
    tags: ["Go", "Terraform"],
    href: "https://github.com/WasathTheekshana/terragraph",
  },
  {
    slug: "tedo",
    name: "tedo",
    blurb: "Interactive CLI todo app on Bubble Tea, with vim keybindings and a calendar.",
    tags: ["Go", "TUI"],
    href: "https://github.com/WasathTheekshana/tedo",
  },
  {
    slug: "doctor-cd",
    name: "doctor-cd",
    blurb: "Pull-based continuous deployment for Docker Compose apps inside private networks.",
    tags: ["Go", "Docker", "CD"],
    href: "https://github.com/WasathTheekshana/doctor-cd",
  },
  {
    slug: "thisisforyou",
    name: "thisisforyou",
    blurb: "Build a digital flower bouquet from 12 flowers and share it by link. No account needed.",
    tags: ["Next.js", "Tailwind"],
    href: "https://github.com/WasathTheekshana/thisisforyou",
    live: "https://www.thisisforyou.live",
  },
  {
    slug: "salalihini-sandeshaya",
    name: "salalihini-sandeshaya",
    blurb: "සැළලිහිණි සංදේශය · The Starling's Message, a classical Sinhala poem brought to the web.",
    tags: ["TypeScript"],
    href: "https://github.com/WasathTheekshana/salalihini-sandeshaya",
    live: "https://salalihini-sandeshaya.vercel.app",
  },
  {
    slug: "azure-devsecops-pipeline",
    name: "azure-devsecops-pipeline",
    blurb: "DevSecOps pipeline on Azure, with Terraform-managed AKS clusters in sibling repos.",
    tags: ["Azure", "DevSecOps", "Terraform"],
    href: "https://github.com/WasathTheekshana/azure-devsecops-pipeline",
  },
  {
    slug: "nvim",
    name: "nvim · tmux · nixos",
    blurb: "My daily-driver dotfiles: Neovim, tmux and a reproducible NixOS setup.",
    tags: ["Lua", "Nix", "Shell"],
    href: "https://github.com/WasathTheekshana/nvim",
  },
  {
    slug: "adams-peak",
    name: "Adam's Peak Web",
    blurb: "Website for 'Sri Padaya', Sri Lanka's sacred mountain pilgrimage.",
    tags: ["Web"],
    href: "https://github.com/WasathTheekshana/adams-peak",
  },
];

export type Repo = {
  name: string;
  stars: number;
  language: string | null;
  pushedAt: string;
  description: string | null;
  url: string;
};
export type Post = { title: string; href: string; date?: string };
export type SiteData = { repos: Repo[]; posts: Post[]; followers: number | null; publicRepos: number | null };
