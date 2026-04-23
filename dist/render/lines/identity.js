import { getContextPercent, getBufferedPercent, getTotalTokens } from '../../stdin.js';
import { coloredBar, critical, dim, label, getGradientTextColor, RESET } from '../colors.js';
import { getAdaptiveBarWidth } from '../../utils/terminal.js';
const DEBUG = process.env.DEBUG?.includes('prism-hud') || process.env.DEBUG === '*';
export function renderIdentityLine(ctx) {
    const rawPercent = getContextPercent(ctx.stdin);
    const bufferedPercent = getBufferedPercent(ctx.stdin);
    const autocompactMode = ctx.config?.display?.autocompactBuffer ?? 'enabled';
    const percent = autocompactMode === 'disabled' ? rawPercent : bufferedPercent;
    const colors = ctx.config?.colors;
    if (DEBUG && autocompactMode === 'disabled') {
        console.error(`[prism-hud:context] autocompactBuffer=disabled, showing raw ${rawPercent}% (buffered would be ${bufferedPercent}%)`);
    }
    const display = ctx.config?.display;
    const gradient = ctx.config?.gradient;
    const barWidth = getAdaptiveBarWidth();
    const contextValueMode = display?.contextValue ?? 'percent';
    const contextValue = formatContextValue(ctx, percent, contextValueMode);
    const contextValueDisplay = `${getGradientTextColor(percent, barWidth, gradient)}${contextValue}${RESET}`;
    const sigil = percent >= 85 ? `${critical('▲', colors)} ` : '';
    let line = display?.showContextBar !== false
        ? `${sigil}${label('ctx', colors)} ${coloredBar(percent, barWidth, gradient)} ${contextValueDisplay}`
        : `${sigil}${label('ctx', colors)} ${contextValueDisplay}`;
    if (display?.showTokenBreakdown !== false && percent >= 85) {
        const usage = ctx.stdin.context_window?.current_usage;
        if (usage) {
            const input = formatTokens(usage.input_tokens ?? 0);
            const cache = formatTokens((usage.cache_creation_input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0));
            line += ` ${dim('·')} ${label(`in ${input} cache ${cache}`, colors)}`;
        }
    }
    return line;
}
function formatTokens(n) {
    if (n >= 1000000) {
        return `${(n / 1000000).toFixed(1)}M`;
    }
    if (n >= 1000) {
        return `${(n / 1000).toFixed(0)}k`;
    }
    return n.toString();
}
function formatContextValue(ctx, percent, mode) {
    const totalTokens = getTotalTokens(ctx.stdin);
    const size = ctx.stdin.context_window?.context_window_size ?? 0;
    if (mode === 'tokens') {
        if (size > 0) {
            return `${formatTokens(totalTokens)}/${formatTokens(size)}`;
        }
        return formatTokens(totalTokens);
    }
    if (mode === 'both') {
        if (size > 0) {
            return `${percent}% · ${formatTokens(totalTokens)}/${formatTokens(size)}`;
        }
        return `${percent}%`;
    }
    if (mode === 'remaining') {
        return `${Math.max(0, 100 - percent)}%`;
    }
    // 'percent' mode: show plain % at low usage; auto-append used/total once
    // we cross 70% so the absolute headroom is visible when it matters.
    if (percent >= 70 && size > 0) {
        return `${percent}% · ${formatTokens(totalTokens)}/${formatTokens(size)}`;
    }
    return `${percent}%`;
}
//# sourceMappingURL=identity.js.map