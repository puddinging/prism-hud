import type { HudColorOverrides, GradientConfig } from '../config.js';
export declare const RESET = "\u001B[0m";
export declare function green(text: string): string;
export declare function yellow(text: string): string;
export declare function red(text: string): string;
export declare function cyan(text: string): string;
export declare function magenta(text: string): string;
export declare function dim(text: string): string;
export declare function claudeOrange(text: string): string;
export declare function model(text: string, colors?: Partial<HudColorOverrides>): string;
export declare function project(text: string, colors?: Partial<HudColorOverrides>): string;
export declare function git(text: string, colors?: Partial<HudColorOverrides>): string;
export declare function gitBranch(text: string, colors?: Partial<HudColorOverrides>): string;
export declare function label(text: string, colors?: Partial<HudColorOverrides>): string;
export declare function custom(text: string, colors?: Partial<HudColorOverrides>): string;
export declare function warning(text: string, colors?: Partial<HudColorOverrides>): string;
export declare function critical(text: string, colors?: Partial<HudColorOverrides>): string;
export declare function getContextColor(percent: number, colors?: Partial<HudColorOverrides>): string;
export declare function getQuotaColor(percent: number, colors?: Partial<HudColorOverrides>): string;
/**
 * Returns the gradient color of the last filled dot at the given percentage,
 * so accompanying text (e.g. "25%") matches the tip of the bar.
 * Falls back to the first gradient stop when no dot would be filled.
 */
export declare function getGradientTextColor(percent: number, width?: number, gradient?: GradientConfig): string;
/**
 * Colors `text` with a gradient built from the *actual colors of the filled
 * bar dots*, in left-to-right order. Text characters interpolate continuously
 * between those colors. If only one dot is filled, the text is that single
 * color (no gradient — that's fine).
 */
export declare function gradientText(text: string, percent: number, width: number, gradient?: GradientConfig): string;
export declare function gradientBar(percent: number, width?: number, gradient?: GradientConfig): string;
export declare function quotaBar(percent: number, width?: number, gradient?: GradientConfig): string;
export declare function coloredBar(percent: number, width?: number, gradient?: GradientConfig): string;
//# sourceMappingURL=colors.d.ts.map