# TextMask Component

## 1. Overview

The `TextMask` component is a high-impact, editorial typography motion component for the **Remotion Motion Graphics Framework**.

It reveals text through clipping boundaries, mathematical insets, diagonal polygon slices, and overflow containers, producing the clean, premium graphic language characteristic of modern luxury, mobility, and technology advertising.

---

## 2. Key Capabilities

- **11 Deterministic Masking Variants**:
  1. `bottom-reveal`: Text reveals upward from bottom edge (`clip-path: inset(...)`).
  2. `top-reveal`: Text reveals downward from top edge (`clip-path: inset(...)`).
  3. `left-reveal`: Text reveals rightward from left edge (`clip-path: inset(...)`).
  4. `right-reveal`: Text reveals leftward from right edge (`clip-path: inset(...)`).
  5. `center-reveal`: Clipping boundaries expand outward from the horizontal center.
  6. `center-collapse`: Clipping boundaries reveal inward towards the center.
  7. `vertical-wipe`: Full-height linear vertical clipping wipe.
  8. `horizontal-wipe`: Full-width linear horizontal clipping wipe.
  9. `diagonal-wipe`: 45-degree angular polygon knife-edge wipe (`clip-path: polygon(...)`).
  10. `line-reveal`: Multi-line text with independent overflow clipping and staggered entrance timing.
  11. `mask-slide-up`: Classic editorial translation behind an `overflow: hidden` container.
- **Descender & Ascender Clearance**: Custom vertical padding buffers (`paddingBottom: 0.18em`) prevent characters with deep descenders (`g`, `y`, `p`, `q`, `j`) from clipping at rest.
- **Inspectable Boundaries (`showMaskBounds`)**: Allows developers and motion designers to toggle a dashed outline around the clipping container during frame-by-frame scrubbing.
- **Multi-Line & Line-by-Line Stagger**: Supports newline-separated strings or explicit arrays of lines with configurable line duration and stagger intervals.
- **Full Parity Support**: Supports reverse animation order, exit lifecycles, and both plain text and nested React children.

---

## 3. Component Props API

```typescript
export interface TextMaskProps {
  /** Optional React children to mask */
  children?: React.ReactNode;

  /** Optional plain text content to mask */
  text?: string;

  /** Animation preset variant (default: 'bottom-reveal') */
  variant?: TextMaskVariant;

  /** Frame at which the reveal animation starts (default: 0) */
  startFrame?: number;

  /** Duration of reveal animation in frames (default: 20) */
  durationInFrames?: number;

  /** Frame at which exit animation starts (optional) */
  exitFrame?: number;

  /** Duration of exit animation in frames (default: 14) */
  exitDurationInFrames?: number;

  /** Easing curve for interpolation (default: 'easeOutCubic') */
  easing?: EasingPresetName | EasingFunction;

  /** Direction mode: 'in' (entrance only), 'out' (exit only), 'both' (entrance and exit) */
  direction?: 'in' | 'out' | 'both';

  /** Distance or percentage offset for slide variants (default: '100%') */
  distance?: number | string;

  /** Frame delay between consecutive lines for 'line-reveal' (default: 4) */
  staggerDelay?: number;

  /** Animation duration per line for 'line-reveal' (default: 18) */
  lineDuration?: number;

  /** Inverts reveal direction (default: false) */
  reverse?: boolean;

  /** Container overflow setting (default: 'hidden') */
  overflow?: 'hidden' | 'visible';

  /** Color of optional overlay wipe block (optional) */
  maskColor?: string;

  /** When true, renders a dashed boundary around the clipping container for visual inspection */
  showMaskBounds?: boolean;

  /** Optional explicit array of text lines for 'line-reveal' */
  lines?: string[];

  /** Custom inline styles for the clipping container */
  style?: React.CSSProperties;

  /** Custom inline styles for the inner animated content */
  contentStyle?: React.CSSProperties;

  /** Custom CSS class name */
  className?: string;

  /** HTML tag for the container (default: 'div') */
  as?: React.ElementType;

  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
}
```

