# DeviceShowcaseScene Component Documentation

`DeviceShowcaseScene` is a Layer 3 scene template designed for showcasing digital products, responsive web platforms, mobile applications, and SaaS dashboards across hardware mockup frames. It seamlessly composes Layer 2 Mockup components (`SmartphoneMockup`, `TabletMockup`, `LaptopMockup`, `BrowserWindowMockup`, `DeviceFrame`) and provides multi-device responsive arrangements, continuous floating hover physics, subtle tilt rotation, and hardware/software callout annotations.

---

## 1. Architecture & Design Principles

```
                   ┌───────────────────────────────────┐
                   │        DeviceShowcaseScene        │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
                   ┌───────────────────────────────────┐
                   │         SceneContainer            │
                   │   • Sizing & Safe Areas (60px)    │
                   │   • Ambient Backdrops & Radiants  │
                   └─────────────────┬─────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ calculateDeviceShowcaseKinematics()                         │
        │   • Label:         delay + 0f                               │
        │   • Title:         delay + stagger * 1                      │
        │   • Subtitle:      delay + stagger * 2                      │
        │   • Devices[i]:    delay + stagger * 1 + i * stagger        │
        │   • Annotations[i]:delay + stagger * 4 + i * stagger        │
        │   • Floating Y:    sin(frame * freq + phase) * amplitude    │
        │   • Tilt Angle:    sin(frame * tiltFreq) * maxAngle         │
        └─────────────────────────────┬───────────────────────────────┘
                                     │
                                     ▼
        ┌─────────────────────────────────────────────────────────────┐
        │ Composed Hardware Mockups:                                  │
        │   • SmartphoneMockup:    Mobile app UIs with notch/glare    │
        │   • TabletMockup:        Portrait or landscape tablet frames│
        │   • LaptopMockup:        Chassis finish, keyboard & lid     │
        │   • BrowserWindowMockup: Browser tabs & address bar chrome  │
        │   • DeviceFrame:         Custom hardware bezels             │
        └─────────────────────────────────────────────────────────────┘
```

---

## 2. Layout Variations

`DeviceShowcaseScene` supports 7 distinct layout modes:

1. **`single-centered` (Default)**:
   A single primary device positioned prominently in the center, with title and subtitle centered above.
2. **`device-left`**:
   Device on the left (55% width), product narrative, specs, and details on the right (45% width).
3. **`text-left`**:
   Product narrative and typography on the left, device on the right.
4. **`multiple-devices`**:
   Side-by-side multi-device suite (e.g. Laptop + Tablet + Smartphone) showcasing responsive design across viewports.
5. **`device-overlap`**:
   2.5D layered composition: Primary device (e.g. Laptop) in the back, companion device (e.g. Smartphone) in front-right overlapping with drop shadows.
6. **`device-stack`**:
   Staggered diagonal or vertical overlap of companion devices.
7. **`custom`**:
   Unconstrained canvas layout for freeform device positioning.

---

## 3. Continuous Floating Hover Physics

To keep scenes dynamic and avoid static visuals:
- Each device oscillates smoothly using deterministic harmonic motion:
  $$\text{floatingY} = \sin(\text{frame} \cdot \omega + \phi) \cdot A$$
- Where $A$ is `floatingAmplitude` (default 8px) and $\omega$ is `floatingSpeed` (default 0.05).
- Each device in a multi-device suite carries an automatic phase offset ($\phi = i \cdot 0.4\pi$) so devices float independently with natural organic motion.
- Subtle continuous tilt rotation can also be activated.

---

## 4. Component Properties (`DeviceShowcaseSceneProps`)

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| `title` | `React.ReactNode` | *(Required)* | Main showcase headline title |
| `subtitle` | `React.ReactNode` | `undefined` | Supporting subtitle or platform descriptor |
| `description` | `React.ReactNode` | `undefined` | Extended body copy |
| `label` | `React.ReactNode` | `undefined` | Category badge or release pill |
| `primaryDevice` | `DeviceItemConfig` | `undefined` | Primary showcase device configuration |
| `secondaryDevices` | `DeviceItemConfig[]`| `[]` | Companion devices array |
| `devices` | `DeviceItemConfig[]` | `undefined` | Unified array of devices |
| `annotations` | `DeviceAnnotationItem[]`| `[]` | Callout pins pointing to hardware/software features |
| `decorativeElements` | `React.ReactNode` | `undefined` | Ambient graphic layer |
| `layout` | `DeviceShowcaseLayout` | `'single-centered'` | Layout arrangement mode |
| `animation` | `DeviceShowcaseAnimationConfig` | `undefined` | Fine-grained animation timing and physics |
| `staggerDelay` | `number` | `6` | Stagger delay in frames |
| `background` | `string` | `undefined` | CSS background gradient or pattern |
| `backgroundColor` | `string` | `Colors.dark.bgPrimary` | Solid background color |
| `backgroundImage` | `string` | `undefined` | Background image URL |
| `durationInFrames` | `number` | `undefined` | Scene duration in frames |
| `delay` | `number` | `0` | Delay before scene entrance starts |
| `width` | `number \| string` | `composition width` | Scene container width |
| `height` | `number \| string` | `composition height` | Scene container height |
| `padding` | `ScenePadding` | `64` | Inner content padding |
| `safeArea` | `boolean \| number` | `true` | Broadcast safe area margin (60px) |
| `sceneId` | `string` | `'device-showcase-scene'` | Scene identifier for profiling |
| `debug` | `boolean` | `false` | Visual debug overlay toggle |

---

## 5. Usage Examples

### Example 1: Overlapping Ecosystem (Laptop + Smartphone)
```tsx
import { DeviceShowcaseScene } from './components/scenes';

export const EcosystemScene = () => (
  <DeviceShowcaseScene
    layout="device-overlap"
    label="CROSS-PLATFORM"
    title="Responsive Digital Ecosystem"
    subtitle="Synchronized across desktop and mobile in real-time"
    devices={[
      {
        type: 'laptop',
        width: 560,
        height: 350,
        screenContent: <DashboardApp />,
      },
      {
        type: 'smartphone',
        width: 190,
        height: 390,
        x: '64%',
        y: '20%',
        zIndex: 5,
        screenContent: <MobileApp />,
      },
    ]}
    annotations={[
      {
        id: 'sync',
        title: 'Zero Latency Sync',
        description: 'WebSockets peer-to-peer',
        x: 75,
        y: 15,
      },
    ]}
  />
);
```

### Example 2: Device Left with Specs
```tsx
export const ProductView = () => (
  <DeviceShowcaseScene
    layout="device-left"
    label="MOBILE EXPERIENCE"
    title="Fluid Spatial Navigation"
    description="Engineered for tactile feedback and natural gestures."
    primaryDevice={{
      type: 'smartphone',
      width: 280,
      height: 580,
      screenContent: <AppView />,
    }}
  />
);
```
