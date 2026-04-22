# Changelog

All notable changes to **prism-hud** will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/). Versioning: [SemVer](https://semver.org/).

> prism-hud forked from [`jarrodwatts/claude-hud`](https://github.com/jarrodwatts/claude-hud) at upstream commit `30e1dfe` (post-0.0.11). Earlier upstream release notes are preserved in the [claude-hud CHANGELOG](https://github.com/jarrodwatts/claude-hud/blob/main/CHANGELOG.md).

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
