import type { HudColorName, HudColorValue, HudColorOverrides, GradientConfig } from '../config.js';
import { DEFAULT_GRADIENT } from '../config.js';

export const RESET = '\x1b[0m';

const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const BRIGHT_BLUE = '\x1b[94m';
const BRIGHT_MAGENTA = '\x1b[95m';
const CLAUDE_ORANGE = '\x1b[38;5;208m';

const ANSI_BY_NAME: Record<HudColorName, string> = {
  dim: DIM,
  red: RED,
  green: GREEN,
  yellow: YELLOW,
  magenta: MAGENTA,
  cyan: CYAN,
  brightBlue: BRIGHT_BLUE,
  brightMagenta: BRIGHT_MAGENTA,
};

/** Convert a hex color string (#rrggbb) to a truecolor ANSI escape sequence. */
function hexToAnsi(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `\x1b[38;2;${r};${g};${b}m`;
}

/**
 * Resolve a color value to an ANSI escape sequence.
 * Accepts named presets, 256-color indices (0-255), or hex strings (#rrggbb).
 */
function resolveAnsi(value: HudColorValue | undefined, fallback: string): string {
  if (value === undefined || value === null) {
    return fallback;
  }
  if (typeof value === 'number') {
    return `\x1b[38;5;${value}m`;
  }
  if (typeof value === 'string' && value.startsWith('#') && value.length === 7) {
    return hexToAnsi(value);
  }
  return ANSI_BY_NAME[value as HudColorName] ?? fallback;
}

function colorize(text: string, color: string): string {
  return `${color}${text}${RESET}`;
}

function withOverride(text: string, value: HudColorValue | undefined, fallback: string): string {
  return colorize(text, resolveAnsi(value, fallback));
}

export function green(text: string): string {
  return colorize(text, GREEN);
}

export function yellow(text: string): string {
  return colorize(text, YELLOW);
}

export function red(text: string): string {
  return colorize(text, RED);
}

export function cyan(text: string): string {
  return colorize(text, CYAN);
}

export function magenta(text: string): string {
  return colorize(text, MAGENTA);
}

export function dim(text: string): string {
  return colorize(text, DIM);
}

export function claudeOrange(text: string): string {
  return colorize(text, CLAUDE_ORANGE);
}

export function model(text: string, colors?: Partial<HudColorOverrides>): string {
  return withOverride(text, colors?.model, CYAN);
}

export function project(text: string, colors?: Partial<HudColorOverrides>): string {
  return withOverride(text, colors?.project, YELLOW);
}

export function git(text: string, colors?: Partial<HudColorOverrides>): string {
  return withOverride(text, colors?.git, MAGENTA);
}

export function gitBranch(text: string, colors?: Partial<HudColorOverrides>): string {
  return withOverride(text, colors?.gitBranch, CYAN);
}

export function label(text: string, colors?: Partial<HudColorOverrides>): string {
  return withOverride(text, colors?.label, DIM);
}

export function custom(text: string, colors?: Partial<HudColorOverrides>): string {
  return withOverride(text, colors?.custom, CLAUDE_ORANGE);
}

export function warning(text: string, colors?: Partial<HudColorOverrides>): string {
  return colorize(text, resolveAnsi(colors?.warning, YELLOW));
}

export function critical(text: string, colors?: Partial<HudColorOverrides>): string {
  return colorize(text, resolveAnsi(colors?.critical, RED));
}

export function getContextColor(percent: number, colors?: Partial<HudColorOverrides>): string {
  if (percent >= 85) return resolveAnsi(colors?.critical, RED);
  if (percent >= 70) return resolveAnsi(colors?.warning, YELLOW);
  return resolveAnsi(colors?.context, GREEN);
}

export function getQuotaColor(percent: number, colors?: Partial<HudColorOverrides>): string {
  if (percent >= 90) return resolveAnsi(colors?.critical, RED);
  if (percent >= 75) return resolveAnsi(colors?.usageWarning, BRIGHT_MAGENTA);
  return resolveAnsi(colors?.usage, BRIGHT_BLUE);
}

function gradientColorAt(position: number, width: number, palette: string[]): string {
  if (palette.length === 0) return '';
  if (palette.length === 1) return hexToAnsi(palette[0]);
  if (width <= 1) return hexToAnsi(palette[0]);
  const idx = Math.round((position / (width - 1)) * (palette.length - 1));
  const clamped = Math.min(palette.length - 1, Math.max(0, idx));
  return hexToAnsi(palette[clamped]);
}

function getFilledCharAt(position: number, filledChar: string | string[]): string {
  if (Array.isArray(filledChar)) {
    if (filledChar.length === 0) return '●';
    return filledChar[position % filledChar.length];
  }
  return filledChar;
}

/**
 * Returns the gradient color of the last filled dot at the given percentage,
 * so accompanying text (e.g. "25%") matches the tip of the bar.
 * Falls back to the first gradient stop when no dot would be filled.
 */
export function getGradientTextColor(percent: number, width: number = 10, gradient: GradientConfig = DEFAULT_GRADIENT): string {
  const palette = gradient.colors.length > 0 ? gradient.colors : DEFAULT_GRADIENT.colors;
  const safeWidth = Number.isFinite(width) ? Math.max(1, Math.round(width)) : 10;
  const safePercent = Number.isFinite(percent) ? Math.min(100, Math.max(0, percent)) : 0;
  const filled = Math.round((safePercent / 100) * safeWidth);
  if (filled === 0) return hexToAnsi(palette[0]);
  return gradientColorAt(filled - 1, safeWidth, palette);
}

export function gradientBar(percent: number, width: number = 10, gradient: GradientConfig = DEFAULT_GRADIENT): string {
  const palette = gradient.colors.length > 0 ? gradient.colors : DEFAULT_GRADIENT.colors;
  const safeWidth = Number.isFinite(width) ? Math.max(0, Math.round(width)) : 0;
  const safePercent = Number.isFinite(percent) ? Math.min(100, Math.max(0, percent)) : 0;
  const filled = Math.round((safePercent / 100) * safeWidth);
  const empty = safeWidth - filled;

  let result = '';
  for (let i = 0; i < filled; i++) {
    result += `${gradientColorAt(i, safeWidth, palette)}${getFilledCharAt(i, gradient.filledChar)}${RESET}`;
  }
  if (empty > 0) {
    const emptyAnsi = resolveAnsi(gradient.emptyColor, DIM);
    result += `${emptyAnsi}${gradient.emptyChar.repeat(empty)}${RESET}`;
  }
  return result;
}

export function quotaBar(percent: number, width: number = 10, gradient: GradientConfig = DEFAULT_GRADIENT): string {
  return gradientBar(percent, width, gradient);
}

export function coloredBar(percent: number, width: number = 10, gradient: GradientConfig = DEFAULT_GRADIENT): string {
  return gradientBar(percent, width, gradient);
}
