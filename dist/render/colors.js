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
const ANSI_BY_NAME = {
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
function hexToAnsi(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `\x1b[38;2;${r};${g};${b}m`;
}
/**
 * Resolve a color value to an ANSI escape sequence.
 * Accepts named presets, 256-color indices (0-255), or hex strings (#rrggbb).
 */
function resolveAnsi(value, fallback) {
    if (value === undefined || value === null) {
        return fallback;
    }
    if (typeof value === 'number') {
        return `\x1b[38;5;${value}m`;
    }
    if (typeof value === 'string' && value.startsWith('#') && value.length === 7) {
        return hexToAnsi(value);
    }
    return ANSI_BY_NAME[value] ?? fallback;
}
function colorize(text, color) {
    return `${color}${text}${RESET}`;
}
function withOverride(text, value, fallback) {
    return colorize(text, resolveAnsi(value, fallback));
}
export function green(text) {
    return colorize(text, GREEN);
}
export function yellow(text) {
    return colorize(text, YELLOW);
}
export function red(text) {
    return colorize(text, RED);
}
export function cyan(text) {
    return colorize(text, CYAN);
}
export function magenta(text) {
    return colorize(text, MAGENTA);
}
export function dim(text) {
    return colorize(text, DIM);
}
export function claudeOrange(text) {
    return colorize(text, CLAUDE_ORANGE);
}
export function model(text, colors) {
    return withOverride(text, colors?.model, CYAN);
}
export function project(text, colors) {
    return withOverride(text, colors?.project, YELLOW);
}
export function git(text, colors) {
    return withOverride(text, colors?.git, MAGENTA);
}
export function gitBranch(text, colors) {
    return withOverride(text, colors?.gitBranch, CYAN);
}
export function label(text, colors) {
    return withOverride(text, colors?.label, DIM);
}
export function custom(text, colors) {
    return withOverride(text, colors?.custom, CLAUDE_ORANGE);
}
export function warning(text, colors) {
    return colorize(text, resolveAnsi(colors?.warning, YELLOW));
}
export function critical(text, colors) {
    return colorize(text, resolveAnsi(colors?.critical, RED));
}
export function getContextColor(percent, colors) {
    if (percent >= 85)
        return resolveAnsi(colors?.critical, RED);
    if (percent >= 70)
        return resolveAnsi(colors?.warning, YELLOW);
    return resolveAnsi(colors?.context, GREEN);
}
export function getQuotaColor(percent, colors) {
    if (percent >= 90)
        return resolveAnsi(colors?.critical, RED);
    if (percent >= 75)
        return resolveAnsi(colors?.usageWarning, BRIGHT_MAGENTA);
    return resolveAnsi(colors?.usage, BRIGHT_BLUE);
}
function gradientColorAt(position, width, palette) {
    if (palette.length === 0)
        return '';
    if (palette.length === 1)
        return hexToAnsi(palette[0]);
    if (width <= 1)
        return hexToAnsi(palette[0]);
    const idx = Math.round((position / (width - 1)) * (palette.length - 1));
    const clamped = Math.min(palette.length - 1, Math.max(0, idx));
    return hexToAnsi(palette[clamped]);
}
function getFilledCharAt(position, filledChar) {
    if (Array.isArray(filledChar)) {
        if (filledChar.length === 0)
            return '●';
        return filledChar[position % filledChar.length];
    }
    return filledChar;
}
/**
 * Returns the gradient color of the last filled dot at the given percentage,
 * so accompanying text (e.g. "25%") matches the tip of the bar.
 * Falls back to the first gradient stop when no dot would be filled.
 */
export function getGradientTextColor(percent, width = 10, gradient = DEFAULT_GRADIENT) {
    const palette = gradient.colors.length > 0 ? gradient.colors : DEFAULT_GRADIENT.colors;
    const safeWidth = Number.isFinite(width) ? Math.max(1, Math.round(width)) : 10;
    const safePercent = Number.isFinite(percent) ? Math.min(100, Math.max(0, percent)) : 0;
    const filled = Math.round((safePercent / 100) * safeWidth);
    if (filled === 0)
        return hexToAnsi(palette[0]);
    return gradientColorAt(filled - 1, safeWidth, palette);
}
function hexToRgb(hex) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    };
}
/**
 * Sample a color at a continuous palette position (0..palette.length-1),
 * linearly interpolating in RGB space between adjacent stops.
 */
function sampleGradientRgb(palette, position) {
    if (palette.length === 0)
        return { r: 0, g: 0, b: 0 };
    if (palette.length === 1)
        return hexToRgb(palette[0]);
    const clamped = Math.max(0, Math.min(palette.length - 1, position));
    const lo = Math.floor(clamped);
    const hi = Math.min(palette.length - 1, lo + 1);
    if (lo === hi)
        return hexToRgb(palette[lo]);
    const t = clamped - lo;
    const a = hexToRgb(palette[lo]);
    const b = hexToRgb(palette[hi]);
    return {
        r: a.r + (b.r - a.r) * t,
        g: a.g + (b.g - a.g) * t,
        b: a.b + (b.b - a.b) * t,
    };
}
function rgbToAnsi(r, g, b) {
    return `\x1b[38;2;${Math.round(r)};${Math.round(g)};${Math.round(b)}m`;
}
/**
 * Colors `text` with a gradient built from the *actual colors of the filled
 * bar dots*, in left-to-right order. Each character maps to a slot of the
 * lit-dot range and is colored by averaging the gradient across that slot,
 * so every lit color contributes — even when the text is shorter than the
 * number of lit dots (e.g. "45%" against 5 lit dots no longer skips c1/c3).
 */
