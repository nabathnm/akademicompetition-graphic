/**
 * DeviceShowcaseScene Showcase
 * Interactive motion graphics playground demonstrating DeviceShowcaseScene:
 * - Multi-device responsive suites (Smartphone, Tablet, Laptop, BrowserWindow, and DeviceFrame)
 * - Continuous floating hover physics and tilt rotation
 * - Callout annotations pointing to hardware and software features
 * - 6 Layout variations: Single Centered, Device Left, Text Left, Multiple Devices, Device Overlap, Device Stack
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Layers,
  Monitor,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';
import { DeviceShowcaseScene } from '../../components/scenes/DeviceShowcaseScene.tsx';
import type {
  DeviceAnnotationItem,
  DeviceItemConfig,
  DeviceShowcaseDeviceType,
  DeviceShowcaseLayout,
} from '../../components/scenes/types.ts';

const DEMO_DEVICE_ANNOTATIONS: DeviceAnnotationItem[] = [
  {
    id: 'ann-1',
    title: 'Super Retina Display',
    description: '120Hz ProMotion with OLED HDR',
    badge: 'HARDWARE',
    x: 68,
    y: 20,
    color: Colors.accent.cyan,
  },
  {
    id: 'ann-2',
    title: 'Neural Engine M4',
    description: '38 TOPS hardware acceleration',
    badge: 'CHIPSET',
    x: 32,
    y: 80,
    color: '#10b981',
  },
];

export const DeviceShowcaseSceneShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // State
  const [layout, setLayout] = useState<DeviceShowcaseLayout>('device-overlap');
  const [singleDeviceType, setSingleDeviceType] = useState<DeviceShowcaseDeviceType>('smartphone');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [enableFloating, setEnableFloating] = useState<boolean>(true);
  const [staggerDelay, setStaggerDelay] = useState<number>(6);

  // Compute devices array according to layout
  const devices: DeviceItemConfig[] = React.useMemo(() => {
    const screenUi = (label: string, sub: string, color: string) => (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#070b14',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 10, color, fontWeight: 700, fontFamily: Typography.fontFamily.mono }}>
            ● ACTIVE WORKSPACE
          </div>
          <div style={{ fontSize: 16, color: '#ffffff', fontWeight: 800, marginTop: 4 }}>
            {label}
          </div>
          <div style={{ fontSize: 11, color: Colors.text.tertiary, marginTop: 2 }}>
            {sub}
          </div>
        </div>
        <div
          style={{
            backgroundColor: '#0d1629',
            borderRadius: 8,
            padding: 10,
            border: `1px solid ${color}40`,
          }}
        >
          <div style={{ fontSize: 10, color, fontWeight: 700 }}>
            SPEED: 120 FPS DETERMINISTIC
          </div>
        </div>
      </div>
    );

    if (layout === 'multiple-devices') {
      return [
        {
          id: 'dev-laptop',
          type: 'laptop',
          width: 440,
          height: 270,
          screenContent: screenUi('Desktop Suite', 'Studio Console', Colors.accent.cyan),
        },
        {
          id: 'dev-tablet',
          type: 'tablet',
          width: 320,
          height: 230,
          orientation: 'landscape',
          screenContent: screenUi('Tablet Dashboard', 'Mobile Ops', '#10b981'),
        },
        {
          id: 'dev-phone',
          type: 'smartphone',
          width: 170,
          height: 350,
          screenContent: screenUi('iOS App', 'Real-time Feed', '#ec4899'),
        },
      ];
    }

    if (layout === 'device-overlap') {
      return [
        {
          id: 'dev-back-laptop',
          type: 'laptop',
          width: 540,
          height: 330,
          screenContent: screenUi('Antigravity Cloud', 'Multi-tenant Node', Colors.accent.cyan),
        },
        {
          id: 'dev-front-phone',
          type: 'smartphone',
          width: 190,
          height: 390,
          x: '62%',
          y: '22%',
          zIndex: 6,
          screenContent: screenUi('Companion Remote', 'Touch Control', '#ec4899'),
        },
      ];
    }

    if (layout === 'device-stack') {
      return [
        {
          id: 'dev-stack-1',
          type: 'browser',
          width: 480,
          height: 290,
          screenContent: screenUi('Web Dashboard', 'Edge Node A', Colors.accent.cyan),
        },
        {
          id: 'dev-stack-2',
          type: 'smartphone',
          width: 180,
          height: 360,
          x: '55%',
          y: '25%',
          zIndex: 5,
          screenContent: screenUi('Mobile Controller', 'Edge Node B', '#10b981'),
        },
      ];
    }

    // Single device modes (single-centered, device-left, text-left)
    return [
      {
        id: `dev-single-${singleDeviceType}`,
        type: singleDeviceType,
        width:
          singleDeviceType === 'laptop'
            ? 560
            : singleDeviceType === 'browser'
              ? 540
              : singleDeviceType === 'tablet'
                ? 440
                : 240,
        height:
          singleDeviceType === 'laptop'
            ? 340
            : singleDeviceType === 'browser'
              ? 330
              : singleDeviceType === 'tablet'
                ? 310
                : 490,
        screenContent: screenUi('Spatial Engine Pro', 'Unified Ecosystem', Colors.accent.cyan),
      },
    ];
  }, [layout, singleDeviceType]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.scale.lg,
        width: '100%',
        backgroundColor: Colors.dark.surface1,
        borderRadius: Spacing.radius.lg,
        padding: Spacing.scale.xl,
        border: `1px solid ${Colors.border.default}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: Spacing.scale.md,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm }}>
            <Monitor size={20} color={Colors.accent.cyan} />
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: Colors.text.primary,
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              DeviceShowcaseScene
            </span>
            <span
              style={{
                fontSize: 10,
                fontFamily: Typography.fontFamily.mono,
                backgroundColor: `${Colors.accent.cyan}20`,
                color: Colors.accent.cyan,
                padding: '2px 8px',
                borderRadius: 4,
                border: `1px solid ${Colors.accent.cyan}40`,
              }}
            >
              LAYER 3 TEMPLATE
            </span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: Colors.text.secondary,
              marginTop: 4,
              fontFamily: Typography.fontFamily.sans,
            }}
          >
            Digital product presentations inside multi-device frames with continuous floating physics and callout annotations.
          </div>
        </div>

        <div
          style={{
            fontFamily: Typography.fontFamily.mono,
            fontSize: 11,
            color: Colors.text.tertiary,
            backgroundColor: Colors.dark.surface2,
            padding: '4px 10px',
            borderRadius: Spacing.radius.xs,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          FRAME {frame} • {fps} FPS
        </div>
      </div>

      {/* Control Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: Spacing.scale.md,
          backgroundColor: Colors.dark.surface2,
          padding: Spacing.scale.md,
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        {/* Layout Mode */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: Typography.fontFamily.mono,
              color: Colors.text.secondary,
              marginBottom: 6,
            }}
          >
            <Layers size={13} color={Colors.accent.cyan} />
            LAYOUT
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {[
              { id: 'device-overlap', label: 'Overlap' },
              { id: 'multiple-devices', label: 'Multi' },
              { id: 'device-left', label: 'Dev Left' },
              { id: 'text-left', label: 'Text Left' },
              { id: 'single-centered', label: 'Centered' },
              { id: 'device-stack', label: 'Stack' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setLayout(btn.id as DeviceShowcaseLayout)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${layout === btn.id ? Colors.accent.cyan : Colors.border.default}`,
                  backgroundColor: layout === btn.id ? `${Colors.accent.cyan}25` : Colors.dark.surface1,
                  color: layout === btn.id ? Colors.accent.cyan : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: layout === btn.id ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Single Device Type (for 1-device layouts) */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontFamily: Typography.fontFamily.mono,
              color: Colors.text.secondary,
              marginBottom: 6,
            }}
          >
            <Monitor size={13} color="#ec4899" />
            PRIMARY DEVICE
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {[
              { id: 'smartphone', label: 'Phone' },
              { id: 'laptop', label: 'Laptop' },
              { id: 'tablet', label: 'Tablet' },
              { id: 'browser', label: 'Browser' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setSingleDeviceType(btn.id as DeviceShowcaseDeviceType)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${singleDeviceType === btn.id ? '#ec4899' : Colors.border.default}`,
                  backgroundColor: singleDeviceType === btn.id ? '#ec489925' : Colors.dark.surface1,
                  color: singleDeviceType === btn.id ? '#ec4899' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: singleDeviceType === btn.id ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 11,
              fontFamily: Typography.fontFamily.mono,
              color: Colors.text.secondary,
              marginBottom: 6,
            }}
          >
            PHYSICS & CALLOUTS
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={enableFloating}
                onChange={(e) => setEnableFloating(e.target.checked)}
              />
              Floating Physics
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={showAnnotations}
                onChange={(e) => setShowAnnotations(e.target.checked)}
              />
              Annotations
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              Stagger: {staggerDelay}f
            </span>
            <input
              type="range"
              min={2}
              max={10}
              value={staggerDelay}
              onChange={(e) => setStaggerDelay(Number(e.target.value))}
              style={{ width: 80 }}
            />
          </div>
        </div>
      </div>

      {/* Live Preview Canvas */}
      <div
        style={{
          width: '100%',
          height: 520,
          borderRadius: Spacing.radius.md,
          overflow: 'hidden',
          border: `1px solid ${Colors.border.default}`,
          backgroundColor: '#040711',
          position: 'relative',
        }}
      >
        <DeviceShowcaseScene
          layout={layout}
          label="HARDWARE & SOFTWARE"
          title="Responsive Digital Ecosystem"
          subtitle="One Codebase. Synchronized Across Every Screen."
          description="Deterministic frame rendering across phone, tablet, and desktop viewports with zero visual lag."
          devices={devices}
          annotations={showAnnotations ? DEMO_DEVICE_ANNOTATIONS : []}
          animation={{
            floating: enableFloating,
            staggerDelay: staggerDelay,
          }}
          safeArea={false}
          padding={28}
          background="radial-gradient(ellipse at 50% 20%, #0c1830 0%, #03060d 100%)"
        />
      </div>
    </div>
  );
};
