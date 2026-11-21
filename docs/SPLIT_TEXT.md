# SplitText Component

## 1. Overview

The `SplitText` component is an advanced, flexible typography motion component for the **Remotion Motion Graphics Framework**.

While `WordReveal` and `CharacterReveal` focus on sequential word and character progression, `SplitText` introduces a unified, multi-strategy segmentation architecture. It allows motion designers and developers to segment typography by **line**, **word**, **character (grapheme)**, **sentence**, or **manually defined custom tokens**, and choreograph each segment across 14 deterministic animation variants (including 3D perspective flips, sinusoidal waves, and seeded random stagger).

---

## 2. Key Capabilities

- **5 Segmentation Modes (`splitBy`)**:
  1. `line`: Splits text by newline boundaries (`\r?\n`), preserving natural line breaks without relying on volatile DOM bounding box measurements.
  2. `word`: Splits text into words while attaching trailing whitespace, ensuring responsive line wrapping without hyphenation bugs.
  3. `character`: Grapheme-aware segmentation preserving multi-codepoint emojis, skin tone modifiers, and combining diacritical marks.
  4. `sentence`: Segments on grammatical sentence boundaries (`.`, `!`, `?`), retaining trailing punctuation and spacing.
  5. `custom`: Accepts structured arrays of `{ text, id, style, ... }` for explicitly defined typographic tokens.
- **14 Deterministic Animation Variants**:
  1. `slide-up`: Upward vertical translation with alpha fade.
  2. `slide-down`: Downward vertical translation with alpha fade.
  3. `slide-left`: Leftward horizontal translation.
  4. `slide-right`: Rightward horizontal translation.
  5. `fade`: Pure alpha opacity interpolation.
  6. `scale`: Uniform scale expansion from initial scale to unity.
  7. `pop`: Physics spring overshoot with configurable damping, stiffness, and mass.
  8. `rotate`: Subtle angular rotational entrance.
  9. `blur`: Gaussian blur filter transition from softened to sharp focus.
  10. `flip-up`: 3D perspective X-axis flip upward from bottom edge (`rotateX(-80deg) -> 0deg`).
  11. `flip-down`: 3D perspective X-axis flip downward from top edge (`rotateX(80deg) -> 0deg`).
  12. `stagger`: Combined elevation slide and scale entrance.
  13. `wave`: Sinusoidal crest trajectory (`Math.sin(p * Math.PI) * -distance`).
  14. `random-stagger`: Seeded pseudo-random entrance ordering via Mulberry32 PRNG.
- **Deterministic Seeded Random Shuffling**:
  - The `random-stagger` variant generates pseudo-random sequences using a pure 32-bit PRNG (`seed: number | string`).
  - Guarantees identical frame output across multi-threaded Remotion workers and frame scrubs without using `Math.random()`.
- **Layout & Typographical Stability**:
  - Preserves natural sentence wrapping, whitespace, and word boundary integrity.
  - Character splitting groups characters within word wrappers to prevent unwanted mid-word line breaks in web render engines.

---

## 3. Component Props API

