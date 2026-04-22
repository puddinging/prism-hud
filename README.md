# prism-hud

A Claude Code statusline HUD with a **per-position gradient progress bar** — each dot is its own color, from cool sky-blue on the left to warm red on the right. As your Context / Usage fills up, the warmer colors naturally appear from the right side, so how "tense" things are is obvious at a glance.

> **Fork notice.** prism-hud is forked from **[jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud)** (MIT-licensed). Engine, transcript parsing, rate-limit handling, and configuration system are the original author's work. See [`NOTICE.md`](./NOTICE.md) for full attribution.

## What's different from upstream

- **Gradient bar rendering.** All bars (Context, 5h Usage, 7d Usage) use a fixed 10-step palette — each dot has its own color. The user's fill level decides how many dots are lit; the colors don't change based on percentage, they change based on *position*.
- **Plugin namespace renamed** to `prism-hud`. Config now lives at `~/.claude/plugins/prism-hud/config.json`. Slash commands become `/prism-hud:setup`, `/prism-hud:configure`.

## Gradient palette (10 steps)

| Pos | Hex | Name |
|-----|-----|------|
| 1 | `#09A5F7` | sky blue |
| 2 | `#00BEE8` | bright cyan |
| 3 | `#00D5C4` | cyan-teal |
| 4 | `#00E094` | teal-green |
| 5 | `#5FDD3A` | lime-green |
| 6 | `#C8D220` | lemon |
| 7 | `#F2B81A` | amber |
| 8 | `#FF8A00` | orange |
| 9 | `#FF5020` | red-orange |
| 10 | `#FF2020` | bright red |

## Install

### Via Claude Code marketplace

```
/plugin marketplace add puddinging/prism-hud
/plugin install prism-hud
/prism-hud:setup
```

Then restart Claude Code so the new `statusLine` command is picked up.

### Manual (local clone)

```bash
git clone https://github.com/puddinging/prism-hud.git
cd prism-hud
npm install
npm run build
```

Then wire it up by editing `~/.claude/settings.json`:

```json
"statusLine": {
  "type": "command",
  "command": "exec bun --env-file /dev/null \"$HOME/path/to/prism-hud/src/index.ts\""
}
```

## Configuration

Same model as upstream — edit `~/.claude/plugins/prism-hud/config.json`. All the original `display.*`, `gitStatus.*`, `elementOrder`, `lineLayout` etc. options are preserved.

Note: the `colors.context` / `colors.usage` / `colors.warning` / `colors.usageWarning` / `colors.critical` entries no longer affect the **bar fill** — bars always render the 10-step gradient. They still control the **percentage text color** next to each bar.

## Build and develop

```bash
npm install
npm run build        # compiles TypeScript to dist/
npm run dev          # tsc --watch
npm test             # run tests
```

The plugin runs TypeScript directly via bun (`src/index.ts`), so `dist/` is optional for local use but recommended for publishing.

## Credits

- **[Jarrod Watts](https://github.com/jarrodwatts)** — created [claude-hud](https://github.com/jarrodwatts/claude-hud), the upstream project that does 99% of the work here.
- **[jiefeng.wang](https://github.com/puddinging)** — gradient-bar modifications, namespace rename, maintenance of this fork.

## License

MIT — see [`LICENSE`](./LICENSE). Both upstream and this fork are MIT-licensed.
