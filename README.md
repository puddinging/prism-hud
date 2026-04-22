# prism-hud

A Claude Code statusline HUD with a **per-position gradient progress bar** — each dot is its own color, from cool sky-blue on the left to warm red on the right. As your Context / Usage fills up, the warmer colors naturally appear from the right side, so how "tense" things are is obvious at a glance.

> **Fork notice.** prism-hud is forked from **[jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud)** (MIT-licensed). Engine, transcript parsing, rate-limit handling, and configuration system are the original author's work. See [`NOTICE.md`](./NOTICE.md) for full attribution.

## What's different from upstream

- **Gradient bar rendering.** All bars (Context, 5h Usage, 7d Usage) use a fixed 10-step palette — each dot has its own color. The user's fill level decides how many dots are lit; the colors don't change based on percentage, they change based on *position*.
- **Plugin namespace renamed** to `prism-hud`. Config now lives at `~/.claude/plugins/prism-hud/config.json`. Slash commands become `/prism-hud:setup`, `/prism-hud:configure`.

## Gradient palette (10 steps)

| Pos | Hex | Material stop | Semantic |
|-----|-----|---------------|----------|
| 1 | `#00E676` | green A400 | safe |
| 2 | `#3DEE4A` | interpolated | |
| 3 | `#76FF03` | light-green A400 | |
| 4 | `#C6FF00` | lime A400 | |
| 5 | `#FFEA00` | yellow A400 | caution |
| 6 | `#FFC400` | amber A400 | |
| 7 | `#FF9100` | orange A400 | |
| 8 | `#FF6D00` | orange A700 | |
| 9 | `#FF3D00` | deep-orange A400 | danger |
| 10 | `#FF1744` | red A400 | critical |

Follows the progress-bar convention (green = safe, yellow = caution, red = danger) while keeping the high-saturation / high-brightness "electric" feel of Material Design's Accent (A-series) palette — same family as the reference color `#09A5F7` that shaped this plugin's visual identity.

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

Edit `~/.claude/plugins/prism-hud/config.json`. All upstream options (`display.*`, `gitStatus.*`, `elementOrder`, `lineLayout`, `colors.*`) are preserved — see below for the prism-hud-specific section.

### Customizing the gradient bar

Add a `gradient` block to override any or all of: palette, dot character, empty dot character, empty dot color. Only the fields you set override the defaults.

```json
{
  "gradient": {
    "colors": [
      "#00E676", "#3DEE4A", "#76FF03", "#C6FF00", "#FFEA00",
      "#FFC400", "#FF9100", "#FF6D00", "#FF3D00", "#FF1744"
    ],
    "filledChar": "●",
    "emptyChar": "○",
    "emptyColor": "#7D7A72"
  }
}
```

**`colors`** — hex palette, any length ≥ 1. Sampled evenly across the bar width: 10 colors ↔ 10 dots 1:1; 2 colors ↔ first half gets color 1, second half color 2; 20 colors ↔ every 2nd sampled.

**`filledChar`** — accepts **either a string** (same char for every filled dot) **or an array of strings** (per-position override; cycles if shorter than the bar width).

```json
// uniform:   ● ● ● ● ● ● ● ● ● ●
"filledChar": "●"

// bar-chart style:   ▰ ▰ ▰ ▰ ▰ ▰ ▰ ▰ ▰ ▰
"filledChar": "▰"

// shape-per-position:   ● ◆ ★ ▲ ■ ● ◆ ★ ▲ ■
"filledChar": ["●", "◆", "★", "▲", "■"]
```

**`emptyChar`** — glyph for empty dots (string, 1–8 chars).

**`emptyColor`** — hex (`#RRGGBB`), named color (`dim`, `red`, `green`, `yellow`, `magenta`, `cyan`, `brightBlue`, `brightMagenta`), or 256-color index (0–255).

### Notes on legacy color config

The `colors.context` / `colors.usage` / `colors.warning` / `colors.usageWarning` / `colors.critical` entries no longer affect the bar fill or the percentage text — both now follow `gradient`. They still drive legacy warning labels (e.g. "⚠ Limit reached") and other non-bar accents.

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