```typescript
export interface SplitTextProps {
  /** Text string to split and animate */
  text?: string;

  /** Custom segments when splitBy is 'custom' */
  segments?: SplitTextCustomSegment[];

  /** Splitting strategy (default: 'word') */
  splitBy?: 'line' | 'word' | 'character' | 'sentence' | 'custom';

  /** Animation preset variant (default: 'slide-up') */
  variant?: SplitTextVariant;

  /** Frame at which the animation sequence begins (default: 0) */
  startFrame?: number;

  /** Total animation duration in frames (optional override) */
  durationInFrames?: number;

  /** Delay in frames between consecutive segments (default: 2) */
  staggerDelay?: number;

  /** Duration in frames for each individual segment animation (default: 16) */
  segmentDuration?: number;

  /** Frame at which exit animation starts (optional) */
  exitFrame?: number;

  /** Duration in frames for each segment exit animation (default: 12) */
  exitDurationInFrames?: number;

  /** Stagger delay between segments during exit */
  exitStaggerDelay?: number;

  /** Additional frame delay added to startFrame (default: 0) */
  delay?: number;

  /** Easing curve for interpolation (default: 'easeOutCubic') */
  easing?: EasingPresetName | EasingFunction;

  /** Spring physics preset when using spring-based variant 'pop' (default: 'snappy') */
  springPreset?: SpringPresetName;

  /** Distance in pixels for translation variants (default: 30) */
  distance?: number;

  /** Starting scale for scale and pop variants (default: 0.85) */
  initialScale?: number;

  /** Starting rotation in degrees for rotate variant (default: -10) */
  initialRotation?: number;

  /** Starting blur radius in pixels for blur variant (default: 8) */
  initialBlur?: number;

  /** Whether to animate segments in reverse sequence (default: false) */
  reverse?: boolean;

  /** Direction mode: 'in' (entrance only), 'out' (exit only), 'both' (entrance and exit) */
  direction?: 'in' | 'out' | 'both';

  /** Deterministic seed for random-stagger variant (default: 42) */
  seed?: number | string;

  /** Custom inline style overrides for the outer container */
  style?: React.CSSProperties;

  /** Custom inline style overrides for each segment, or a function returning styles per segment */
  segmentStyle?: React.CSSProperties | ((segment: SplitTextSegment, index: number) => React.CSSProperties);

  /** Custom CSS class name for the outer container */
  className?: string;

  /** Custom CSS class name for segments, or a function returning class per segment */
  segmentClassName?: string | ((segment: SplitTextSegment, index: number) => string);

  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';

  /** Whether to preserve multiple consecutive spaces and newlines (default: true) */
  preserveWhitespace?: boolean;

  /** HTML tag for the container (default: 'div') */
  as?: React.ElementType;
}
```

---

## 4. Usage Examples

### Example 1: Editorial 3D Perspective Flip by Line
```tsx
import { SplitText } from './components/typography/SplitText';

export const MultiLineEditorial = () => (
  <SplitText
    text={`Redefining urban transit.\nBuilt for unprecedented scale.\nZero emissions.`}
    splitBy="line"
    variant="flip-up"
    startFrame={0}
    staggerDelay={6}
    segmentDuration={20}
    style={{
      fontSize: 32,
      fontWeight: 700,
      lineHeight: 1.4,
    }}
  />
);
```

### Example 2: Seeded Deterministic Random Stagger
```tsx
export const SeededRandomHero = () => (
  <SplitText
    text="Move faster with better experiences."
    splitBy="word"
    variant="random-stagger"
    seed={1337}
    startFrame={5}
    staggerDelay={3}
    segmentDuration={16}
    style={{
      fontSize: 36,
      fontWeight: 800,
      letterSpacing: '-0.02em',
    }}
    segmentStyle={(seg) => (seg.text === 'better' ? { color: '#10B981' } : {})}
  />
);
```

### Example 3: Custom Segmentation
```tsx
export const CustomTokenStatement = () => (
  <SplitText
    segments={[
      { text: 'ENGINEERED', id: 'tok-1', style: { color: '#00D1FF' } },
      { text: 'FOR', id: 'tok-2' },
      { text: 'SCALE', id: 'tok-3', style: { color: '#10B981' } },
    ]}
    splitBy="custom"
    variant="slide-up"
    startFrame={0}
    staggerDelay={4}
    segmentDuration={18}
    style={{
      fontSize: 40,
      fontWeight: 800,
      display: 'flex',
      gap: 12,
    }}
  />
);
```

### Example 4: Sentence-by-Sentence Narrative
```tsx
export const SentenceNarrative = () => (
  <SplitText
    text="Make every moment count. Built for scale. Ready to launch."
    splitBy="sentence"
    variant="stagger"
    startFrame={0}
    staggerDelay={12}
    segmentDuration={22}
    style={{
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.6,
    }}
  />
);
```

---

## 5. Architectural Separation & Testing

All segmentation algorithms and visual transform equations reside in `src/components/typography/splitTextStyle.ts`:
- `splitTextIntoSegments()`: Segmentation engine for lines, words, graphemes, sentences, and custom tokens.
- `createDeterministicShuffle()`: Pure Mulberry32 PRNG generator producing identical permutations for a given seed.
- `calculateSplitTextTiming()`: Computes segment start/end frames, reverse order, and exit offsets.
- `calculateSplitTextStyle()`: Computes deterministic transforms, perspective, scales, and opacity.

Unit tests are located at `tests/split-text.test.ts`.
