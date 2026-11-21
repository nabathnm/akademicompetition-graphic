# CharacterReveal Component

## 1. Overview

The `CharacterReveal` component is a high-precision, frame-driven typography motion component for the **Remotion Motion Graphics Framework**.

It animates individual glyphs independently, allowing character-level choreographies such as directional reveals, scale zooms, spring pops, elastic rebounds, and undulating sinusoidal wave ripples across headlines.

To guarantee linguistic and typographical accuracy, `CharacterReveal` uses `Intl.Segmenter` with grapheme granularity, preserving accented letters, multi-byte Unicode, combining diacritical marks, and emoji clusters.

---

## 2. Key Capabilities

- **12 Deterministic Animation Variants**:
  1. `fade` (alpha opacity entrance)
  2. `slide-up` (vertical rise $Y+24 \to 0$)
  3. `slide-down` (vertical descent $Y-24 \to 0$)
  4. `slide-left` (horizontal entrance from right)
  5. `slide-right` (horizontal entrance from left)
  6. `scale` (linear/eased glyph zoom)
  7. `pop` (spring-based scale physics)
  8. `blur` (Gaussian blur-to-clear)
  9. `rotate` (angular letter tilt)
  10. `fade-slide-up` (coordinated vertical rise and opacity fade)
  11. `elastic` (underdamped spring with snappy mechanical overshoot)
  12. `wave` (sinusoidal vertical wave crest trajectory across staggered characters)
- **Grapheme-Aware Segmentation**: Never corrupts multi-byte Unicode or emoji surrogate pairs (`Intl.Segmenter` grapheme cluster segmentation).
- **Word-Wrapping Protection**: Characters are grouped into atomic word spans (`whiteSpace: nowrap`), ensuring words never break awkwardly across syllables while lines wrap naturally at whitespace boundaries.
- **Wave Ripple Physics**: Traverses an arched crest path ($\sin(\pi \times p) \times \text{amplitude}$) to create an undulating physical wave across headlines.
- **Reverse Reveal Order**: Allows right-to-left character cascades ($N-1 \to 0$) while strictly preserving left-to-right sentence reading order.
- **Performance Optimization**: Early-exit bypass for inactive characters, ensuring low per-frame CPU footprint even for large text blocks.

---

## 3. Component Props API

```typescript
export interface CharacterRevealProps {
  /** The text string to animate character by character */
  text: string;

  /** Animation preset variant (default: 'fade-slide-up') */
  variant?: CharacterRevealVariant;

  /** Frame at which the first character entrance begins (default: 0) */
  startFrame?: number;

  /** Total animation duration in frames. If provided without characterDuration, characterDuration is derived */
  durationInFrames?: number;

  /** Frame delay between each consecutive character reveal (default: 1) */
  staggerDelay?: number;

  /** Duration of animation for each individual character (default: 14) */
  characterDuration?: number;

  /** Optional frame at which exit animation starts */
  exitFrame?: number;

  /** Duration of exit animation per character in frames (default: 10) */
  exitDurationInFrames?: number;

  /** Frame delay between consecutive characters during exit (default: staggerDelay) */
  exitStaggerDelay?: number;

  /** Additional frame delay added to startFrame (default: 0) */
  delay?: number;

  /** Easing curve for interpolation (default: 'easeOutCubic') */
  easing?: EasingPresetName | EasingFunction;

  /** Spring physics preset when using spring-based variant 'pop' or 'elastic' (default: 'snappy') */
  springPreset?: SpringPresetName;

  /** Distance in pixels for translation and wave variants (default: 24) */
  distance?: number;

  /** Starting scale for scale and pop variants (default: 0.8) */
  initialScale?: number;

  /** Starting rotation in degrees for rotate variant (default: -15) */
  initialRotation?: number;

  /** Starting blur radius in pixels for blur variant (default: 8) */
  initialBlur?: number;

  /** Amplitude displacement in pixels for wave variant (default: 24) */
  waveAmplitude?: number;

  /** Frequency multiplier for wave variant (default: 0.4) */
  waveFrequency?: number;

  /** If true, characters animate in reverse sequence (last character reveals first; default: false) */
  reverse?: boolean;

  /** If true, reverses the visual rendering order of characters (default: false) */
  reverseVisualOrder?: boolean;

  /** Direction mode: 'in' (entrance only), 'out' (exit only), 'both' (entrance and exit) */
  direction?: 'in' | 'out' | 'both';

  /** Whether to preserve multiple consecutive spaces and newlines (default: true) */
  preserveWhitespace?: boolean;

  /** Whether whitespace characters are animated as visible characters (default: false) */
  animateSpaces?: boolean;

  /** Custom inline style overrides for the outer container */
  style?: React.CSSProperties;

  /** Custom inline style overrides for each character element, or a function returning styles per character */
  characterStyle?: React.CSSProperties | ((char: string, index: number) => React.CSSProperties);

  /** Custom CSS class name for the outer container */
  className?: string;

  /** Custom CSS class name for characters, or a function returning class per character */
  characterClassName?: string | ((char: string, index: number) => string);

  /** HTML tag to render as the container element (default: 'div') */
  as?: React.ElementType;

  /** Text alignment (default: 'left') */
  align?: 'left' | 'center' | 'right' | 'justify';
}
```

