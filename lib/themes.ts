export const THEMES = [
  { id: "amber", label: "Amber terminal (original)", swatch: ["#f1c42c", "#e46a18"] },
  { id: "matrix", label: "Green phosphor", swatch: ["#39ff88", "#0b3d20"] },
  { id: "dracula", label: "Dracula", swatch: ["#bd93f9", "#ff79c6"] },
  { id: "nord", label: "Nord", swatch: ["#88c0d0", "#81a1c1"] },
  { id: "cyber", label: "Cyberpunk", swatch: ["#ff2bd6", "#00f0ff"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export const DEFAULT_THEME: ThemeId = "amber";
export const isTheme = (v: unknown): v is ThemeId => THEMES.some((t) => t.id === v);
