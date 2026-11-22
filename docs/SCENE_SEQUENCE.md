# SceneSequence

`SceneSequence` is a production-ready timeline orchestrator component for the **Remotion Motion Graphics Framework** (Layer 3: Scene Library). It allows developers to assemble and schedule multiple reusable scene components into a cohesive, sequential advertisement video timeline without manually calculating start frames, offsets, or managing timing drift.

---

## 1. Architectural Highlights

- **Deterministic Frame Mathematics**: Operates exclusively on frame counters and Remotion `<Sequence>` boundaries, ensuring 100% reproducible frame rendering across local previews and headless CI/CD rendering nodes.
- **Dual Authoring Syntax**:
  1. **Declarative Array API**: Pass a typed `scenes: SceneSequenceItemConfig[]` array.
  2. **Composable JSX API**: Use `<SceneSequenceItem>` child elements directly in JSX.
- **Automated Sequential Scheduling**: Automatically calculates sequential start offsets (`computedStartFrame` and `computedEndFrame`) based on durations and preceding scene boundaries.
- **Inter-Scene Delays**: Supports both pre-scene delays (`delayBefore`), post-scene holds (`delayAfter`), and global timeline spacing (`defaultDelay`).
- **Overlap Prevention**: Enforces zero accidental scene collisions (`allowOverlap: false` by default). If a developer specifies a manual `startFrame` that collides with the previous scene's lifespan, `SceneSequence` automatically pushes the scene to the previous scene's completion frame and issues a development warning.
- **Layer 2 Transition Integration**: Directly wraps scene content in production transition components (`FadeTransition`, `SlideTransition`, `ZoomTransition`, `WipeTransition`) with customizable easing curves and directional parameters.
- **AdvertisementComposition Integration**: Powers `AdvertisementComposition` under the hood, enabling multi-scene commercial ads with audio layering, broadcast safe areas, and telemetry HUD overlays.

---

## 2. Component API Reference

### `<SceneSequence />` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `scenes` | `SceneSequenceItemConfig[]` | `[]` | Array of scene configurations to sequence. |
| `defaultDelay` | `number` | `0` | Default gap in frames between scenes when `delayBefore` is omitted. |
| `defaultTransition` | `SceneTransitionConfig` | `undefined` | Default transition applied to scenes without explicit transition settings. |
| `allowOverlap` | `boolean` | `false` | Global flag permitting scene overlap when manual `startFrame` is specified. |
| `debug` | `boolean` | `false` | Visual telemetry HUD overlay showing timeline bar, frame counter, and active scene status. |
| `onScheduleCalculated` | `(schedule: ScheduledSceneItem[]) => void` | `undefined` | Callback fired once schedule offsets are resolved. |
| `style` | `React.CSSProperties` | `undefined` | Custom inline style for container. |
| `className` | `string` | `undefined` | Custom CSS class name. |
| `children` | `React.ReactNode` | `undefined` | Declarative `<SceneSequenceItem>` child elements. |

---

### `SceneSequenceItemConfig` Structure

```typescript
export interface SceneSequenceItemConfig {
  /** Unique scene identifier (must be unique within sequence) */
  id: string;

  /** Human-readable scene name for debugging, logging, and telemetry */
  name?: string;

  /** Scene component element, FC, or render function */
  component:
    | React.ReactNode
    | React.FC<SceneItemRenderProps>
    | ((props: SceneItemRenderProps) => React.ReactNode);

  /** Duration in frames allocated for this scene */
  durationInFrames: number;

  /** Explicit starting frame offset (if omitted, auto-calculated sequentially) */
  startFrame?: number;

  /** Delay in frames before this scene starts */
  delayBefore?: number;

  /** Delay in frames after this scene finishes before the next scene starts */
  delayAfter?: number;

  /** Transition configuration applied to entrance or both in/out */
  transition?: SceneTransitionConfig;

  /** Transition specifically for entrance */
  entranceTransition?: SceneTransitionConfig;

  /** Transition specifically for exit */
  exitTransition?: SceneTransitionConfig;

  /** Explicit flag permitting overlap with preceding scene */
  allowOverlap?: boolean;

  /** Custom properties passed to render function */
  props?: Record<string, unknown>;

  /** Optional style override for this scene wrapper */
  style?: React.CSSProperties;

  /** Optional className for this scene wrapper */
  className?: string;
}
```

