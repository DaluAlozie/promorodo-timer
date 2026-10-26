export type ColorPreset = { name: string; value: string };

export const DEFAULT_STUDY_COLOR = "#7aa679";
export const DEFAULT_BREAK_COLOR = "#d1b06d";

// Muted mid-tones so the light timer text stays readable on all of them
export const COLOR_PRESETS: ColorPreset[] = [
  { name: "Sage", value: DEFAULT_STUDY_COLOR },
  { name: "Teal", value: "#5fa8a0" },
  { name: "Sky", value: "#6f9fc7" },
  { name: "Slate", value: "#8496a9" },
  { name: "Lavender", value: "#9a8cc4" },
  { name: "Rose", value: "#c98a8a" },
  { name: "Coral", value: "#d99172" },
  { name: "Sand", value: DEFAULT_BREAK_COLOR },
];

export const HEX_COLOR = /^#[0-9a-f]{6}$/i;

// Hand-picked progress ring colours for the default backgrounds
const PROGRESS_COLORS: Record<string, string> = {
  [DEFAULT_STUDY_COLOR]: "#4b9c49",
  [DEFAULT_BREAK_COLOR]: "#d1a152",
};

// Progress ring colour for a background: the hand-picked one for the
// defaults, otherwise the background darkened by 25%
export function progressColor(background: string) {
  const color = background.toLowerCase();
  if (PROGRESS_COLORS[color]) return PROGRESS_COLORS[color];
  if (!HEX_COLOR.test(color)) return color;
  const darkened = [1, 3, 5].map((i) =>
    Math.round(parseInt(color.slice(i, i + 2), 16) * 0.75)
      .toString(16)
      .padStart(2, "0"),
  );
  return `#${darkened.join("")}`;
}
