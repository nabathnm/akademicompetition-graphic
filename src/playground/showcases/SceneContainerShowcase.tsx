/**
 * SceneContainer Showcase
 * Interactive motion graphics playground demonstrating SceneContainer:
 * - Layout modes: Centered, Full Bleed, Split, Top Aligned, Bottom Aligned, Custom
 * - Background styles: Solid, Linear Gradient, Radial Glow, Mesh Backdrop
 * - Broadcast safe area margins & overflow controls
 * - Deterministic entrance animations: Fade, Slide, Scale, Zoom
 * - Diagnostic debug overlay & aspect ratio simulation
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Layout,
  Maximize2,
  Columns,
  Sliders,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';
import { SceneContainer } from '../../components/scenes/SceneContainer.tsx';
import type {
  SceneAnimationType,
  SceneHorizontalAlignment,
  SceneLayoutMode,
} from '../../components/scenes/types.ts';

const BG_PRESETS = [
  { id: 'dark', name: 'Obsidian Solid', bg: Colors.dark.bgPrimary },
  {
    id: 'gradient-cyan',
    name: 'Cyan Atmosphere',
    bg: 'radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.2) 0%, #030712 70%)',
  },
  {
    id: 'gradient-violet',
    name: 'Electric Neon',
    bg: 'linear-gradient(135deg, #1e1b4b 0%, #090d16 60%, #1e102a 100%)',
  },
  {
    id: 'mesh',
    name: 'Cyber Grid',
    bg: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, #05070a 1px)',
  },
];

export const SceneContainerShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // State
  const [layout, setLayout] = useState<SceneLayoutMode>('centered');
  const [bgPreset, setBgPreset] = useState<string>('gradient-cyan');
  const [hAlign, setHAlign] = useState<SceneHorizontalAlignment>('center');
  const [safeArea, setSafeArea] = useState<boolean>(true);
  const [debug, setDebug] = useState<boolean>(true);
  const [animType, setAnimType] = useState<SceneAnimationType>('fade');
  const [paddingVal, setPaddingVal] = useState<number>(40);

  const currentBg = BG_PRESETS.find((p) => p.id === bgPreset)?.bg ?? Colors.dark.bgPrimary;

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
            <Layout size={20} color={Colors.accent.cyan} />
            <span style={{ ...Typography.headline.h3, color: Colors.text.primary }}>
              SceneContainer
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
              LAYER 3 FOUNDATION
            </span>
          </div>
          <p style={{ ...Typography.body.small, color: Colors.text.secondary, maxWidth: 640 }}>
            Standardizes scene dimensions, layout arrangements, backgrounds, content alignment, safe area guides, and
            deterministic entrance/exit kinematics for production-ready Remotion scenes.
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
            <span style={{ color: Colors.text.tertiary }}>SAFE AREA: </span>
            <span style={{ color: safeArea ? Colors.accent.emerald : Colors.text.tertiary, fontWeight: 700 }}>
              {safeArea ? 'ACTIVE (60px)' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Canvas Live Preview */}
      <div
        style={{
          width: '100%',
          minHeight: 340,
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
        <div style={{ width: '100%', maxWidth: 760, height: 280, position: 'relative', borderRadius: Spacing.radius.md, overflow: 'hidden' }}>
          <SceneContainer
            sceneId="showcase-scene"
            debug={debug}
            layout={layout}
            background={currentBg}
            safeArea={safeArea ? 40 : false}
            padding={paddingVal}
            horizontalAlignment={hAlign}
            animation={{ type: animType, enterDuration: 20 }}
            style={{ width: '100%', height: '100%' }}
          >
            {layout === 'split' ? (
              <>
                <div
                  style={{
                    flex: '1 1 50%',
                    padding: Spacing.scale.md,
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    border: `1px solid ${Colors.accent.cyan}40`,
                    borderRadius: Spacing.radius.sm,
                  }}
                >
                  <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>LEFT COLUMN</span>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginTop: 6 }}>
                    Product Architecture
                  </div>
                  <p style={{ fontSize: 12, color: Colors.text.secondary, marginTop: 4 }}>
                    Standardized dual-column responsive content arrangement.
                  </p>
                </div>
                <div
                  style={{
                    flex: '1 1 50%',
                    padding: Spacing.scale.md,
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                    borderRadius: Spacing.radius.sm,
                  }}
                >
                  <span style={{ ...Typography.caption.eyebrow, color: '#ec4899' }}>RIGHT COLUMN</span>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff', marginTop: 6 }}>
                    Visual Frame Area
                  </div>
                  <p style={{ fontSize: 12, color: Colors.text.secondary, marginTop: 4 }}>
                    Ideal for device mockups, metric cards, or vector paths.
                  </p>
                </div>
              </>
            ) : layout === 'full-bleed' ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: `2px dashed ${Colors.accent.emerald}`,
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Maximize2 size={24} color={Colors.accent.emerald} style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>FULL-BLEED CANVAS</div>
                  <div style={{ fontSize: 11, color: Colors.accent.emerald, fontFamily: Typography.fontFamily.mono }}>
                    0 Margin · 100% Edge-to-Edge Coverage
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: hAlign === 'left' ? 'flex-start' : hAlign === 'right' ? 'flex-end' : 'center',
                  maxWidth: 480,
                  textAlign: hAlign === 'left' ? 'left' : hAlign === 'right' ? 'right' : 'center',
                }}
              >
                <span
                  style={{
                    ...Typography.caption.eyebrow,
                    color: Colors.accent.cyan,
                    backgroundColor: `${Colors.accent.cyan}18`,
                    border: `1px solid ${Colors.accent.cyan}40`,
                    padding: '3px 10px',
                    borderRadius: Spacing.radius.full,
                    marginBottom: 8,
                  }}
                >
                  SCENE CONTAINER FOUNDATION
                </span>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
                  Unified Motion Stage
                </div>
                <p style={{ fontSize: 12, color: Colors.text.secondary, marginTop: 6, lineHeight: 1.5 }}>
                  Positioned with layout &ldquo;{layout}&rdquo; and alignment &ldquo;{hAlign}&rdquo;.
                </p>
              </div>
            )}
          </SceneContainer>
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
        {/* Panel 1: Layout Mode */}
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
              LAYOUT MODE
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {(
              [
                { id: 'centered', label: 'Centered' },
                { id: 'split', label: 'Split' },
                { id: 'full-bleed', label: 'Full Bleed' },
                { id: 'top-aligned', label: 'Top Aligned' },
                { id: 'bottom-aligned', label: 'Bottom Aligned' },
                { id: 'custom', label: 'Custom' },
              ] as { id: SceneLayoutMode; label: string }[]
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

          {/* Alignment Selector */}
          <div style={{ marginTop: Spacing.scale.md }}>
            <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginBottom: 4 }}>
              HORIZONTAL ALIGNMENT
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['left', 'center', 'right'] as SceneHorizontalAlignment[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setHAlign(a)}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    borderRadius: Spacing.radius.xs,
                    border: `1px solid ${hAlign === a ? '#ec4899' : Colors.border.default}`,
                    backgroundColor: hAlign === a ? 'rgba(236, 72, 153, 0.15)' : Colors.dark.surface1,
                    color: hAlign === a ? '#ec4899' : Colors.text.secondary,
                    fontSize: 10,
                    fontFamily: Typography.fontFamily.mono,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Background Style */}
        <div
          style={{
            backgroundColor: Colors.dark.surface2,
            padding: Spacing.scale.md,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.sm }}>
            <Layers size={14} color={Colors.accent.cyan} />
            <span style={{ ...Typography.caption.eyebrow, color: Colors.text.primary }}>
              BACKGROUND STYLE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {BG_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setBgPreset(preset.id)}
                style={{
                  padding: '6px 10px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${bgPreset === preset.id ? Colors.accent.cyan : Colors.border.default}`,
                  backgroundColor: bgPreset === preset.id ? `${Colors.accent.cyan}20` : Colors.dark.surface1,
                  color: bgPreset === preset.id ? Colors.accent.cyan : Colors.text.secondary,
                  fontSize: 11,
                  fontFamily: Typography.fontFamily.mono,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <span>{preset.name}</span>
                {bgPreset === preset.id && <span style={{ color: Colors.accent.cyan }}>● ACTIVE</span>}
              </button>
            ))}
          </div>

          {/* Padding slider buttons */}
          <div style={{ marginTop: Spacing.scale.md }}>
            <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginBottom: 4 }}>
              INNER PADDING: {paddingVal}px
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[20, 40, 60].map((pv) => (
                <button
                  key={pv}
                  type="button"
                  onClick={() => setPaddingVal(pv)}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    borderRadius: Spacing.radius.xs,
                    border: `1px solid ${paddingVal === pv ? Colors.accent.emerald : Colors.border.default}`,
                    backgroundColor: paddingVal === pv ? Colors.dark.surface3 : Colors.dark.surface1,
                    color: paddingVal === pv ? Colors.accent.emerald : Colors.text.secondary,
                    fontSize: 10,
                    cursor: 'pointer',
                  }}
                >
                  {pv}px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 3: Animation & Guides */}
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
              KINEMATICS & GUIDES
            </span>
          </div>

          <div style={{ marginBottom: Spacing.scale.md }}>
            <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginBottom: 4 }}>
              ENTRANCE ANIMATION
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
              {(['fade', 'slide', 'scale', 'zoom', 'none'] as SceneAnimationType[]).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAnimType(a)}
                  style={{
                    padding: '5px 8px',
                    borderRadius: Spacing.radius.xs,
                    border: `1px solid ${animType === a ? '#ec4899' : Colors.border.default}`,
                    backgroundColor: animType === a ? 'rgba(236, 72, 153, 0.15)' : Colors.dark.surface1,
                    color: animType === a ? '#ec4899' : Colors.text.secondary,
                    fontSize: 10,
                    fontFamily: Typography.fontFamily.mono,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              type="button"
              onClick={() => setSafeArea(!safeArea)}
              style={{
                padding: '6px 8px',
                borderRadius: Spacing.radius.xs,
                border: `1px solid ${safeArea ? Colors.accent.emerald : Colors.border.default}`,
                backgroundColor: safeArea ? 'rgba(16, 185, 129, 0.15)' : Colors.dark.surface1,
                color: safeArea ? Colors.accent.emerald : Colors.text.tertiary,
                fontFamily: Typography.fontFamily.mono,
                fontSize: 10,
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>Safe Area Guide (60px)</span>
              <span>{safeArea ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setDebug(!debug)}
              style={{
                padding: '6px 8px',
                borderRadius: Spacing.radius.xs,
                border: `1px solid ${debug ? Colors.accent.cyan : Colors.border.default}`,
                backgroundColor: debug ? `${Colors.accent.cyan}18` : Colors.dark.surface1,
                color: debug ? Colors.accent.cyan : Colors.text.tertiary,
                fontFamily: Typography.fontFamily.mono,
                fontSize: 10,
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <span>Diagnostic Overlay</span>
              <span>{debug ? 'ON' : 'OFF'}</span>
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
          {`<SceneContainer
  layout="${layout}"
  background="${bgPreset}"
  padding={${paddingVal}}
  safeArea={${safeArea}}
  horizontalAlignment="${hAlign}"
  animation={{ type: '${animType}', enterDuration: 20 }}
>
  <YourSceneContent />
</SceneContainer>`}
        </pre>
      </div>
    </div>
  );
};
