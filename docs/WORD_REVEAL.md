# WordReveal Component

## 1. Overview

The `WordReveal` component is a production-grade, frame-driven typography motion component for the **Remotion Motion Graphics Framework**.

Unlike whole-element animators, `WordReveal` segments a sentence into distinct word tokens and animates each word independently using configurable stagger intervals. It preserves readable whitespace, prevents mid-word line breaking, supports multi-line text, and calculates all transforms deterministically using Remotion native primitives (`useCurrentFrame()`, `interpolate()`, and `spring()`).

---

## 2. Key Capabilities

- **10 Deterministic Animation Variants**: Full parity with the core motion language (`fade`, `slide-up`, `slide-down`, `slide-left`, `slide-right`, `scale`, `pop`, `blur`, `rotate`, `fade-slide-up`).
- **Independent Stagger Pipeline**: Every word computes its own entrance start frame, easing, and optional exit lifecycle.
- **Predictable Word Segmentation**: Robust tokenization preserving punctuation, multiple consecutive spaces, and newlines (`\n`).
- **Reverse Reveal Order**: Allows the reveal animation to cascade in reverse (from last word to first word) while strictly preserving the visual reading order of the sentence.
- **Reverse Visual Order**: Allows explicit reversal of the rendered word order for specialized RTL or countdown layouts.
- **Multi-Line Text Safety**: Words are rendered as `display: inline-block` to support hardware-accelerated CSS transforms without splitting syllables, while whitespace spans are rendered as `display: inline` with `whiteSpace: pre-wrap` to guarantee standard browser line breaks.
- **Per-Word Styling**: Pass a custom style object or a dynamic callback `(word, index) => React.CSSProperties` to highlight keywords.

---

## 3. Component Props API

```typescript
export interface WordRevealProps {
  /** The text string to animate word by word */
  text: string;

  /** Animation preset variant (default: 'fade-slide-up') */
  variant?: WordRevealVariant;

  /** Frame at which the first word entrance begins (default: 0) */
  startFrame?: number;

  /** Total animation duration in frames. If provided without wordDuration, wordDuration is derived */
  durationInFrames?: number;

  /** Frame delay between each consecutive word reveal (default: 3) */
  staggerDelay?: number;

  /** Duration of animation for each individual word (default: 18) */
  wordDuration?: number;

  /** Optional frame at which exit animation starts */
  exitFrame?: number;

  /** Duration of exit animation per word in frames (default: 12) */
  exitDurationInFrames?: number;

  /** Frame delay between consecutive words during exit (default: staggerDelay) */
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

  /** Starting rotation in degrees for rotate variant (default: -8) */
  initialRotation?: number;

  /** Starting blur radius in pixels for blur variant (default: 10) */
  initialBlur?: number;

  /** If true, words animate in reverse sequence (last word reveals first; default: false) */
  reverse?: boolean;

  /** If true, reverses the visual rendering order of words (default: false) */
  reverseVisualOrder?: boolean;

  /** Direction mode: 'in' (entrance only), 'out' (exit only), 'both' (entrance and exit) */
  direction?: 'in' | 'out' | 'both';

  /** Whether to preserve multiple consecutive spaces and newlines (default: true) */
  preserveWhitespace?: boolean;

  /** Custom separator string or regex to segment text (default: /\s+/) */
  separator?: string | RegExp;

  /** Custom inline style overrides for the outer container */
  style?: React.CSSProperties;

  /** Custom inline style overrides for each word element, or a function returning styles per word */
  wordStyle?: React.CSSProperties | ((word: string, index: number) => React.CSSProperties);

  /** Custom CSS class name for the outer container */
  className?: string;

  /** Custom CSS class name for words, or a function returning class per word */
  wordClassName?: string | ((word: string, index: number) => string);

  /** HTML tag to render as the container element (default: 'div') */
  as?: React.ElementType;

  /** Text alignment (default: 'left') */
  align?: 'left' | 'center' | 'right' | 'justify';
}
```

---

## 4. Animation Variants

| Variant | Entrance Motion | Mathematical Transform |
| :--- | :--- | :--- |
| `fade` | Opacity alpha entrance | `opacity: 0 -> 1` |
| `slide-up` | Vertical rise from bottom | `translateY(+distance px -> 0px)` |
| `slide-down` | Vertical descent from top | `translateY(-distance px -> 0px)` |
| `slide-left` | Horizontal entrance from right | `translateX(+distance px -> 0px)` |
| `slide-right` | Horizontal entrance from left | `translateX(-distance px -> 0px)` |
| `scale` | Geometric zoom | `scale(initialScale -> 1.0)` |
| `pop` | Dynamic spring bounce | `createSpring(initialScale -> 1.0)` |
| `blur` | Gaussian blur-to-clear | `filter: blur(initialBlur px -> 0px)` |
| `rotate` | Rotational settle | `rotate(initialRotation deg -> 0deg)` |
| `fade-slide-up` | Coordinated rise + opacity | `opacity: 0 -> 1` + `translateY(+distance -> 0)` |

