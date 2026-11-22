/**
 * ProductShowcaseScene Showcase
 * Interactive motion graphics playground demonstrating ProductShowcaseScene:
 * - Layout variations: Center Product, Product Left, Product Right, Full Screen, Floating Details
 * - Physical & Digital product presentations (SmartphoneMockup, LaptopMockup, Spec Card)
 * - Floating hover physics, continuous rotation, and floating detail badges
 * - Staggered typography and ambient background gradients
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Package,
  Smartphone,
  Laptop,
  Layers,
  Columns,
  Sliders,
  Sparkles,
  Tag,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';
import { ProductShowcaseScene } from '../../components/scenes/ProductShowcaseScene.tsx';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup.tsx';
import { LaptopMockup } from '../../components/mockups/LaptopMockup.tsx';
import type {
  ProductDetailItem,
  ProductShowcaseLayout,
} from '../../components/scenes/types.ts';

const DEMO_DETAILS: ProductDetailItem[] = [
  { id: '1', label: 'Processing Unit', value: 'Neural Core v4', position: 'top-left' },
  { id: '2', label: 'Network Latency', value: '0.4ms Ultra-Low', position: 'top-right' },
  { id: '3', label: 'Battery Lifecycle', value: '48h Continuous', position: 'bottom-left' },
  { id: '4', label: 'Security Chip', value: 'Hardware Enclave', position: 'bottom-right' },
];

export const ProductShowcaseSceneShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // State
  const [layout, setLayout] = useState<ProductShowcaseLayout>('floating-details');
  const [visualType, setVisualType] = useState<'smartphone' | 'laptop' | 'card'>('smartphone');
  const [enableFloating, setEnableFloating] = useState<boolean>(true);
  const [enableRotation, setEnableRotation] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(true);
  const [showLabel, setShowLabel] = useState<boolean>(true);

  // Render Visual
  const renderVisual = () => {
    if (visualType === 'smartphone') {
      return (
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
          <SmartphoneMockup
            width={260}
            height={520}
            deviceColor="#090d16"
            screenContent={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0a101d',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 10, color: Colors.accent.cyan, fontWeight: 700 }}>
                    MOBILITY LIVE
                  </div>
                  <div style={{ fontSize: 16, color: '#ffffff', fontWeight: 800, marginTop: 4 }}>
                    $128,490.00
                  </div>
                </div>
                <div style={{ height: 60, backgroundColor: '#131b2e', borderRadius: 8, padding: 8 }}>
                  <div style={{ fontSize: 9, color: Colors.text.tertiary }}>SIGNAL STREAM</div>
                  <div style={{ width: '80%', height: 4, backgroundColor: Colors.accent.cyan, marginTop: 12, borderRadius: 2 }} />
                </div>
              </div>
            }
          />
        </div>
      );
    }

    if (visualType === 'laptop') {
      return (
        <div style={{ transform: 'scale(0.72)', transformOrigin: 'center' }}>
          <LaptopMockup
            width={580}
            height={340}
            deviceColor="#0f172a"
            screenContent={
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#030712',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: Colors.accent.cyan, fontFamily: Typography.fontFamily.mono }}>
                    WORKSPACE SUITE
                  </span>
                  <span style={{ fontSize: 10, color: '#10b981' }}>● ONLINE</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#ffffff' }}>
                  Next-Gen Digital Experience
                </div>
                <div style={{ height: 6, backgroundColor: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: '92%', height: '100%', backgroundColor: Colors.accent.cyan }} />
                </div>
              </div>
            }
          />
        </div>
      );
    }

    return (
      <div
        style={{
          width: 320,
          height: 220,
          backgroundColor: '#0a101d',
          border: `2px solid ${Colors.accent.cyan}60`,
          borderRadius: Spacing.radius.lg,
          padding: Spacing.scale.lg,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: `0 0 40px ${Colors.accent.cyan}25`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>HARDWARE MODULE</span>
          <span style={{ fontSize: 10, color: '#10b981', fontFamily: Typography.fontFamily.mono }}>ACTIVE</span>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#ffffff' }}>TITANIUM CORE</div>
          <div style={{ fontSize: 11, color: Colors.text.secondary, marginTop: 4 }}>Precision milled aerospace alloy</div>
        </div>
        <div style={{ height: 4, backgroundColor: Colors.accent.cyan, borderRadius: 2 }} />
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: Colors.dark.surface1,
        borderRadius: Spacing.radius.lg,
        border: `1px solid ${Colors.border.default}`,
        padding: Spacing.scale.xl,
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.scale.xl,
      }}
    >
      {/* 1. Header & Live Telemetry Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: Spacing.scale.md }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm, marginBottom: 4 }}>
            <Package size={20} color={Colors.accent.cyan} />
            <span style={{ ...Typography.headline.h3, color: Colors.text.primary }}>
              ProductShowcaseScene
            </span>
            <span
              style={{
                fontSize: 11,
                fontFamily: Typography.fontFamily.mono,
                color: Colors.accent.cyan,
                backgroundColor: `${Colors.accent.cyan}18`,
                border: `1px solid ${Colors.accent.cyan}40`,
                padding: '2px 8px',
                borderRadius: Spacing.radius.xs,
              }}
            >
              COMMERCIAL SHOWCASE
            </span>
          </div>
          <p style={{ ...Typography.body.small, color: Colors.text.secondary, maxWidth: 640 }}>
            Centerpiece scene template placing hardware, software, or digital assets at the center of attention with
            floating hover dynamics, detail spec badges, and customizable staging layouts.
          </p>
        </div>

        {/* Realtime Telemetry Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: Spacing.scale.md,
            backgroundColor: Colors.dark.surface2,
            padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
            fontFamily: Typography.fontFamily.mono,
            fontSize: 11,
          }}
        >
          <div>
            <span style={{ color: Colors.text.tertiary }}>FRAME: </span>
            <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>{frame}</span>
            <span style={{ color: Colors.text.tertiary }}> | FPS: {fps}</span>
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: Colors.border.default }} />
          <div>
            <span style={{ color: Colors.text.tertiary }}>LAYOUT: </span>
            <span style={{ color: '#ec4899', fontWeight: 700 }}>{layout.toUpperCase()}</span>
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: Colors.border.default }} />
          <div>
            <span style={{ color: enableFloating ? Colors.accent.emerald : Colors.text.tertiary, fontWeight: 700 }}>
              {enableFloating ? '● HOVER ACTIVE' : '○ STATIC'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Canvas Live Preview */}
      <div
        style={{
          width: '100%',
          minHeight: 380,
          backgroundColor: '#030508',
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: Spacing.scale.xl,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '100%', maxWidth: 840, height: 340, position: 'relative', borderRadius: Spacing.radius.md, overflow: 'hidden' }}>
          <ProductShowcaseScene
            layout={layout}
            title="Aura Pro Spatial Headset"
            subtitle="Flagship Spatial Audio & Visual Engine"
            description="Engineered with dual micro-OLED displays and adaptive spatial raytracing for unparalleled perceptual realism."
            label={showLabel ? 'FLAGSHIP EDITION // 2026' : undefined}
            supportingText="$1,499 USD · Ships Q2 2026"
            details={showDetails ? DEMO_DETAILS : []}
            background="radial-gradient(circle at 50% 40%, rgba(6, 182, 212, 0.16) 0%, #030712 80%)"
            safeArea={false}
            padding={24}
            animation={{
              productFloating: enableFloating,
              productRotation: enableRotation,
              productEntrance: 'scale',
            }}
          >
            {renderVisual()}
          </ProductShowcaseScene>
        </div>
      </div>

      {/* 3. Controls Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: Spacing.scale.lg,
        }}
      >
        {/* Panel 1: Layout Selection */}
        <div
          style={{
            backgroundColor: Colors.dark.surface2,
            padding: Spacing.scale.md,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.sm }}>
            <Columns size={14} color={Colors.accent.cyan} />
            <span style={{ ...Typography.caption.eyebrow, color: Colors.text.primary }}>
              LAYOUT VARIATION
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {(
              [
                { id: 'floating-details', label: 'Floating Details' },
                { id: 'center-product', label: 'Center Product' },
                { id: 'product-left', label: 'Product Left' },
                { id: 'product-right', label: 'Product Right' },
                { id: 'full-screen', label: 'Full Screen' },
              ] as { id: ProductShowcaseLayout; label: string }[]
            ).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLayout(l.id)}
                style={{
                  padding: '6px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${layout === l.id ? Colors.accent.cyan : Colors.border.default}`,
                  backgroundColor: layout === l.id ? `${Colors.accent.cyan}25` : Colors.dark.surface1,
                  color: layout === l.id ? Colors.accent.cyan : Colors.text.secondary,
                  fontFamily: Typography.fontFamily.mono,
                  fontSize: 10,
                  fontWeight: layout === l.id ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Visual slot selector */}
          <div style={{ marginTop: Spacing.scale.md }}>
            <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginBottom: 4 }}>
              PRODUCT VISUAL TYPE
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { id: 'smartphone', label: 'Phone', icon: Smartphone },
                { id: 'laptop', label: 'Laptop', icon: Laptop },
                { id: 'card', label: 'Hardware', icon: Layers },
              ].map((v) => {
                const IconComponent = v.icon;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVisualType(v.id as typeof visualType)}
                    style={{
                      flex: 1,
                      padding: '5px 6px',
                      borderRadius: Spacing.radius.xs,
                      border: `1px solid ${visualType === v.id ? '#ec4899' : Colors.border.default}`,
                      backgroundColor: visualType === v.id ? 'rgba(236, 72, 153, 0.15)' : Colors.dark.surface1,
                      color: visualType === v.id ? '#ec4899' : Colors.text.secondary,
                      fontSize: 10,
                      fontFamily: Typography.fontFamily.mono,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      cursor: 'pointer',
                    }}
                  >
                    <IconComponent size={12} />
                    <span>{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel 2: Kinematics & Floating Motion */}
        <div
          style={{
            backgroundColor: Colors.dark.surface2,
            padding: Spacing.scale.md,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.sm }}>
            <Sliders size={14} color={Colors.accent.cyan} />
            <span style={{ ...Typography.caption.eyebrow, color: Colors.text.primary }}>
              KINEMATICS & DYNAMICS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              onClick={() => setEnableFloating(!enableFloating)}
              style={{
                padding: '8px 10px',
                borderRadius: Spacing.radius.xs,
                border: `1px solid ${enableFloating ? Colors.accent.emerald : Colors.border.default}`,
                backgroundColor: enableFloating ? 'rgba(16, 185, 129, 0.15)' : Colors.dark.surface1,
                color: enableFloating ? Colors.accent.emerald : Colors.text.tertiary,
                fontFamily: Typography.fontFamily.mono,
                fontSize: 11,
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>Floating Sine Wave Hover</span>
              <span>{enableFloating ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setEnableRotation(!enableRotation)}
              style={{
                padding: '8px 10px',
                borderRadius: Spacing.radius.xs,
                border: `1px solid ${enableRotation ? Colors.accent.cyan : Colors.border.default}`,
                backgroundColor: enableRotation ? `${Colors.accent.cyan}18` : Colors.dark.surface1,
                color: enableRotation ? Colors.accent.cyan : Colors.text.tertiary,
                fontFamily: Typography.fontFamily.mono,
                fontSize: 11,
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>Subtle Tilt Rotation</span>
              <span>{enableRotation ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              style={{
                padding: '8px 10px',
                borderRadius: Spacing.radius.xs,
                border: `1px solid ${showDetails ? '#ec4899' : Colors.border.default}`,
                backgroundColor: showDetails ? 'rgba(236, 72, 153, 0.15)' : Colors.dark.surface1,
                color: showDetails ? '#ec4899' : Colors.text.tertiary,
                fontFamily: Typography.fontFamily.mono,
                fontSize: 11,
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>Floating Detail Badges</span>
              <span>{showDetails ? 'SHOWN' : 'HIDDEN'}</span>
            </button>
          </div>
        </div>

        {/* Panel 3: Content Toggles */}
        <div
          style={{
            backgroundColor: Colors.dark.surface2,
            padding: Spacing.scale.md,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.sm }}>
            <Tag size={14} color={Colors.accent.cyan} />
            <span style={{ ...Typography.caption.eyebrow, color: Colors.text.primary }}>
              CONTENT TOGGLES
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              onClick={() => setShowLabel(!showLabel)}
              style={{
                padding: '8px 10px',
                borderRadius: Spacing.radius.xs,
                border: `1px solid ${showLabel ? Colors.accent.emerald : Colors.border.default}`,
                backgroundColor: showLabel ? 'rgba(16, 185, 129, 0.15)' : Colors.dark.surface1,
                color: showLabel ? Colors.accent.emerald : Colors.text.tertiary,
                fontFamily: Typography.fontFamily.mono,
                fontSize: 11,
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>Product Category Badge</span>
              <span>{showLabel ? 'SHOWN' : 'HIDDEN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Generated Code Snippet */}
      <div
        style={{
          backgroundColor: Colors.dark.surface2,
          padding: Spacing.scale.md,
          borderRadius: Spacing.radius.sm,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.xs }}>
          <Sparkles size={14} color={Colors.accent.cyan} />
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
            REMOTION CODE IMPLEMENTATION
          </span>
        </div>
        <pre
          style={{
            margin: 0,
            padding: Spacing.scale.sm,
            backgroundColor: '#05070a',
            borderRadius: Spacing.radius.xs,
            border: `1px solid ${Colors.border.default}`,
            fontFamily: Typography.fontFamily.mono,
            fontSize: 11,
            color: '#a5f3fc',
            overflowX: 'auto',
            lineHeight: 1.5,
          }}
        >
          {`<ProductShowcaseScene
  layout="${layout}"
  title="Aura Pro Spatial Headset"
  subtitle="Flagship Spatial Audio & Visual Engine"
  description="Engineered with dual micro-OLED displays."${showLabel ? '\n  label="FLAGSHIP EDITION // 2026"' : ''}
  animation={{ productFloating: ${enableFloating}, productRotation: ${enableRotation} }}
>
  <${visualType === 'smartphone' ? 'SmartphoneMockup' : visualType === 'laptop' ? 'LaptopMockup' : 'HardwareCard'} />
</ProductShowcaseScene>`}
        </pre>
      </div>
    </div>
  );
};