---

## 4. Grapheme Segmentation Strategy

Naive string splitting via `text.split('')` breaks when handling Unicode:
- Multi-codepoint emoji like `👍🏽` (thumbs up + skin modifier) splits into 2 unrenderable surrogate codes.
- Compound emojis like `👨‍👩‍👧‍👦` (family with zero-width joiners) splits into 7 broken characters.
- Combining diacritics like `e\u0301` separates the base letter `'e'` from its accent `'´'`.

`CharacterReveal` uses `Intl.Segmenter` with `granularity: 'grapheme'`:
```typescript
const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
const graphemes = Array.from(segmenter.segment(text), (s) => s.segment);
```
- Multi-byte sequences remain single, indivisible glyph units.
- Non-Latin scripts (Japanese, Arabic, Hindi, Cyrillic) segment seamlessly.
- Reconstructing segmented tokens produces an identical character stream: $\text{original} \equiv \text{reconstructed}$.

---

## 5. Layout Architecture & Natural Line Wrapping

A common issue in character-by-character animators is that browsers wrap lines arbitrarily between any character wrapped in an `inline-block` container.

`CharacterReveal` implements **Hierarchical Word-Grouping**:
1. Characters belonging to the same word are grouped inside an atomic word wrapper:
   ```html
   <span style="display: inline-block; white-space: nowrap;">
     <span style="display: inline-block; transform: ...">C</span>
     <span style="display: inline-block; transform: ...">R</span>
     <span style="display: inline-block; transform: ...">E</span>
     <span style="display: inline-block; transform: ...">A</span>
     <span style="display: inline-block; transform: ...">T</span>
     <span style="display: inline-block; transform: ...">E</span>
   </span>
   ```
2. Spaces between words are rendered as standard inline elements:
   ```html
   <span style="display: inline; white-space: pre-wrap;"> </span>
   ```
3. Because the word wrapper has `white-space: nowrap`, words never break across syllables.
4. Because spaces are standard inline elements, the browser line-breaks naturally between words.
5. All transforms apply properly because individual character spans are `display: inline-block`.

---

## 6. Wave Animation Math

The `wave` variant produces a physical undulating crest across characters:
For character $i$ with entrance progress $p \in [0, 1]$:
$$Y(p) = (1 - p) \times \text{distance} - \sin(\pi \times p) \times \text{waveAmplitude}$$

- At $p = 0$: $Y = \text{distance}$ (initial downward offset), $\text{opacity} = 0$.
- At $p = 0.5$: $\sin(\pi \times 0.5) = 1$, propelling the glyph into an elevated crest peak ($-\text{waveAmplitude}$).
- At $p = 1.0$: $\sin(\pi) = 0$, $Y = 0$, settling smoothly into the baseline at $\text{opacity} = 1$.

Because start frames are offset by `staggerDelay`, the crest propagates horizontally across the entire sentence like a rolling wave.

---

## 7. Performance Considerations

For long text blocks (e.g. 100+ characters), calculating spring physics and matrices for every character on every frame is computationally wasteful.

`calculateCharacterRevealStyle` applies fast early-exit checks:
- If $\text{currentFrame} < \text{charStartFrame}$: Returns `{ opacity: 0, visibility: 'hidden' }` immediately without math calculations.
- If $\text{currentFrame} \ge \text{charStartFrame} + \text{duration}$ (and before exit): Returns `{ opacity: 1, visibility: 'visible', transform: 'none' }` immediately.

Only characters actively transitioning in their frame window execute mathematical calculations.

---

## 8. Usage Examples

### Basic Hero Statement
```tsx
import { CharacterReveal } from '@/components/typography';

export const HeroTitle = () => (
  <CharacterReveal
    text="CREATE SOMETHING AMAZING"
    variant="wave"
    startFrame={0}
    staggerDelay={1}
    characterDuration={14}
    style={{ fontSize: 40, fontWeight: 800, letterSpacing: '0.04em' }}
  />
);
```

### Elastic Rebound
```tsx
<CharacterReveal
  text="SNAPPY MECHANICAL PRECISION"
  variant="elastic"
  startFrame={5}
  staggerDelay={1}
  characterDuration={18}
  style={{ fontSize: 24, fontWeight: 700, color: '#A855F7' }}
/>
```

### Multilingual & Emoji Support
```tsx
<CharacterReveal
  text="UBER 🚀 都市交通の未来"
  variant="fade-slide-up"
  startFrame={10}
  staggerDelay={2}
  characterDuration={16}
  style={{ fontSize: 28, fontWeight: 700 }}
/>
```