---

### `SceneTransitionConfig`

```typescript
export interface SceneTransitionConfig {
  /** Transition type preset ('fade' | 'slide' | 'zoom' | 'wipe' | 'none') */
  type?: 'fade' | 'slide' | 'zoom' | 'wipe' | 'none';

  /** Transition duration in frames (default: 15) */
  durationInFrames?: number;

  /** Direction for directional transitions ('left' | 'right' | 'top' | 'bottom') */
  direction?: 'left' | 'right' | 'top' | 'bottom';

  /** Easing curve preset name */
  easing?: EasingPresetName;
}
```

---

## 3. Mathematical & Timeline Scheduling Model

The scheduling engine computes `computedStartFrame` and `computedEndFrame` for every scene:

```
computedStartFrame = 
  scene.startFrame !== undefined
    ? (!allowOverlap && scene.startFrame < cursorFrame ? cursorFrame : scene.startFrame)
    : cursorFrame + (scene.delayBefore ?? defaultDelay);

computedEndFrame = computedStartFrame + scene.durationInFrames;
cursorFrame = computedEndFrame + (scene.delayAfter ?? 0);
```

### Overlap Prevention

```
Scene 1: [=================== 0 to 60f ===================]
Scene 2: (attempted startFrame = 40f, allowOverlap = false)
Result:  Collision prevented! Scene 2 starts at 60f.
         [=================== 60 to 120f ===================]
```

When `allowOverlap: true` or `scene.allowOverlap: true`:
```
Scene 1: [=================== 0 to 60f ===================]
Scene 2:                [========== 40 to 100f ==========] (cross-fading)
```

---

## 4. Usage Examples

### Example 1: Basic Two-Scene Sequence

```tsx
import { SceneSequence } from '@/components/scenes/SceneSequence';
import { HeroScene } from '@/components/scenes/HeroScene';
import { CallToActionScene } from '@/components/scenes/CallToActionScene';

export const MyTwoSceneAd: React.FC = () => {
  return (
    <SceneSequence
      scenes={[
        {
          id: 'hero',
          durationInFrames: 60,
          component: (
            <HeroScene
              headline="The Future of Video is Code"
              subtitle="Build programmatic motion graphics."
            />
          ),
        },
        {
          id: 'cta',
          durationInFrames: 60,
          component: (
            <CallToActionScene
              headline="Get Started in Seconds"
              primaryAction="Start Free Trial"
            />
          ),
        },
      ]}
    />
  );
};
```

---

### Example 2: Scenes with Delays and Transitions

```tsx
import { SceneSequence } from '@/components/scenes/SceneSequence';
import { HeroScene } from '@/components/scenes/HeroScene';
import { FeatureHighlightScene } from '@/components/scenes/FeatureHighlightScene';
import { OutroScene } from '@/components/scenes/OutroScene';

export const CinematicSequence: React.FC = () => {
  return (
    <SceneSequence
      defaultDelay={10}
      scenes={[
        {
          id: 'intro',
          name: 'Hero Intro',
          durationInFrames: 50,
          transition: { type: 'fade', durationInFrames: 15 },
          component: <HeroScene headline="Hyper Fluid Motion" />,
        },
        {
          id: 'feature',
          name: 'Key Feature',
          durationInFrames: 60,
          delayBefore: 20, // 20 frames gap
          transition: { type: 'slide', direction: 'left', durationInFrames: 15 },
          component: <FeatureHighlightScene featureTitle="Instant Preview" />,
        },
        {
          id: 'outro',
          name: 'Brand Closing',
          durationInFrames: 40,
          transition: { type: 'zoom', durationInFrames: 15 },
          component: <OutroScene brandName="Nova Motion" website="novamotion.dev" />,
        },
      ]}
    />
  );
};
```

