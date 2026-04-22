# NOTICE

## Attribution

**prism-hud** is a fork of **[claude-hud](https://github.com/jarrodwatts/claude-hud)** by Jarrod Watts (MIT-licensed, Copyright © 2026 Jarrod Watts).

The upstream project provides the complete statusline engine, transcript parsing, rate-limit handling, and configuration system. This fork only replaces the progress-bar rendering logic and renames the plugin namespace; the vast majority of the codebase is Jarrod Watts' original work.

## What prism-hud changes

- **Per-position gradient progress bar.** All three bars (Context, 5h Usage, 7d Usage) now render each dot in its own color, cool-blue → warm-red, so tension is visible by how far the warm hues have crept in.
- **Plugin namespace renamed** from `claude-hud` to `prism-hud` (config directory, debug tags, command prefixes).
- **Default visual style** tuned to match a single reference color (`#09A5F7`).

No other engine behavior has been modified.

## License

Both the upstream and this fork are distributed under the MIT License. See [`LICENSE`](./LICENSE) for the full text and copyright holders.
