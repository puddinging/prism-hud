export type LineLayoutType = 'compact' | 'expanded';
export type AutocompactBufferMode = 'enabled' | 'disabled';
export type ContextValueMode = 'percent' | 'tokens' | 'remaining' | 'both';
export type HudElement = 'project' | 'context' | 'usage' | 'memory' | 'environment' | 'tools' | 'agents' | 'todos';
export type HudColorName = 'dim' | 'red' | 'green' | 'yellow' | 'magenta' | 'cyan' | 'brightBlue' | 'brightMagenta';
/** A color value: named preset, 256-color index (0-255), or hex string (#rrggbb). */
export type HudColorValue = HudColorName | number | string;
export interface HudColorOverrides {
    context: HudColorValue;
    usage: HudColorValue;
    warning: HudColorValue;
    usageWarning: HudColorValue;
    critical: HudColorValue;
    model: HudColorValue;
    project: HudColorValue;
    git: HudColorValue;
    gitBranch: HudColorValue;
    label: HudColorValue;
    custom: HudColorValue;
}
/**
 * Per-bar gradient configuration.
 * - `colors`: hex palette sampled by dot position across the bar width.
 *   Any length ≥ 1 works — shorter arrays get sampled, longer ones also.
 * - `filledChar`: string uses the same char for every filled dot;
 *   array assigns a char per dot position (cycles if shorter than width).
 * - `emptyChar` / `emptyColor`: glyph + color for unfilled dots.
 */
export interface GradientConfig {
    colors: string[];
    filledChar: string | string[];
    emptyChar: string;
    emptyColor: HudColorValue;
}
export declare const DEFAULT_ELEMENT_ORDER: HudElement[];
export interface HudConfig {
    lineLayout: LineLayoutType;
    showSeparators: boolean;
    pathLevels: 1 | 2 | 3;
    elementOrder: HudElement[];
    gitStatus: {
        enabled: boolean;
        showDirty: boolean;
        showAheadBehind: boolean;
        showFileStats: boolean;
    };
    display: {
        showModel: boolean;
        showProject: boolean;
        showContextBar: boolean;
        contextValue: ContextValueMode;
        showConfigCounts: boolean;
        showDuration: boolean;
        showSpeed: boolean;
        showTokenBreakdown: boolean;
        showUsage: boolean;
        usageBarEnabled: boolean;
        showTools: boolean;
        showAgents: boolean;
        showTodos: boolean;
        showSessionName: boolean;
        showClaudeCodeVersion: boolean;
        showMemoryUsage: boolean;
        autocompactBuffer: AutocompactBufferMode;
        usageThreshold: number;
        sevenDayThreshold: number;
        environmentThreshold: number;
        customLine: string;
    };
    colors: HudColorOverrides;
    gradient: GradientConfig;
}
export declare const DEFAULT_CONFIG: HudConfig;
export declare const DEFAULT_GRADIENT: GradientConfig;
export declare function getConfigPath(): string;
export declare function mergeConfig(userConfig: Partial<HudConfig>): HudConfig;
export declare function loadConfig(): Promise<HudConfig>;
//# sourceMappingURL=config.d.ts.map