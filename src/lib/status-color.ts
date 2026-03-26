export const PALETTE = {
  green:  { bg: "rgba(0,198,162,0.15)",   color: "#00C6A2" },
  red:    { bg: "rgba(255,80,80,0.15)",   color: "#FF5050" },
  yellow: { bg: "rgba(255,180,0,0.15)",   color: "#FFB400" },
  blue:   { bg: "rgba(0,133,255,0.15)",   color: "#0085FF" },
  purple: { bg: "rgba(160,80,255,0.15)",  color: "#A050FF" },
  gray:   { bg: "rgba(160,160,160,0.15)", color: "#A0A0A0" },
} as const;

export type PaletteColor = typeof PALETTE[keyof typeof PALETTE];