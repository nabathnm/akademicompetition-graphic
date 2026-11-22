/**
 * FeatureHighlightScene Showcase
 * Interactive motion graphics playground demonstrating FeatureHighlightScene:
 * - Feature callouts with SmartphoneMockup and BrowserWindowMockup
 * - Staggered typography and pulsing benefit statement pills
 * - Interactive visual callout annotations and pointers
 * - Layout variations: Text Left, Text Right, Centered, Full Visual with Card
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Zap,
  Smartphone,
  Globe,
  Columns,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';
import { FeatureHighlightScene } from '../../components/scenes/FeatureHighlightScene.tsx';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup.tsx';
import { BrowserWindowMockup } from '../../components/mockups/BrowserWindowMockup.tsx';
import type {
  FeatureAnnotationItem,
  FeatureHighlightLayout,
} from '../../components/scenes/types.ts';

const DEMO_ANNOTATIONS: FeatureAnnotationItem[] = [
  {
    id: 'a1',
    title: 'Zero-Latency Pipeline',
    description: 'Sub-millisecond edge synchronization',
    badge: 'CORE ENGINE',
    x: 65,
    y: 15,
    color: Colors.accent.cyan,
  },
  {
    id: 'a2',
    title: 'Hardware Encryption',
    description: 'Quantum-safe cryptographic keys',
    badge: 'SECURITY',
    x: 60,
    y: 75,
    color: '#10b981',
  },
];

export const FeatureHighlightSceneShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // State
  const [layout, setLayout] = useState<FeatureHighlightLayout>('text-left');
  const [visualType, setVisualType] = useState<'smartphone' | 'browser'>('smartphone');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [showBenefit, setShowBenefit] = useState<boolean>(true);
  const [staggerDelay, setStaggerDelay] = useState<number>(4);

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
                  backgroundColor: '#050a14',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 10, color: Colors.accent.cyan, fontWeight: 700 }}>
                    FEATURE LIVE
                  </div>
                  <div style={{ fontSize: 18, color: '#ffffff', fontWeight: 800, marginTop: 4 }}>
                    Autonomous Node
                  </div>
                </div>
                <div style={{ padding: 12, backgroundColor: '#0d1627', borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>● SYNC COMPLETE</div>
                  <div style={{ fontSize: 9, color: Colors.text.tertiary, marginTop: 2 }}>50,000 tx/sec Verified</div>
                </div>
              </div>
            }
          />
        </div>
      );
    }

    return (
      <div style={{ transform: 'scale(0.8)', transformOrigin: 'center' }}>
        <BrowserWindowMockup
          width={560}
          height={320}
          title="cloud.antigravity.io/dashboard"
          theme="dark"
        >
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: Colors.accent.cyan, fontFamily: Typography.fontFamily.mono }}>
                TELEMETRY CONSOLE
              </span>
              <span style={{ fontSize: 10, color: '#10b981' }}>0.2ms PING</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#ffffff' }}>
              Real-Time Distributed Pipeline
            </div>
            <div style={{ height: 6, backgroundColor: Colors.dark.surface2, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: '88%', height: '100%', backgroundColor: Colors.accent.cyan }} />
            </div>
          </div>
        </BrowserWindowMockup>
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
            <Zap size={20} color={Colors.accent.cyan} />
            <span style={{ ...Typography.headline.h3, color: Colors.text.primary }}>
              FeatureHighlightScene
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
              FEATURE SPOTLIGHT
            </span>
          </div>
          <p style={{ ...Typography.body.small, color: Colors.text.secondary, maxWidth: 640 }}>
            Dedicated scene template for explaining specific product capabilities, performance benefits, and key value
            propositions with callout annotations and highlighted statements.
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
            <span style={{ color: showAnnotations ? Colors.accent.emerald : Colors.text.tertiary, fontWeight: 700 }}>
              {showAnnotations ? `${DEMO_ANNOTATIONS.length} ANNOTATIONS` : 'NO ANNOTATIONS'}
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
          <FeatureHighlightScene
            layout={layout}
            label="PERFORMANCE & OBSERVABILITY"
            title="Sub-Millisecond Edge Ingestion"
            benefit={showBenefit ? '10x Faster Realtime Telemetry' : undefined}
            description="Our distributed consensus architecture routes telemetry packets across closest edge regions, eliminating cold starts and cross-region bottlenecking."
            annotations={showAnnotations ? DEMO_ANNOTATIONS : []}
            background="radial-gradient(circle at 60% 40%, rgba(6, 182, 212, 0.15) 0%, #030712 75%)"
            safeArea={false}
            padding={24}
            staggerDelay={staggerDelay}
          >
            {renderVisual()}
          </FeatureHighlightScene>
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
              LAYOUT STRUCTURE
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {(
              [
                { id: 'text-left', label: 'Text Left' },
                { id: 'text-right', label: 'Text Right' },
                { id: 'centered', label: 'Centered' },
                { id: 'with-annotations', label: 'Annotations' },
              ] as { id: FeatureHighlightLayout; label: string }[]
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
              FEATURE VISUAL TYPE
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { id: 'smartphone', label: 'Phone', icon: Smartphone },
                { id: 'browser', label: 'Browser', icon: Globe },
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

        {/* Panel 2: Annotations & Benefit Toggles */}
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
              FEATURE CONTROLS
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              onClick={() => setShowAnnotations(!showAnnotations)}
              style={{
                padding: '8px 10px',
                borderRadius: Spacing.radius.xs,
                border: `1px solid ${showAnnotations ? Colors.accent.emerald : Colors.border.default}`,
                backgroundColor: showAnnotations ? 'rgba(16, 185, 129, 0.15)' : Colors.dark.surface1,
                color: showAnnotations ? Colors.accent.emerald : Colors.text.tertiary,
                fontFamily: Typography.fontFamily.mono,
                fontSize: 11,
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>Callout Annotations</span>
              <span>{showAnnotations ? 'SHOWN' : 'HIDDEN'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBenefit(!showBenefit)}
              style={{
                padding: '8px 10px',
                borderRadius: Spacing.radius.xs,
                border: `1px solid ${showBenefit ? Colors.accent.cyan : Colors.border.default}`,
                backgroundColor: showBenefit ? `${Colors.accent.cyan}18` : Colors.dark.surface1,
                color: showBenefit ? Colors.accent.cyan : Colors.text.tertiary,
                fontFamily: Typography.fontFamily.mono,
                fontSize: 11,
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>Benefit Highlight Pill</span>
              <span>{showBenefit ? 'SHOWN' : 'HIDDEN'}</span>
            </button>
          </div>

          {/* Stagger Delay Buttons */}
          <div style={{ marginTop: Spacing.scale.md }}>
            <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginBottom: 4 }}>
              STAGGER DELAY: {staggerDelay}f
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[2, 4, 6, 8].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setStaggerDelay(d)}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    borderRadius: Spacing.radius.xs,
                    border: `1px solid ${staggerDelay === d ? Colors.accent.emerald : Colors.border.default}`,
                    backgroundColor: staggerDelay === d ? Colors.dark.surface3 : Colors.dark.surface1,
                    color: staggerDelay === d ? Colors.accent.emerald : Colors.text.secondary,
                    fontSize: 10,
                    cursor: 'pointer',
                  }}
                >
                  {d}f
                </button>
              ))}
            </div>
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
          {`<FeatureHighlightScene
  layout="${layout}"
  label="PERFORMANCE & OBSERVABILITY"
  title="Sub-Millisecond Edge Ingestion"
  description="Distributed consensus architecture routes telemetry packets across closest edge regions."${showBenefit ? '\n  benefit="10x Faster Realtime Telemetry"' : ''}${showAnnotations ? '\n  annotations={DEMO_ANNOTATIONS}' : ''}
>
  <${visualType === 'smartphone' ? 'SmartphoneMockup' : 'BrowserWindowMockup'} />
</FeatureHighlightScene>`}
        </pre>
      </div>
    </div>
  );
};
