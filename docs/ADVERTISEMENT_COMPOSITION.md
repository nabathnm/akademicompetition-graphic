# AdvertisementComposition Component Documentation

`AdvertisementComposition` is the primary Layer 4 composition container in the Remotion Motion Graphics Framework. It acts as the assembly foundation for orchestrating multiple reusable scenes (`HeroScene`, `ProductShowcaseScene`, `FeatureHighlightScene`, `TypographyScene`, `DeviceShowcaseScene`, `ComparisonScene`, `CallToActionScene`, `OutroScene`) and audio tracks into a unified, broadcast-compliant commercial video.

---

## 1. Architecture & Design Principles

```
                   ┌───────────────────────────────────┐
                   │    AdvertisementComposition       │
                   └─────────────────┬─────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│ Background Layer  │       │  Sequenced Scenes │       │   Audio Layers    │
│ • Solid / Gradient│       │ • Remotion        │       │ • Multi-Track     │
│ • Particle Canvas │       │   <Sequence>      │       │ • Deterministic   │
│ • Ambient Spotlight       │ • SceneSchedule   │       │   Fade Curves     │
└───────────────────┘       └─────────┬─────────┘       └───────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │  Broadcast Safe Area Boundary     │
                    │   • 60px Safe Margins (1080p/4K)  │
                    │   • Visual Telemetry HUD Overlay  │
                    └───────────────────────────────────┘
```

### Deterministic Timeline Architecture
- **Pure Frame Mathematics**: Scene sequencing and audio fades are evaluated strictly on frame numbers via `useCurrentFrame()`. Never relies on `requestAnimationFrame`, browser clocks, or runtime timers.
- **Remotion Sequence Isolation**: Each scheduled scene is wrapped in Remotion's `<Sequence from={start} durationInFrames={duration}>`. Inside each scene, local frames reset cleanly to 0, ensuring seamless compatibility with all Layer 2 and Layer 3 components.
- **Safe Area Compliance**: Built-in broadcast standard margins (default 60px) prevent UI elements, subtitles, or action buttons from clipping on television displays, mobile notches, or platform overlays.

---

## 2. Component Properties (`AdvertisementCompositionProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `width` | `number` | `1920` (or video config) | Video canvas width in pixels |
| `height` | `number` | `1080` (or video config) | Video canvas height in pixels |
| `fps` | `number` | `30` (or video config) | Frame rate in frames per second |
| `durationInFrames` | `number` | Auto-derived from scenes | Total composition duration in frames |
| `background` | `string` | `undefined` | CSS background (linear/radial gradient, pattern) |
| `backgroundColor` | `string` | `Colors.dark.bgPrimary` | Solid background fallback color |
| `backgroundContent` | `React.ReactNode` | `undefined` | React element rendered behind scenes (particle canvas, ambient loops) |
| `scenes` | `SceneItemConfig[]` | `[]` | Sequenced scenes timeline definition |
| `audio` | `AudioTrackConfig \| AudioTrackConfig[]` | `undefined` | Audio tracks with volume envelopes |
| `safeArea` | `boolean \| number` | `true` | Broadcast safe area margin (60px default) |
| `debug` | `boolean` | `false` | Visual telemetry HUD overlay toggle |
| `compositionId` | `string` | `'advertisement-composition'` | Unique identifier for profiling |
| `children` | `React.ReactNode` | `undefined` | Direct children (alternative to `scenes` array) |
| `style` | `React.CSSProperties` | `undefined` | Inline style overrides |
| `className` | `string` | `undefined` | CSS class name |

---

## 3. Scene Scheduling (`SceneItemConfig`)

Each scene item within the `scenes` array conforms to:

```typescript
export interface SceneItemConfig {
  /** Unique identifier for the scene */
  id: string;
  /** Scene component element or render callback */
  component: React.ReactNode | React.FC<{ frame: number; durationInFrames: number }>;
  /** Duration in frames allocated for this scene */
  durationInFrames: number;
  /** Explicit starting frame offset (if omitted, auto-calculated sequentially) */
  startFrame?: number;
  /** Human-readable scene name for debugging */
  name?: string;
}
```

