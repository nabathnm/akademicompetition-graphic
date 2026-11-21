# AnimatedSearchBar Component

## 1. Overview

The `AnimatedSearchBar` component is a reusable UI motion component for the **Remotion Motion Graphics Framework** (`Layer 2: Component Library`).

It simulates a complete, realistic search interaction flow commonly seen in premium mobile applications and digital product demonstrations (such as Uber, Apple Maps, Airbnb, and DoorDash). The component orchestrates frame-accurate container entrance animations, input field focus, character typing (reusing `AnimatedInput`), query suggestions dropdown, suggestion selection, submission button feedback (reusing `AnimatedButton`), loading feedback, and staggered search results with an empty state fallback.

All motion is 100% frame-deterministic, calculated via `useCurrentFrame()`. It uses **no CSS transitions**, ensuring perfect frame-by-frame reproducibility in parallel Remotion video rendering.

---

## 2. Key Capabilities

- **8 Sequential Interaction Stages**:
  1. `idle`: Container rests or enters before input acquires focus.
  2. `focus`: Search field receives glowing focus ring and blinking cursor.
  3. `typing`: Character-by-character typewriter typing simulation.
  4. `suggestions`: Floating dropdown panel appears below search row, revealing staggered query suggestions.
  5. `selected`: Target suggestion at `selectedIndex` is highlighted with brand accent background and check indicator; search input updates to the selected suggestion text.
  6. `submitted`: Submit button compresses and activates press feedback.
  7. `loading`: Loading spinner activates to simulate async query processing.
  8. `results`: Suggestions close and search result cards reveal sequentially with staggered slide-up entrances (or empty state card).

- **5 Visual Presentation Variants**:
  1. `outlined`: Modern high-contrast dark container (`Colors.dark.surface1`) with subtle border and brand focus glow.
  2. `filled`: Elevated surface (`Colors.dark.surface2`) with low-contrast borders for dense content canvases.
  3. `minimal`: Transparent container with subtle divider baseline.
  4. `rounded`: Full pill shape (`borderRadius: 9999px`) optimized for mobility search bars and floating map overlays.
  5. `expanded`: Container scales horizontally from center upon entrance.

- **4 Container Entrance Presets**:
  - `fade-in`: Smooth opacity reveal.
  - `slide-in`: Directional entrance sliding down with opacity fade.
  - `scale-in`: Subtle scale enlargement (`0.94 -> 1.00`).
  - `expand-width`: Elastic horizontal expansion from center.
  - `none`: Instantly rendered without entrance delay.

- **Component Reuse & Composition**:
  - Seamlessly composes `AnimatedInput` for typing simulation, placeholder handling, cursor blinking, and clear button toggling.
  - Seamlessly composes `AnimatedButton` for submit button states, loading spinners, and success confirmation.

- **Proportional Size Presets**:
  - `sm`: 36px height, 13px font size, 14px icon size.
  - `md`: 44px height, 15px font size, 16px icon size.
  - `lg`: 52px height, 17px font size, 20px icon size.

---

## 3. Data Structures

### 3.1 SearchSuggestion
```typescript
export interface SearchSuggestion {
  /** Unique identifier for key mapping */
  id: string | number;
  /** Suggestion title or destination query */
  text: string;
  /** Optional category badge (e.g. 'Airport', 'Café', 'Retail') */
  category?: string;
  /** Optional icon component or JSX node */
  icon?: LucideIcon | React.ReactNode;
}
```

### 3.2 SearchResult
```typescript
export interface SearchResult {
  /** Unique identifier for key mapping */
  id: string | number;
  /** Primary result headline / title */
  title: string;
  /** Descriptive summary or route instructions */
  description?: string;
  /** Category label */
  category?: string;
  /** Pill badge text (e.g. '18 min · $42.50', 'Top Pick') */
  badge?: string;
  /** Optional leading icon component or JSX node */
  icon?: LucideIcon | React.ReactNode;
  /** Technical or routing metadata displayed below description */
  metadata?: string;
}
```

---

## 4. Component Props API