---

## 5. Word Segmentation & Whitespace Strategy

The component implements `segmentText()`:

1. **Separation into Word and Whitespace Tokens**:
   - The string is split using capturing regex groups: `text.split(/(\s+)/)`.
   - Non-whitespace substrings become **word tokens** (`isWord: true`, with sequential `wordIndex`).
   - Whitespace substrings become **whitespace tokens** (`isWord: false`, `wordIndex: -1`).
2. **Punctuation Attachment**:
   - Punctuation directly adjacent to words (e.g. `"Hello,"`, `"world!"`, `"(Ready?)"`) remains attached to the word. This prevents trailing commas or question marks from wrapping onto new lines alone.
3. **Space Preservation**:
   - Multiple spaces (e.g. `"Move    faster"`) and explicit line breaks (`\n`) are preserved in the whitespace token and rendered with `whiteSpace: 'pre-wrap'`.
4. **Rendering Semantics**:
   - Word spans: `display: inline-block` ensures hardware-accelerated CSS transforms operate without breaking words across characters.
   - Whitespace spans: `display: inline; whiteSpace: pre-wrap;` allows the browser's native text layout engine to wrap lines naturally at word boundaries.

---

## 6. Stagger & Reverse Behavior

### Standard Stagger
For word index $i$ in a sentence of $N$ words:
$$\text{wordStartFrame} = \text{startFrame} + \text{delay} + (i \times \text{staggerDelay})$$

### Reverse Reveal (`reverse: true`)
When `reverse={true}`, the stagger sequence is inverted while maintaining visual layout order:
$$\text{effectiveIndex} = (N - 1) - i$$
$$\text{wordStartFrame} = \text{startFrame} + \text{delay} + (\text{effectiveIndex} \times \text{staggerDelay})$$

- The last word appears first at `startFrame`.
- The first word appears last at $\text{startFrame} + (N - 1) \times \text{staggerDelay}$.
- The sentence still reads left-to-right: `"Move faster with better experiences"`.

---

## 7. Usage Examples

### Basic Usage
```tsx
import { WordReveal } from '@/components/typography';

export const Headline = () => (
  <WordReveal
    text="Move faster with better experiences"
    variant="fade-slide-up"
    startFrame={0}
    staggerDelay={3}
    wordDuration={18}
  />
);
```

### Keyword Highlighting with `wordStyle`
```tsx
<WordReveal
  text="Empowering smarter rides and seamless urban journeys"
  variant="fade-slide-up"
  startFrame={10}
  staggerDelay={4}
  wordDuration={20}
  style={{ fontSize: 32, fontWeight: 700 }}
  wordStyle={(word) => {
    if (word.includes('smarter')) return { color: '#00D1FF' };
    if (word.includes('seamless')) return { color: '#10B981' };
    return { color: '#FFFFFF' };
  }}
/>
```

### Spring-Based Pop Entrance
```tsx
<WordReveal
  text="Go anywhere. Get anything."
  variant="pop"
  springPreset="bouncy"
  startFrame={5}
  staggerDelay={5}
  style={{ fontSize: 44, fontWeight: 800 }}
/>
```

### Multi-Line Headline with Newlines
```tsx
<WordReveal
  text={'Next-Generation Mobility.\nDesigned for Global Scale.\nDelivered on Demand.'}
  variant="slide-up"
  startFrame={0}
  staggerDelay={3}
  wordDuration={16}
  style={{ fontSize: 24, lineHeight: 1.5 }}
/>
```

---

## 8. Known Limitations & Multilingual Segmentation

- **Whitespace Segmentation**: This initial implementation segments words based on whitespace and standard separators.
- **Languages Without Word Spacing**: Languages such as Japanese, Chinese (Hanzi), and Thai do not use whitespace between words. For these languages, future phases will introduce `Intl.Segmenter` granularity (`granularity: 'word'`) or a dedicated `CharacterReveal` component.
- **RTL Language Support**: While `reverseVisualOrder` can reverse word DOM order, full Arabic and Hebrew bidirectional script shaping requires standard CSS `dir="rtl"` applied to the container.
