# Changelog

All notable changes to **prism-hud** will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/). Versioning: [SemVer](https://semver.org/).

> prism-hud forked from [`jarrodwatts/claude-hud`](https://github.com/jarrodwatts/claude-hud) at upstream commit `30e1dfe` (post-0.0.11). Earlier upstream release notes are preserved in the [claude-hud CHANGELOG](https://github.com/jarrodwatts/claude-hud/blob/main/CHANGELOG.md).

## [0.1.3] - 2026-04-22

### Changed

- **Gradient palette upgraded from Tailwind 500 to Material Design Accent (A-series).** 0.1.2 used Tailwind's semantic 500 stops, which read as "flat UI muted" rather than the electric/neon/saturated style that shaped this plugin's visual identity (see the reference color `#09A5F7`). All 10 stops are now Material Accent A400/A700 values: same green → yellow → red traffic-light convention, but with ~90% saturation and uniform ~50% brightness, so each dot reads vivid and luminous instead of subdued.

## [0.1.2] - 2026-04-22

### Changed

- **Gradient reordered to traffic-light convention.** Previous 0.1.0 palette started at sky-blue (`#09A5F7`) and went through cyan/teal/green/yellow/red, which doesn't match industry semantics for progress bars. The new palette starts at green (`#10B981` emerald-500) and ends at red (`#DC2626` red-600), passing through lime / yellow / amber / orange in between. Every color is drawn from Tailwind's 400-600 semantic stops, matching how Grafana, CloudWatch, DataDog, and most dashboard tooling signal health.
- Text color still follows the last filled dot, so low-usage percentages now read green instead of blue.

## [0.1.1] - 2026-04-22

### Changed

- **Percentage text color now tracks the last filled dot.** Previously the "25%", "17%", etc. labels used a three-tier threshold color (green / yellow / red). Now they read the exact gradient color of the rightmost lit dot in the bar — 2 dots lit means the text is bright cyan, 7 dots lit means amber, 10 dots lit means bright red. Context / 5h Usage / 7d Usage / Memory labels all follow this rule.
- `getContextColor` and `getQuotaColor` are no longer used for text coloring; their bar-fill usage had already been superseded in 0.1.0.

## [0.1.0] - 2026-04-22

Initial release under the prism-hud name.

### Added

- **Per-position gradient progress bar.** All bars (Context, 5h Usage, 7d Usage) now render a fixed 10-step gradient — every dot has its own color, from cool sky-blue (`#09A5F7`) on the left to warm red (`#FF2020`) on the right. The user's fill level controls how many dots are lit; tension is communicated by how far the warm hues have reached, not by a threshold state machine flipping the whole bar to yellow/red.
- `NOTICE.md` documenting the fork relationship and scope of changes.

### Changed

- **Plugin namespace renamed** `claude-hud` → `prism-hud`:
  - Config directory: `~/.claude/plugins/prism-hud/`
  - Slash commands: `/prism-hud:setup`, `/prism-hud:configure`
  - Debug tags: `DEBUG=prism-hud` (also matches `DEBUG=*`)
- `LICENSE` updated to dual-copyright form (Jarrod Watts for the original engine, jiefeng.wang for the fork modifications). MIT terms unchanged.
- `README.md` rewritten to describe prism-hud's visual model, install flow, and fork origin.
- `package.json` / `.claude-plugin/plugin.json` / `.claude-plugin/marketplace.json` updated with the new name, author, repo URL, and description.

### Notes

- The `colors.context` / `colors.usage` / `colors.warning` / `colors.usageWarning` / `colors.critical` config entries **no longer influence the bar fill** (bars always render the gradient). They still color the percentage text next to each bar.
- Users migrating from `claude-hud` should move `~/.claude/plugins/claude-hud/config.json` → `~/.claude/plugins/prism-hud/config.json`; no schema changes.