```typescript
export interface AnimatedSearchBarProps {
  /** Target text string to type into the search bar */
  value?: string;

  /** Placeholder text shown when input is empty (default: 'Search...') */
  placeholder?: string;

  /** List of static search suggestions */
  suggestions?: SearchSuggestion[];

  /** List of static search results */
  results?: SearchResult[];

  /** Starting frame for container entrance animation (default: 0) */
  startFrame?: number;

  /** Frame at which search input acquires focus (default: 10) */
  focusFrame?: number;

  /** Frame at which character typing begins (default: 16) */
  typingStartFrame?: number;

  /** Frame at which suggestions dropdown appears (default: 28) */
  suggestionStartFrame?: number;

  /** Frame at which suggestion item is highlighted/selected (default: 48) */
  selectionFrame?: number;

  /** Index of suggestion to highlight/select (default: 0) */
  selectedIndex?: number;

  /** Frame at which search query is submitted (default: 60) */
  submitFrame?: number;

  /** Frame at which loading indicator activates (default: 64) */
  loadingStartFrame?: number;

  /** Frame at which search results stagger in (default: 80) */
  resultsStartFrame?: number;

  /** Frames per character during typing simulation (default: 2) */
  typingSpeed?: number;

  /** Frame offset between consecutive suggestions and results (default: 3) */
  staggerDelay?: number;

  /** Visual presentation variant (default: 'outlined') */
  variant?: 'minimal' | 'outlined' | 'filled' | 'rounded' | 'expanded';

  /** Size preset (default: 'md') */
  size?: 'sm' | 'md' | 'lg';

  /** Container entrance animation preset (default: 'fade-in') */
  containerEntrance?: 'fade-in' | 'slide-in' | 'expand-width' | 'scale-in' | 'none';

  /** Duration of container entrance in frames (default: 12) */
  entranceDuration?: number;

  /** Whether to show clear button icon when text is entered (default: true) */
  showClearButton?: boolean;

  /** Whether to display suggestions dropdown (default: true) */
  showSuggestions?: boolean;

  /** Whether to display results area (default: true) */
  showResults?: boolean;

  /** Whether to display submit button (default: true) */
  showSubmitButton?: boolean;

  /** Custom leading search icon */
  searchIcon?: LucideIcon | React.ReactNode;

  /** Label for submit button (default: 'Search') */
  submitLabel?: string;

  /** Message displayed when results list is empty */
  emptyResultsMessage?: string;

  /** Overall container width (default: '100%') */
  width?: string | number;

  /** Overall container max-width (default: 640) */
  maxWidth?: string | number;

  /** Custom styles for outer container */
  style?: React.CSSProperties;

  /** Custom styles for inner input */
  inputStyle?: React.CSSProperties;

  /** Custom styles for suggestion items */
  suggestionStyle?: React.CSSProperties;

  /** Custom styles for result cards */
  resultStyle?: React.CSSProperties;

  /** CSS class name */
  className?: string;
}
```

---

## 5. Interaction Sequence & Frame Timeline

```
[startFrame: Container Entrance]
       │
       ▼
 [focusFrame: Input Focus Highlight]
       │
       ▼
 [typingStartFrame: Typewriter Progression]
       │
       ▼
 [suggestionStartFrame: Staggered Dropdown Suggestions]
       │
       ▼
 [selectionFrame: Suggestion Selected & Copied to Input]
       │
       ▼
 [submitFrame: Submit Button Press Feedback]
       │
       ▼
 [loadingStartFrame: Async Loading Spinner]
       │
       ▼
 [resultsStartFrame: Staggered Result Cards Revealed]
```

---

## 6. Usage Examples

### 6.1 Mobility Ride Search
```tsx
import { AnimatedSearchBar } from '@/components/ui/AnimatedSearchBar';
import { Plane, Building, MapPin } from 'lucide-react';

export const AirportRideSearch = () => (
  <AnimatedSearchBar
    value="San Francisco International Airport"
    placeholder="Where to?"
    variant="rounded"
    size="md"
    startFrame={0}
    focusFrame={10}
    typingStartFrame={16}
    suggestionStartFrame={28}
    selectionFrame={48}
    selectedIndex={0}
    submitFrame={60}
    loadingStartFrame={64}
    resultsStartFrame={80}
    suggestions={[
      { id: '1', text: 'SFO Terminal 2 - Departures', category: 'Airport', icon: Plane },
      { id: '2', text: 'SFO Terminal 3 - United', category: 'Airport', icon: Plane },
      { id: '3', text: 'SFO International Terminal A', category: 'Airport', icon: Plane },
    ]}
    results={[
      {
        id: 'r1',
        title: 'Uber Black to SFO Terminal 2',
        description: 'Direct curb drop-off with priority valet',
        badge: '18 min · $48.50',
        metadata: 'Route via US-101 S',
      },
      {
        id: 'r2',
        title: 'UberX to SFO Terminal 2',
        description: 'Affordable ride for up to 4 passengers',
        badge: '20 min · $34.00',
        metadata: 'Route via I-280 S',
      },
    ]}
  />
);
```

### 6.2 Zero Results Fallback
```tsx
import { AnimatedSearchBar } from '@/components/ui/AnimatedSearchBar';

export const EmptySearchExample = () => (
  <AnimatedSearchBar
    value="Unknown Destination"
    placeholder="Search locations..."
    variant="outlined"
    size="md"
    startFrame={0}
    submitFrame={30}
    loadingStartFrame={34}
    resultsStartFrame={50}
    suggestions={[]}
    results={[]}
    emptyResultsMessage="No mobility pickup locations available"
  />
);
```

---

## 7. Architecture & Verification

- **Pure Functional Math**: Separated into `src/components/ui/animatedSearchBarStyle.ts` for unit testability without DOM dependencies.
- **Zero CSS Transitions**: All animations are computed frame-by-frame via `useCurrentFrame()`.
- **Unit Test Coverage**: Comprehensive suite in `tests/animated-search-bar.test.ts` validating all 8 interaction stages, proportional size metrics, container entrance styles, suggestions staggering, result cards, and edge cases.
- **Showcase Integration**: Registered in `src/playground/MotionPlayground.tsx` with dedicated interactive test harness in `src/playground/showcases/AnimatedSearchBarShowcase.tsx`.
