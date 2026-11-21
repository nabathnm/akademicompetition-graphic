# TextHighlight Component

## 1. Overview

The `TextHighlight` component is an editorial typography motion component for the **Remotion Motion Graphics Framework**.

It animates visual emphasis behind, around, or underneath selected text (or entire sentences). It supports 10 distinct styling variants designed for premium commercial advertising and editorial typography—such as highlighting key value propositions, metrics, or brand statements.

Example:
> "Make every **moment** count."

The target word "moment" receives an animated highlight while the rest of the sentence remains stationary and clearly legible.

---

## 2. Key Capabilities

- **10 Editorial & Advertising Emphasis Variants**:
  1. `background`: Colored background expands behind text (left-to-right, right-to-left, or center).
  2. `underline`: Animated horizontal baseline rule.
  3. `marker`: Translucent hand-drawn highlighter stroke with organic angle and rounded ends.
  4. `box`: Animated rectangular outline stroke drawn around text via SVG.
  5. `circle`: Animated elliptical emphasis ring drawn around text via SVG.
  6. `strike`: Animated strikethrough line drawing across vertical center.
  7. `gradient`: Linear gradient background fill reveal.
  8. `glow`: Ambient soft drop-shadow halo and scale pulse.
  9. `border-bottom`: Solid editorial bottom rule along text baseline.
  10. `bracket`: Decorative editorial brackets `[` and `]` framing the text.
- **Targeting Flexibility**:
  - Target single string keywords (`highlight="moment"`).
  - Target arrays of multiple keywords (`highlight={['precision', 'scale']}`).
  - Target via regular expressions (`highlight={/\b\w+ing\b/}`).
  - Provide pre-parsed structured segment arrays (`segments={[...]}`).
  - Highlight entire text element when `highlight` is omitted.
- **Guaranteed Text Legibility**:
  - Text sits at `zIndex: 1` in a relative wrapper, while highlights sit at `zIndex: 0` (or `zIndex: 2` for `strike`), guaranteeing text is never obscured.
- **Directional Expansion**:
  - `left-to-right` (default)
  - `right-to-left`
  - `center` (reveals outward from center)
- **Lifecycle & Determinism**:
  - Complete control over `startFrame`, `durationInFrames`, `exitFrame`, and `exitDurationInFrames`.
  - Fully deterministic frame math driven purely by `useCurrentFrame()`.

---

## 3. Component Props API

```typescript
export interface TextHighlightProps {
  /** Optional React children to highlight */
  children?: React.ReactNode;

  /** Full sentence or text content */
  text?: string;

  /** Target substring, array of keywords, or RegExp to highlight */
  highlight?: string | string[] | RegExp;

  /** Pre-parsed structured text segments */
  segments?: TextSegment[];

  /** Highlight visual style variant (default: 'background') */
  variant?: TextHighlightVariant;

  /** Frame at which the highlight animation starts (default: 0) */
  startFrame?: number;

  /** Duration of highlight animation in frames (default: 18) */
  durationInFrames?: number;

  /** Frame at which exit animation starts (optional) */
  exitFrame?: number;

  /** Duration of exit animation in frames (default: 12) */
  exitDurationInFrames?: number;

  /** Easing preset or custom easing function (default: 'easeOutCubic') */
  easing?: EasingPresetName | EasingFunction;

  /** Primary text or stroke color */
  color?: string;

  /** Background highlight color */
  backgroundColor?: string;

  /** Border or stroke color */
  borderColor?: string;

  /** Line or stroke thickness (default: 3) */
  thickness?: number | string;

  /** Padding around the highlighted text span (default: '0.1em 0.35em') */
  padding?: string | number;

  /** Border radius for background or box (default: 4) */
  borderRadius?: number | string;

  /** Vertical offset for underline or border-bottom (default: 2) */
  underlineOffset?: number | string;

  /** Custom width for the highlight span */
  highlightWidth?: string | number;

  /** Custom height for the highlight span */
  highlightHeight?: string | number;

  /** Direction of the highlight expansion (default: 'left-to-right') */
  direction?: TextHighlightDirection;

  /** Inverts the animation progress (default: false) */
  reverse?: boolean;

  /** Container CSS styles */
  style?: React.CSSProperties;

  /** Custom inline style applied to the highlighted span */
  highlightStyle?: React.CSSProperties;

  /** Container CSS class name */
  className?: string;

  /** Highlighted span class name */
  highlightClassName?: string;

  /** HTML wrapper element tag (default: 'span') */
  as?: keyof JSX.IntrinsicElements | React.ComponentType<{ style?: React.CSSProperties; className?: string; children?: React.ReactNode }>;

  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
}
```

---

## 4. Usage Examples

### Example 1: Targeted Keyword Emphasis
```tsx
import { TextHighlight } from './components/typography/TextHighlight';

export const HeadlineMoment = () => (
  <TextHighlight
    text="Make every moment count."
    highlight="moment"
    variant="marker"
    startFrame={0}
    durationInFrames={20}
    backgroundColor="rgba(245, 158, 11, 0.35)"
    style={{
      fontSize: 32,
      fontWeight: 700,
    }}
  />
);
```

### Example 2: Multi-Keyword Array Targeting
```tsx
export const ValueProp = () => (
  <TextHighlight
    text="Engineered for precision. Built for unprecedented scale."
    highlight={['precision', 'scale']}
    variant="background"
    startFrame={5}
    durationInFrames={24}
    backgroundColor="rgba(0, 209, 255, 0.2)"
    borderColor="#00D1FF"
    style={{
      fontSize: 28,
      fontWeight: 800,
    }}
  />
);
```

### Example 3: SVG Geometric Box Emphasis
```tsx
export const GeometricEmphasis = () => (
  <TextHighlight
    text="Unlock 10x performance across global networks."
    highlight="10x performance"
    variant="box"
    startFrame={10}
    durationInFrames={22}
    borderColor="#10B981"
    color="#10B981"
    style={{
      fontSize: 24,
      fontWeight: 700,
    }}
  />
);
```

### Example 4: Directional Center Reveal
```tsx
export const CenterExpandedGlow = () => (
  <TextHighlight
    text="The future of mobility is here."
    highlight="future of mobility"
    variant="gradient"
    direction="center"
    startFrame={0}
    durationInFrames={30}
    style={{
      fontSize: 36,
      fontWeight: 800,
    }}
  />
);
```

---

## 5. Architectural Separation & Testing

The pure mathematical logic of text segmentation and style interpolation is isolated in `src/components/typography/textHighlightStyle.ts`. This allows automated headless unit testing without requiring React rendering:

- `parseTextSegments()`: Parses string keywords, arrays, or regexes into structured tokens, preserving exact punctuation and whitespace.
- `calculateTextHighlightStyle()`: Pure function computing `clipPath`, `strokeDashoffset`, `transform`, `opacity`, and `visibility`.

Unit test coverage is located at `tests/text-highlight.test.ts`.