### Auto-Sequence vs. Explicit Timing
- When `startFrame` is omitted, `calculateSceneSchedule` automatically stacks scenes consecutively:
  - Scene 1: Frame `0` to `duration1`
  - Scene 2: Frame `duration1` to `duration1 + duration2`
- When `startFrame` is explicitly specified, scenes can overlap or start at designated milestones.

---

## 4. Audio Mixing & Volume Envelopes

`calculateAudioVolume` deterministically computes volume multipliers on every frame based on:
- `startAtFrame`: Frame when audio playback starts.
- `fadeInFrames`: Linear fade-in duration from 0 to target volume.
- `fadeOutFrames`: Linear fade-out duration to 0 at the composition's end.
- `volume`: Constant multiplier or dynamic function `(frame: number) => number`.

---

## 5. Development Validation

`validateAdvertisementConfig` verifies parameters in development mode (`process.env.NODE_ENV !== 'production'`):
- **Positive Dimensions**: Validates `width > 0`, `height > 0`, `fps > 0`, `durationInFrames > 0`.
- **Scene Integrity**: Detects empty scene IDs, duplicate IDs, negative start frames, and scene durations exceeding composition bounds.
- **Audio Integrity**: Catches missing `src` paths, negative fade durations, and invalid volume values.

---

## 6. Usage Examples

### Example 1: Multi-Scene Commercial Assembly
```tsx
import { AdvertisementComposition } from './compositions';
import { HeroScene, FeatureHighlightScene, CallToActionScene, OutroScene } from './components/scenes';

export const CommercialAd = () => (
  <AdvertisementComposition
    compositionId="brand-launch-2026"
    durationInFrames={180}
    background="linear-gradient(135deg, #091326 0%, #040711 50%, #0c1833 100%)"
    safeArea={true}
    debug={false}
    scenes={[
      {
        id: 'hero',
        name: 'Brand Introduction',
        durationInFrames: 50,
        component: (
          <HeroScene
            headline="Autonomous Video Synthesis"
            subtitle="Commercial Engine v4"
            eyebrow="ANNOUNCING"
            layout="split-left"
          />
        ),
      },
      {
        id: 'feature',
        name: 'Feature Spotlight',
        durationInFrames: 50,
        component: (
          <FeatureHighlightScene
            title="Sub-Frame Precision"
            description="Deterministic frame rendering with hardware acceleration."
            benefit="120 FPS Fidelity"
            layout="text-left"
          />
        ),
      },
      {
        id: 'cta',
        name: 'Call to Action',
        durationInFrames: 50,
        component: (
          <CallToActionScene
            headline="Start Building Today"
            description="Experience seamless video composition with Remotion."
            primaryAction="Launch Platform"
          />
        ),
      },
      {
        id: 'outro',
        name: 'Brand Outro',
        durationInFrames: 30,
        component: (
          <OutroScene
            brandName="ANTIGRAVITY"
            website="antigravity.io"
          />
        ),
      },
    ]}
    audio={{
      src: 'https://cdn.example.com/audio/cyberpunk-ambient.mp3',
      volume: 0.85,
      fadeInFrames: 15,
      fadeOutFrames: 20,
    }}
  />
);
```

### Example 2: Single Scene with Custom Ambient Background
```tsx
export const SpotlightAd = () => (
  <AdvertisementComposition
    durationInFrames={90}
    background="radial-gradient(circle at 50% 30%, #0e1e3b 0%, #03050c 100%)"
    backgroundContent={<ParticleSystem density="sparse" />}
    safeArea={true}
  >
    <HeroScene
      headline="Next-Gen Architecture"
      subtitle="Pure React Motion Graphics"
    />
  </AdvertisementComposition>
);
```