---

## 4. Masking Techniques & Mathematical Formulas

### Inset Clipping (`clip-path: inset(top right bottom left)`)
Used for directional reveals:
- **`bottom-reveal`**:
  $$\text{topInset} = (1 - p) \times 100\%, \quad \text{bottomInset} = outP \times 100\%$$
  $$\text{clip-path} = \text{inset}(\text{topInset}\% \quad 0\% \quad \text{bottomInset}\% \quad 0\%)$$
- **`left-reveal`**:
  $$\text{rightInset} = (1 - p) \times 100\%, \quad \text{leftInset} = outP \times 100\%$$
  $$\text{clip-path} = \text{inset}(0\% \quad \text{rightInset}\% \quad 0\% \quad \text{leftInset}\%)$$
- **`center-reveal`**:
  $$\text{hInset} = (1 - p) \times 50\% + outP \times 50\%$$
  $$\text{clip-path} = \text{inset}(0\% \quad \text{hInset}\% \quad 0\% \quad \text{hInset}\%)$$

### Polygon Angle Clipping (`clip-path: polygon(...)`)
Used for `diagonal-wipe`:
A 45-degree knife edge sweeps across the bounding box:
$$\text{topX} = \text{clamp}(p \times 150\%, 0\%, 100\%)$$
$$\text{bottomX} = \text{clamp}(p \times 150\% - 50\%, 0\%, 100\%)$$
$$\text{clip-path} = \text{polygon}(0\% \; 0\%, \; \text{topX}\% \; 0\%, \; \text{bottomX}\% \; 100\%, \; 0\% \; 100\%)$$

At $p = 0$, the clipping area is 0; at $p = 1$, the polygon expands to $(0,0) \to (100\%, 100\%)$, leaving no clipped edges.

### Overflow Hidden Slide (`transform: translateY(...)`)
Used for `mask-slide-up` and `line-reveal`:
The outer container maintains `overflow: hidden; padding-bottom: 0.18em`.
The inner element moves:
$$\text{translateY} = ((1 - p) \times 100 - outP \times 100)\%$$
Text emerges cleanly from the baseline with no layout shifts.

---

## 5. Line-by-Line Editorial Reveals (`line-reveal`)

When `variant="line-reveal"`, `TextMask` parses multi-line text (via newlines or the `lines` prop) and renders each line inside its own nested overflow container.
Each line is assigned a staggered start frame:
$$\text{lineStartFrame}_i = \text{startFrame} + (i \times \text{staggerDelay})$$

This creates the classic staggered headline animation common in Apple and Uber product reveals.

---

## 6. Usage Examples

### Classic Editorial Mask Slide
```tsx
import { TextMask } from '@/components/typography';

export const Headline = () => (
  <TextMask
    variant="mask-slide-up"
    text="ENGINEERED TO MOVE CITIES"
    startFrame={0}
    durationInFrames={20}
    style={{ fontSize: 36, fontWeight: 800 }}
  />
);
```

### Line-by-Line Editorial Cascade
```tsx
<TextMask
  variant="line-reveal"
  text={'Autonomous Fleets.\nIntelligent Logistics.\nGlobal Scale.'}
  startFrame={5}
  staggerDelay={4}
  lineDuration={18}
  style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.3 }}
/>
```

### Diagonal Knife-Edge Wipe
```tsx
<TextMask
  variant="diagonal-wipe"
  text="PRECISION MOBILITY"
  startFrame={10}
  durationInFrames={24}
  style={{ fontSize: 40, fontWeight: 800, color: '#00D1FF' }}
/>
```

### Center Expansion with Bounds Inspection
```tsx
<TextMask
  variant="center-reveal"
  text="EXPAND FROM CENTER"
  startFrame={0}
  durationInFrames={20}
  showMaskBounds={true}
  style={{ fontSize: 32, fontWeight: 700 }}
/>
```
