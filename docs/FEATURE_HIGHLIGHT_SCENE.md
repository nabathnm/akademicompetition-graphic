# FeatureHighlightScene Component Documentation

`FeatureHighlightScene` is a dedicated feature spotlight scene template for the Remotion Motion Graphics Framework (Layer 3). It highlights one critical product feature, technical capability, or performance benefit through kinetic typography, benefit callout pills, and visual annotations.

---

## 1. Architecture & Design Principles

```
                  ┌─────────────────────────────────────┐
                  │       FeatureHighlightScene         │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                  ┌─────────────────────────────────────┐
                  │          SceneContainer             │
                  │   • Dimension Auto-Resolution       │
                  │   • Safe Area Bounds (60px)         │
                  │   • Ambient Atmosphere Layers       │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ calculateFeatureHighlightKinematics()                       │
        │   • Visual Entrance:   slide-up / scale / fade              │
        │   • Benefit Pulse:     1 + sin(frame * 0.1) * 0.03          │
        │   • Stagger Sequence:  label -> title -> desc -> benefit    │
        │   • Annotations:       staggered pop-in with callout pins   │
        └─────────────────────────────┬───────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ Layout Staging Variations:                                  │
        │   1. text-left:         [ Text Block 50% ]  [ Visual 50% ]  │
        │   2. text-right:        [ Visual 50% ]  [ Text Block 50% ]  │
        │   3. centered:          [ Centered Text & Centered Visual ] │
        │   4. with-annotations:  [ Visual + Highlight Pointer Pins ] │
        │   5. full-visual:       [ Full Bleed Visual + Overlay Card ]│
        └─────────────────────────────────────────────────────────────┘
```

### Pulsing Benefit Statement Pill
The `benefit` slot renders a distinctive high-contrast tag pill with a subtle, continuous breathing pulse animation ($1 + \sin(frame \times 0.1) \times 0.03$), focusing viewer attention on the core value proposition.

### Visual Callout Annotations
`annotations` allow developers to position pins with badges, titles, and descriptions over or beside UI mockups, hardware buttons, or dashboard cards, highlighting specific functional components.

---

## 2. Layout Variations

- **`text-left` (Default)**:
  Feature narrative and benefit pill on the left column (50-55%), visual asset on the right (45-50%).
- **`text-right`**:
  Visual asset on the left column, feature narrative on the right.
- **`centered`**:
  Centered typography stack positioned above a prominent feature visual.
- **`with-annotations`**:
  Visual framed with callout annotation badges pointing to specific architectural details.
- **`full-visual`**:
  Full-bleed visual with an overlaid glassmorphism feature explanation card.

---

## 3. Component Properties (`FeatureHighlightSceneProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `title` | `React.ReactNode` | *(Required)* | Feature title or capability headline |
| `description` | `React.ReactNode` | *(Required)* | Detailed feature narrative |
| `label` | `React.ReactNode` | `undefined` | Category badge or feature identifier |
| `benefit` | `React.ReactNode` | `undefined` | Highlighted benefit statement pill |
| `icon` | `React.ReactNode` | `undefined` | Feature icon or glyph |
| `children` | `React.ReactNode` | `undefined` | Main feature visual content |
| `featureVisual` | `React.ReactNode` | `undefined` | Slot alias for feature visual |
| `annotations` | `FeatureAnnotationItem[]` | `[]` | Callout annotation pins positioned over the visual |
| `decorativeElements` | `React.ReactNode` | `undefined` | Ambient graphic layer |
| `layout` | `FeatureHighlightLayout` | `'text-left'` | Layout structure variation |
| `background` | `string` | `undefined` | CSS background gradient |
| `backgroundColor` | `string` | `Colors.dark.bgPrimary`| Solid background color |
| `animation` | `FeatureHighlightAnimationConfig`| `undefined`| Animation and stagger timing config |
| `staggerDelay` | `number` | `4` | Stagger delay in frames |
| `durationInFrames` | `number` | `undefined` | Scene duration in frames |
| `delay` | `number` | `0` | Delay before entrance starts |
| `padding` | `ScenePadding` | `64` | Inner content padding |
| `safeArea` | `boolean \| number` | `true` | Broadcast safe area margin (60px) |
| `sceneId` | `string` | `'feature-highlight-scene'` | Scene identifier |
| `debug` | `boolean` | `false` | Visual debug overlay |

---

## 4. Usage Example

```tsx
import { FeatureHighlightScene } from '@/components/scenes/FeatureHighlightScene';
import { BrowserWindowMockup } from '@/components/mockups/BrowserWindowMockup';

export const EdgePipelineFeature = () => {
  return (
    <FeatureHighlightScene
      layout="text-left"
      label="PERFORMANCE & OBSERVABILITY"
      title="Sub-Millisecond Edge Ingestion"
      benefit="10x Faster Realtime Telemetry"
      description="Our distributed consensus architecture routes telemetry packets across the closest edge regions, eliminating cold starts."
      annotations={[
        { title: 'Edge Routing', description: '0.2ms latency', x: 70, y: 20 },
        { title: 'Hardware Security', description: 'Hardware enclave', x: 65, y: 75 },
      ]}
    >
      <BrowserWindowMockup width={560} height={320} title="telemetry.cloud.io" />
    </FeatureHighlightScene>
  );
};
```