---

### Example 3: Declarative JSX Syntax

```tsx
import { SceneSequence, SceneSequenceItem } from '@/components/scenes/SceneSequence';
import { HeroScene } from '@/components/scenes/HeroScene';
import { CallToActionScene } from '@/components/scenes/CallToActionScene';

export const DeclarativeTimeline: React.FC = () => {
  return (
    <SceneSequence debug={true}>
      <SceneSequenceItem id="hero" durationInFrames={75} transition={{ type: 'fade', durationInFrames: 15 }}>
        <HeroScene headline="Declarative Video Timelines" />
      </SceneSequenceItem>

      <SceneSequenceItem id="cta" durationInFrames={75} delayBefore={10}>
        <CallToActionScene headline="Launch Studio Today" primaryAction="Try Free" />
      </SceneSequenceItem>
    </SceneSequence>
  );
};
```

---

### Example 4: Full Commercial Pipeline in `AdvertisementComposition`

```tsx
import { AdvertisementComposition } from '@/compositions/advertisements/AdvertisementComposition';
import { HeroScene } from '@/components/scenes/HeroScene';
import { ProductShowcaseScene } from '@/components/scenes/ProductShowcaseScene';
import { CallToActionScene } from '@/components/scenes/CallToActionScene';

export const CommercialSpot: React.FC = () => {
  return (
    <AdvertisementComposition
      compositionId="q4-flagship-spot"
      background="radial-gradient(circle at 50% 20%, #152238 0%, #03060f 100%)"
      safeArea={true}
      debug={false}
      audio={{
        src: 'https://cdn.example.com/audio/upbeat-ad.mp3',
        fadeInFrames: 15,
        fadeOutFrames: 20,
      }}
      scenes={[
        {
          id: 'scene-1',
          name: 'Hook / Intro',
          durationInFrames: 45,
          transition: { type: 'fade', durationInFrames: 10 },
          component: <HeroScene headline="Meet the Future of Sound" />,
        },
        {
          id: 'scene-2',
          name: 'Flagship Headphones',
          durationInFrames: 60,
          transition: { type: 'slide', direction: 'left', durationInFrames: 15 },
          component: <ProductShowcaseScene title="Aura Pro Wireless" />,
        },
        {
          id: 'scene-3',
          name: 'Conversion Action',
          durationInFrames: 45,
          transition: { type: 'fade', durationInFrames: 10 },
          component: <CallToActionScene headline="Pre-order Now & Save 20%" primaryAction="Pre-Order" />,
        },
      ]}
    />
  );
};
```

---

## 5. Development Diagnostics & Validation

The `validateSceneSequence` function continuously monitors sequence configurations:

| Issue | Severity | Message | Remediation |
| :--- | :--- | :--- | :--- |
| Missing `id` | Error | `Scene at index X is missing a required unique 'id'.` | Provide a non-empty string `id` for each scene. |
| Duplicate `id` | Error | `Duplicate scene ID detected: 'X'. Scene IDs must be strictly unique.` | Ensure all scene IDs are distinct. |
| Invalid Duration | Error | `Scene 'X' has invalid durationInFrames: 0. Duration must be greater than 0.` | Set `durationInFrames > 0`. |
| Missing Component | Error | `Scene 'X' is missing a 'component' or React element.` | Supply a valid JSX element or render callback. |
| Negative Delays | Error | `Scene 'X' has negative or non-numeric delayBefore: -10` | Ensure delay values are `>= 0`. |
| Unintended Overlap | Warning | `Scene 'X' startFrame (30) overlaps with previous scene boundary (60). Overlap is prevented; scene will be adjusted.` | Set `allowOverlap={true}` on scene or parent if overlap is intentional. |