export function gradientText(text, percent, width, gradient = DEFAULT_GRADIENT) {
    const palette = gradient.colors.length > 0 ? gradient.colors : DEFAULT_GRADIENT.colors;
    const chars = Array.from(text);
    if (chars.length === 0)
        return '';
    const safeWidth = Number.isFinite(width) ? Math.max(1, Math.round(width)) : 10;
    const safePercent = Number.isFinite(percent) ? Math.min(100, Math.max(0, percent)) : 0;
    const filled = Math.max(1, Math.round((safePercent / 100) * safeWidth));
    const subPalette = [];
    for (let i = 0; i < filled; i++) {
        const idx = palette.length === 1 || safeWidth === 1
            ? 0
            : Math.round((i / (safeWidth - 1)) * (palette.length - 1));
        subPalette.push(palette[Math.min(palette.length - 1, Math.max(0, idx))]);
    }
    const N = chars.length;
    const M = subPalette.length;
    const maxIndex = Math.max(0, M - 1);
    let result = '';
    let prevAnsi = '';
    for (let i = 0; i < N; i++) {
        // Slot spans a fraction of the gradient index range [0, M-1]. Averaging
        // across it (rather than sampling a single point) ensures intermediate
        // lit colors are represented even when N < M.
        const slotStart = (i / N) * maxIndex;
        const slotEnd = ((i + 1) / N) * maxIndex;
        const slotWidth = slotEnd - slotStart;
        const samples = Math.max(3, Math.min(16, Math.ceil(slotWidth) + 2));
        let r = 0, g = 0, b = 0;
        for (let s = 0; s < samples; s++) {
            const t = samples === 1 ? 0.5 : s / (samples - 1);
            const pos = slotStart + slotWidth * t;
            const rgb = sampleGradientRgb(subPalette, pos);
            r += rgb.r;
            g += rgb.g;
            b += rgb.b;
        }
        const ansi = rgbToAnsi(r / samples, g / samples, b / samples);
        if (ansi !== prevAnsi) {
            result += ansi;
            prevAnsi = ansi;
        }
        result += chars[i];
    }
    return result + RESET;
}
/**
 * Brightness factor for the boundary "ghost" cell — the partially-lit dot
 * that appears at the edge of the fill when `percent > 0` but no full dot
 * would have been rendered.
 *
 * Tuned so the ghost reads as the same hue family as full dots but slightly
 * brighter than the surrounding empty cells. sRGB scaling is non-linear
 * (perceived ≈ rgb^2.2), so values below ~0.55 sink darker than the empty
 * slate background and the dot reads as a different color rather than
 * "same green, dimmer".
 */
const GHOST_BRIGHTNESS = 0.65;
function ghostColorAt(position, width, palette) {
    if (palette.length === 0)
        return '';
    const hex = palette.length === 1 || width <= 1
        ? palette[0]
        : palette[Math.min(palette.length - 1, Math.max(0, Math.round((position / (width - 1)) * (palette.length - 1))))];
    const { r, g, b } = hexToRgb(hex);
    return `\x1b[38;2;${Math.round(r * GHOST_BRIGHTNESS)};${Math.round(g * GHOST_BRIGHTNESS)};${Math.round(b * GHOST_BRIGHTNESS)}m`;
}
export function gradientBar(percent, width = 10, gradient = DEFAULT_GRADIENT) {
    const palette = gradient.colors.length > 0 ? gradient.colors : DEFAULT_GRADIENT.colors;
    const safeWidth = Number.isFinite(width) ? Math.max(0, Math.round(width)) : 0;
    const safePercent = Number.isFinite(percent) ? Math.min(100, Math.max(0, percent)) : 0;
    const filled = Math.round((safePercent / 100) * safeWidth);
    // Always give the bar a visible starting point: when percent > 0 but the
    // rounded fill is 0, render a single dimmed dot at the head of the bar.
    const showBoundary = filled === 0 && safePercent > 0 && safeWidth >= 1;
    const empty = showBoundary ? safeWidth - 1 : safeWidth - filled;
    let result = '';
    for (let i = 0; i < filled; i++) {
        result += `${gradientColorAt(i, safeWidth, palette)}${getFilledCharAt(i, gradient.filledChar)}${RESET}`;
    }
    if (showBoundary) {
        result += `${ghostColorAt(0, safeWidth, palette)}${getFilledCharAt(0, gradient.filledChar)}${RESET}`;
    }
    if (empty > 0) {
        const emptyAnsi = resolveAnsi(gradient.emptyColor, DIM);
        result += `${emptyAnsi}${gradient.emptyChar.repeat(empty)}${RESET}`;
    }
    return result;
}
export function quotaBar(percent, width = 10, gradient = DEFAULT_GRADIENT) {
    return gradientBar(percent, width, gradient);
}
export function coloredBar(percent, width = 10, gradient = DEFAULT_GRADIENT) {
    return gradientBar(percent, width, gradient);
}
//# sourceMappingURL=colors.js.map