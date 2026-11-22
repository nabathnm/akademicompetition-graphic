# TypographyScene Component Documentation

`TypographyScene` is a Layer 3 scene template designed specifically for typography-driven motion graphics where text is the primary visual centerpiece. Rather than re-implementing text animation logic, it seamlessly composes Layer 2 Typography primitives (`AnimatedText`, `WordReveal`, `CharacterReveal`, `TextMask`, `TextHighlight`, `SplitText`) and standardizes layout arrangements, dynamic word highlights, safe area margins, and deterministic staggered timing.

---

## 1. Architecture & Design Principles

```
                   ┌───────────────────────────────────┐
                   │         TypographyScene           │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
                   ┌───────────────────────────────────┐
                   │         SceneContainer            │
                   │   • Sizing & Aspect Ratio         │
                   │   • Safe Area Bounds (60px)       │
                   │   • Ambient Background Gradients  │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ calculateTypographySceneKinematics()                        │
        │   • Eyebrow:        delay + eyebrowDelay                    │
        │   • Headline:       delay + headlineDelay (stagger * 1)     │
        │   • Secondary:      delay + secondaryDelay (stagger * 2)    │
        │   • Description:    delay + descriptionDelay (stagger * 3)  │
        │   • Highlights:     delay + highlightDelay (stagger * 3)    │
        │   • Decorative:     delay + stagger * 2                     │
        └─────────────────────────────┬───────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ Composed Layer 2 Primitives:                                │
        │   • WordReveal:        Word-by-word staggered entrance      │
        │   • CharacterReveal:   Letter-by-letter kinetic sequence    │
        │   • TextMask:          Boundary-clipped reveal wipes        │
        │   • TextHighlight:     Dynamic keyword highlight emphasis   │
        │   • SplitText:         Segmented typographic transforms     │
        │   • AnimatedText:      Smooth fade / slide / pop kinetics   │
        └─────────────────────────────────────────────────────────────┘
```

---

## 2. Layout Variations

`TypographyScene` supports 8 distinct layout modes:

1. **`centered` (Default)**:
   Balanced vertical hierarchy with centered alignment, optimal for keynote statements, quotes, and core brand slogans.
2. **`left-aligned`**:
   Editorial layout with left alignment and progressive vertical spacing.
3. **`right-aligned`**:
   Dynamic right-aligned hierarchy for asymmetric visual pacing.
4. **`oversized-headline`**:
   Dominant typography layout with massive 92px headline, compact secondary text, and maximum visual punch.
5. **`multi-line`**:
   Multi-line layout with tight vertical gaps and expressive line height for cascading typographic statements.
6. **`split-text`**:
   Two-column typographic spread: Category eyebrow and headline on the left, secondary headline and extended description on the right.
7. **`text-with-graphics`**:
   Typography paired with decorative geometric badges, status indicators, or particle accents.
8. **`custom`**:
   Unconstrained canvas layout for freeform composition.

---

## 3. Dynamic Text Highlighting

When `highlightedWords` is specified, `TypographyScene` automatically parses the headline text with `splitTextWithHighlights`, identifies target words, and wraps them in `TextHighlight`:
- Supported highlight variants: `'background'`, `'underline'`, `'marker'`, `'box'`, `'circle'`, `'gradient'`, `'glow'`.
- Configurable highlight color, duration, and delay.
- Case-insensitive matching with automatic punctuation stripping.

---

## 4. Component Properties (`TypographySceneProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `headline` | `React.ReactNode` | *(Required)* | Main primary headline text or React element |
| `secondaryHeadline` | `React.ReactNode` | `undefined` | Secondary supporting headline |
| `description` | `React.ReactNode` | `undefined` | Extended description paragraph |
| `paragraph` | `React.ReactNode` | `undefined` | Alias for description |
| `eyebrow` | `React.ReactNode` | `undefined` | Category badge or eyebrow pill |
| `label` | `React.ReactNode` | `undefined` | Tag or category identifier |
| `highlightedWords` | `string[]` | `[]` | Words within headline to emphasize with TextHighlight |
| `highlightColor` | `string` | `Colors.accent.cyan` | Color used for text highlighting |
| `layout` | `TypographySceneLayout`| `'centered'` | Layout structure mode |
| `alignment` | `'left' \| 'center' \| 'right'` | `auto` | Text alignment override |
| `animation` | `TypographySceneAnimationConfig` | `undefined` | Animation timing and kinetic variant options |
| `staggerDelay` | `number` | `4` | Base stagger delay between sequential elements in frames |
| `headlineStyle` | `React.CSSProperties` | `undefined` | Headline custom inline style |
| `secondaryStyle` | `React.CSSProperties` | `undefined` | Secondary headline custom inline style |
| `descriptionStyle` | `React.CSSProperties` | `undefined` | Description paragraph custom inline style |
| `eyebrowStyle` | `React.CSSProperties` | `undefined` | Eyebrow custom inline style |
| `decorativeElements` | `React.ReactNode` | `undefined` | Ambient decorative badges or geometric elements |
| `background` | `string` | `undefined` | CSS background gradient or pattern |
| `backgroundColor` | `string` | `Colors.dark.bgPrimary` | Solid background color |
| `backgroundImage` | `string` | `undefined` | Background image URL |
| `durationInFrames` | `number` | `undefined` | Total scene duration in frames |
| `delay` | `number` | `0` | Delay before scene entrance starts |
| `width` | `number \| string` | `composition width` | Scene container width |
| `height` | `number \| string` | `composition height` | Scene container height |
| `padding` | `ScenePadding` | `64` | Inner content padding |
| `safeArea` | `boolean \| number` | `true` | Broadcast safe area margin (60px) |
| `sceneId` | `string` | `'typography-scene'` | Scene identifier for profiling |
| `debug` | `boolean` | `false` | Visual debug overlay toggle |

---

## 5. Usage Examples

### Example 1: Centered Keyword Highlight
```tsx
import { TypographyScene } from './components/scenes';

export const KeynoteIntro = () => (
  <TypographyScene
    layout="centered"
    eyebrow="AI-NATIVE SYNTHESIS"
    headline="Autonomous Intelligence at Scale"
    highlightedWords={['intelligence', 'scale']}
    secondaryHeadline="Sub-frame accuracy with zero hydration jitter"
    description="Render cinematic commercial videos deterministically using pure React and TypeScript."
    animation={{
      headlineAnimation: 'word-reveal',
      highlightVariant: 'background',
      staggerDelay: 4,
    }}
  />
);
```

### Example 2: Oversized Editorial Spread
```tsx
export const EditorialScene = () => (
  <TypographyScene
    layout="oversized-headline"
    alignment="left"
    headline="SUPERCONDUCTIVE MOTION"
    secondaryHeadline="Next-generation Remotion graphics framework"
    animation={{
      headlineAnimation: 'character-reveal',
      staggerDelay: 3,
    }}
  />
);
```
