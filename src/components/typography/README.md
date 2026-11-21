# Typography Components (Layer 2)

Reusable kinetic and static typography components styled to match premium mobility branding.

## Available Components
- `AnimatedText`: Foundational typography animator supporting 10 deterministic entrance and exit variants (`fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `scale`, `pop`, `blur`, `rotate`, `fade-slide-up`). See [docs/ANIMATED_TEXT.md](../../../docs/ANIMATED_TEXT.md).
- `WordReveal`: Sequential word-by-word typography component supporting independent word timing, stagger offsets, 10 animation variants, whitespace preservation, reverse reveal order, and keyword styling. See [docs/WORD_REVEAL.md](../../../docs/WORD_REVEAL.md).
- `CharacterReveal`: High-precision character-by-character typography component supporting grapheme segmentation, 12 animation variants (including `elastic` and `wave`), atomic word grouping, and reverse reveal. See [docs/CHARACTER_REVEAL.md](../../../docs/CHARACTER_REVEAL.md).
- `TextMask`: Editorial typography masking and clipping component supporting 11 variants (bottom/top/left/right reveals, center expansion, vertical/horizontal/diagonal wipes, line-by-line reveals, and mask-slide-up) with descender safety and bounds inspection. See [docs/TEXT_MASK.md](../../../docs/TEXT_MASK.md).
- `TextHighlight`: Editorial typography emphasis component supporting 10 variants (`background`, `underline`, `marker`, `box`, `circle`, `strike`, `gradient`, `glow`, `border-bottom`, `bracket`), targeted keyword extraction, array/regex targets, directional reveals, and guaranteed legibility. See [docs/TEXT_HIGHLIGHT.md](../../../docs/TEXT_HIGHLIGHT.md).
- `SplitText`: Advanced multi-strategy typography component supporting 5 split modes (`line`, `word`, `character`, `sentence`, `custom`), 14 animation variants (including `flip-up`, `flip-down`, `wave`, `random-stagger`), seeded deterministic pseudo-random sequences, and layout stability. See [docs/SPLIT_TEXT.md](../../../docs/SPLIT_TEXT.md).

## Planned Components
- `DisplayHero`: Massive punchy headlines for impactful brand intros.
- `Headline`: Hierarchical section headers with character/word reveal support.
- `AnimatedCounter`: Numeric rolling/interpolating counter (e.g. metrics, stats, pricing).
- `KineticText`: Word-by-word or character-staggered kinetic typographic animations.
- `EyebrowTag`: Uppercase spaced micro-label for category tags.

## Conventions
- Typography components default to typography design tokens from `styles/typography.ts`.
- All animation is deterministic and driven strictly by frame position.
- Transforms and inline styling are fully composable.
- Word and character spans use `display: inline-block` to enable CSS transforms while whitespace spans maintain natural document line wrapping.
