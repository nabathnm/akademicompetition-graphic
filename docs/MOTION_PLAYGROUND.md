# Motion Playground Guide

`MotionPlayground` is the Layer 1 testing, evaluation, and inspection environment in the Remotion Motion Graphics Framework. It provides an isolated development sandbox for prototyping atomic motion components, testing animation dynamics, evaluating physics curves, and comparing A/B variants without requiring full commercial advertisement assembly.

---

## 1. Architectural Role

```
┌────────────────────────────────────────────────────────┐
│             Layer 1: Motion Playground                 │
│      (Interactive inspection, telemetry, A/B tuning)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             Layer 2: Component Library                 │
│       Typography, UI, Graphics, Mockups, Transitions   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               Layer 3: Scene Library                   │
│         Pre-composed commercial scene templates        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│         Layer 4: Advertisement Assembly                │
│       Multi-scene sequence, audio, rendering           │
└────────────────────────────────────────────────────────┘
```

The Motion Playground guarantees:
- **Zero Production Coupling**: New components can be developed, tested, and fine-tuned in isolation before being added to any production scene.
- **Deterministic Frame Verification**: Inspect frame-by-frame rendering at any frame index from 0 to composition duration.
- **Live Telemetry & Diagnostics**: Real-time display of canvas dimensions, framerate, current frame, SMPTE timecode (`HH:MM:SS:FF`), active category, and component metadata.

---

## 2. Playground View Modes

`MotionPlayground` supports 10 dedicated view modes via the `viewMode` prop:

| View Mode | Purpose | Description |
|:---|:---|:---|
| `'overview'` | System Catalog | Displays all registered showcases grouped by category with status badges, variant counts, and quick-preview cards. |
| `'utilities'` | Engine Diagnostics | Visual diagnostics for core motion utilities: spring presets, interpolate curves, easing curves, and timeline progress. |
| `'typography'` | Typography Suite | Interactive showcase tabs for `AnimatedText`, `WordReveal`, `CharacterReveal`, `TextMask`, `TextHighlight`, and `SplitText`. |
| `'ui'` | UI Components | Interactive showcase tabs for `AnimatedButton`, `AnimatedInput`, `AnimatedSearchBar`, `AnimatedCard`, `AnimatedNotification`, `AnimatedToggle`, and `AnimatedCheckbox`. |
| `'mockups'` | Device Mockups | Interactive showcase tabs for `DeviceFrame`, `SmartphoneMockup`, `BrowserWindowMockup`, `LaptopMockup`, and `TabletMockup`. |
| `'graphics'` | Vector & Shapes | Interactive showcase tabs for `AnimatedArrow`, `AnimatedCircle`, `AnimatedLine`, `AnimatedShape`, `AnimatedPath`, and `ParticleSystem`. |
| `'transitions'` | Transition Suite | Interactive showcase tabs for `FadeTransition`, `SlideTransition`, `ZoomTransition`, `WipeTransition`, `MaskTransition`, `SplitTransition`, `MorphTransition`, `GlitchTransition`, and `TransitionController`. |
| `'scenes'` | Scene Templates | Interactive showcase tabs for `SceneContainer`, `HeroScene`, `ProductShowcaseScene`, `FeatureHighlightScene`, `TypographyScene`, `DeviceShowcaseScene`, `ComparisonScene`, `CallToActionScene`, `OutroScene`, `SceneSequence`, `TimelineManager`, `GlobalAnimationConfig`, `AdvertisementPreview`, `ComponentIntegration`, and `AudioTimelineSync`. |
| `'comparison'` | A/B Testing | Side-by-side comparison harness rendering Variant A and Variant B synchronously for spring tuning and easing evaluation. |
| `'isolated'` | Single Component | Full-canvas isolated rendering of a single component specified by `activeComponentId`. |

---

## 3. Playground Properties (`MotionPlaygroundProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `selectedCategory` | `ComponentCategory \| 'all'` | `'all'` | Filters the displayed showcases by category (`'motion'`, `'typography'`, `'ui'`, `'mockups'`, `'graphics'`, `'transitions'`, `'scenes'`). |
| `viewMode` | `PlaygroundViewMode` | `'overview'` | Layout view mode (see table above). |
| `activeComponentId` | `string` | `undefined` | Component identifier when running in `'isolated'` mode. |
| `variantA` | `string` | `'Snappy Spring'` | Name/parameters for Variant A in side-by-side comparison mode. |
| `variantB` | `string` | `'Smooth Spring'` | Name/parameters for Variant B in side-by-side comparison mode. |
| `showGrid` | `boolean` | `true` | Toggles subtle background coordinate alignment grid. |

---

## 4. Telemetry Header & Diagnostic HUD

The Playground Shell includes a persistent header featuring:
1. **Brand Identity**: Monospaced design system badge (`AGY MOTION LAB / STUDIO`).
2. **Category Switcher Navigation**: Instant switching between All, Typography, UI, Mockups, Graphics, Transitions, Scenes, Comparison, and Diagnostics.
3. **Telemetry HUD**:
   - **Resolution**: `1920 × 1080` (or active resolution preset).
   - **FPS**: `30 FPS` / `60 FPS`.
   - **Frame Indicator**: `FRAME: 0045 / 0090`.
   - **SMPTE Timecode**: `00:00:01:15`.
   - **Showcase Count**: Total ready vs planned components.

---

## 5. Showcase Registry (`SHOWCASE_REGISTRY`)

All components in the framework register their showcase metadata declaratively in `src/playground/showcases/showcaseRegistry.ts`:

```typescript
export interface ShowcaseDefinition {
  id: string;                                          // Unique identifier (e.g. 'typo-animated-text')
  name: string;                                        // Display name
  category: ComponentCategory;                        // Category ('typography' | 'ui' | 'mockups' | etc.)
  description: string;                                 // Short capability description
  variants: string[];                                  // Array of available variants
  status: 'planned' | 'in-development' | 'ready';     // Release status
  component?: React.ComponentType<{ variant?: string }>; // Optional showcase wrapper
}
```

### Adding a New Component Showcase

To add a new component to the Motion Playground:

1. **Create the Showcase Component** in `src/playground/showcases/MyComponentShowcase.tsx`:
   ```tsx
   import React, { useState } from 'react';
   import { MyComponent } from '../../components/my-category/MyComponent';

   export const MyComponentShowcase: React.FC = () => {
     const [variant, setVariant] = useState('default');
     return (
       <div>
         {/* Variant selection pills */}
         <MyComponent variant={variant} />
       </div>
     );
   };
   ```

2. **Register in `showcaseRegistry.ts`**:
   ```typescript
   {
     id: 'my-category-my-component',
     name: 'MyComponent',
     category: 'ui',
     description: 'Commercial UI widget with spring physics',
     variants: ['default', 'elevated', 'minimal'],
     status: 'ready',
   }
   ```

3. **Export from `src/playground/showcases/index.ts`** and connect inside `MotionPlayground.tsx`.

---

## 6. Running Motion Playground

To open the Motion Playground in interactive Remotion Studio:

```bash
npm run dev
```

Navigate to `http://localhost:3000` and select the `MotionPlayground` composition in the sidebar. You can adjust props (`selectedCategory`, `viewMode`, `showGrid`) in the Studio Properties panel.
