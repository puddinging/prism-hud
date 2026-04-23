import { formatBytes } from '../../memory.js';
import { label, getGradientTextColor, quotaBar, RESET } from '../colors.js';
import { getAdaptiveBarWidth } from '../../utils/terminal.js';
export function renderMemoryLine(ctx) {
    const display = ctx.config?.display;
    const colors = ctx.config?.colors;
    const gradient = ctx.config?.gradient;
    if (ctx.config?.lineLayout !== 'expanded') {
        return null;
    }
    if (display?.showMemoryUsage !== true) {
        return null;
    }
    if (!ctx.memoryUsage) {
        return null;
    }
    const barWidth = getAdaptiveBarWidth();
    const memoryLabel = label('Approx RAM', colors);
    const percentColor = getGradientTextColor(ctx.memoryUsage.usedPercent, barWidth, gradient);
    const percent = `${percentColor}${ctx.memoryUsage.usedPercent}%${RESET}`;
    const bar = quotaBar(ctx.memoryUsage.usedPercent, barWidth, gradient);
    return `${memoryLabel} ${bar} ${formatBytes(ctx.memoryUsage.usedBytes)} / ${formatBytes(ctx.memoryUsage.totalBytes)} (${percent})`;
}
//# sourceMappingURL=memory.js.map