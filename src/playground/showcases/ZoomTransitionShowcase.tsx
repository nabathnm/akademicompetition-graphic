/**
 * ZoomTransition Showcase
 * Interactive motion graphics playground component demonstrating ZoomTransition capabilities:
 * - Modes: Zoom In, Zoom Out, In-Out, Zoom Through, Zoom Replace
 * - Transform Origins: Center, Top-Left, Top-Right, Bottom-Left, Bottom-Right
 * - Scale Ranges: Full (0 -> 1), Subtle (0.5 -> 1), Hyper (1 -> 2.5)
 * - Motion Dynamics: Cubic Easing, Spring Physics, Overshoot Settling
 * - Modifiers: Simultaneous Opacity Fade, Rotational Zoom, Clipping, Reverse
 * - Multi-content compatibility: Typography, Shapes, Mockups
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  ZoomIn,
  RotateCw,
  Eye,
  Layers,
  Sparkles,
  Smartphone,
  Square,
  Type,
} from 'lucide-react';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { ZoomTransition } from '../../components/transitions/ZoomTransition';
import { calculateZoomMetrics } from '../../components/transitions/zoomTransitionStyle';
import type { ZoomTransitionMode } from '../../components/transitions/types';
import type { EasingPresetName } from '../../utils/animation/easing';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup';

const ACCENT_PINK = '#ec4899';

const ORIGIN_OPTIONS = [
  { id: 'center', label: 'Center' },
  { id: 'top left', label: 'Top-Left' },
  { id: 'top right', label: 'Top-Right' },
  { id: 'bottom left', label: 'Bottom-Left' },
  { id: 'bottom right', label: 'Bottom-Right' },
];

export const ZoomTransitionShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mode and Origin
  const [mode, setMode] = useState<ZoomTransitionMode>('in');
  const [origin, setOrigin] = useState<string>('center');
  const [scalePreset, setScalePreset] = useState<'full' | 'subtle' | 'hyper'>('full');

  // Motion Dynamics
  const [motionStyle, setMotionStyle] = useState<'easing' | 'snappy' | 'bouncy'>('easing');
  const [duration, setDuration] = useState<number>(25);
  const [delay] = useState<number>(5);
  const [easing] = useState<EasingPresetName>('easeOut');
  const [fade, setFade] = useState<boolean>(true);
  const [rotate, setRotate] = useState<boolean>(false);
  const [clip, setClip] = useState<boolean>(true);
  const [reverse, setReverse] = useState<boolean>(false);

  // Content Selection
  const [contentType, setContentType] = useState<'typography' | 'shapes' | 'mockup'>('typography');

  // Replay frame offset
  const [replayOffset, setReplayOffset] = useState<number>(0);

  const handleReplay = () => {
    setReplayOffset(currentFrame);
  };

  const effectiveFrame = Math.max(0, currentFrame - replayOffset);

  const useSpring = motionStyle !== 'easing';
  const overshoot = motionStyle === 'bouncy';
  const springPreset = motionStyle === 'bouncy' ? 'bouncy' : 'snappy';

  // Resolved scale values based on scale preset
  let initialScale: number | undefined;
  let finalScale: number | undefined;
  if (scalePreset === 'subtle') {
    initialScale = 0.6;
    finalScale = 1.0;
  } else if (scalePreset === 'hyper') {
    initialScale = 1.0;
    finalScale = 2.5;
  }

  const rotationVal = rotate ? 15 : 0;

  // Live metrics calculation
  const metrics = calculateZoomMetrics({
    currentFrame: effectiveFrame,
    fps,
    mode,
    initialScale,
    finalScale,
    transformOrigin: origin,
    duration,
    delay,
    easing,
    fade,
    rotation: rotationVal,
    spring: useSpring,
    springPreset,
    overshoot,
    reverse,
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.scale.xl,
        width: '100%',
        maxWidth: 1280,
        margin: '0 auto',
      }}
    >
      {/* 1. Diagnostic Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${Spacing.scale.md}px ${Spacing.scale.lg}px`,
          backgroundColor: Colors.dark.surface1,
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
          flexWrap: 'wrap',
          gap: Spacing.scale.md,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.md }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: Spacing.radius.sm,
              backgroundColor: 'rgba(236, 72, 153, 0.15)',
              border: `1px solid ${ACCENT_PINK}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: ACCENT_PINK,
            }}
          >
            <ZoomIn size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <span style={{ ...Typography.caption.eyebrow, color: ACCENT_PINK }}>
                LAYER 2 · TRANSITIONS
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: Typography.fontFamily.mono,
                  padding: '1px 6px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: Colors.accent.emerald,
                  border: `1px solid ${Colors.accent.emerald}40`,
                }}
              >
                ● READY
              </span>
            </div>
            <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, margin: 0 }}>
              ZoomTransition Engine
            </h3>
          </div>
        </div>

        {/* Live Diagnostics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.lg }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              ZOOM MODE
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: ACCENT_PINK }}>
              {mode.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              CURRENT SCALE
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.emerald }}>
              {metrics.scale.toFixed(2)}x
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              TRANSFORM ORIGIN
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.cyan }}>
              {metrics.transformOrigin}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              TIMELINE
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.text.primary }}>
              f:{effectiveFrame}/{duration + delay} ({((metrics.progress || 0) * 100).toFixed(0)}%)
            </span>
          </div>

          <button
            type="button"
            onClick={handleReplay}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: Colors.dark.surface2,
              border: `1px solid ${Colors.border.default}`,
              color: Colors.text.primary,
              fontFamily: Typography.fontFamily.mono,
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RotateCw size={12} />
            Replay
          </button>
        </div>
      </div>

      {/* 2. Controls Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: Spacing.scale.md,
          padding: Spacing.scale.md,
          backgroundColor: Colors.dark.surface1,
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        {/* Mode Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            ZOOM MODE
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'in', label: 'In' },
              { id: 'out', label: 'Out' },
              { id: 'in-out', label: 'In-Out' },
              { id: 'through', label: 'Through' },
              { id: 'replace', label: 'Replace' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id as ZoomTransitionMode)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: mode === tab.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${mode === tab.id ? Colors.accent.cyan : Colors.border.default}`,
                  color: mode === tab.id ? '#000000' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transform Origin Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            TRANSFORM ORIGIN
          </label>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {ORIGIN_OPTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setOrigin(item.id)}
                style={{
                  padding: '6px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: origin === item.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${origin === item.id ? Colors.accent.cyan : Colors.border.default}`,
                  color: origin === item.id ? '#000000' : Colors.text.secondary,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scale Preset Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            SCALE RANGE PRESET
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'full', label: '0 → 1 (Full)' },
              { id: 'subtle', label: '0.6 → 1 (Subtle)' },
              { id: 'hyper', label: '1 → 2.5 (Hyper)' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setScalePreset(p.id as typeof scalePreset)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: scalePreset === p.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${scalePreset === p.id ? Colors.accent.cyan : Colors.border.default}`,
                  color: scalePreset === p.id ? '#000000' : Colors.text.secondary,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Motion Dynamic Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            MOTION DYNAMICS
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'easing', label: 'Cubic Ease' },
              { id: 'snappy', label: 'Spring' },
              { id: 'bouncy', label: 'Overshoot' },
            ].map((sty) => (
              <button
                key={sty.id}
                type="button"
                onClick={() => setMotionStyle(sty.id as typeof motionStyle)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: motionStyle === sty.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${motionStyle === sty.id ? Colors.accent.cyan : Colors.border.default}`,
                  color: motionStyle === sty.id ? '#000000' : Colors.text.secondary,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {sty.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            DURATION ({duration}f · {(duration / fps).toFixed(2)}s)
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[15, 25, 40].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: duration === d ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${duration === d ? Colors.accent.cyan : Colors.border.default}`,
                  color: duration === d ? '#000000' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {d}f
              </button>
            ))}
          </div>
        </div>

        {/* Modifiers (Fade, Rotate, Clip, Reverse) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            MODIFIERS
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={fade} onChange={(e) => setFade(e.target.checked)} />
              Fade
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={rotate} onChange={(e) => setRotate(e.target.checked)} />
              Rotate (15°)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={clip} onChange={(e) => setClip(e.target.checked)} />
              Clip
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={reverse} onChange={(e) => setReverse(e.target.checked)} />
              Reverse
            </label>
          </div>
        </div>

        {/* Content Type Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            CONTENT TYPE
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'typography', label: 'Typography', icon: Type },
              { id: 'shapes', label: 'Shapes', icon: Square },
              { id: 'mockup', label: 'Smartphone', icon: Smartphone },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setContentType(c.id as typeof contentType)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    padding: '6px 4px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: contentType === c.id ? Colors.accent.cyan : Colors.dark.surface2,
                    border: `1px solid ${contentType === c.id ? Colors.accent.cyan : Colors.border.default}`,
                    color: contentType === c.id ? '#000000' : Colors.text.secondary,
                    fontSize: 10,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={12} />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Interactive Preview Stage */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: Colors.dark.surface1,
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
            borderBottom: `1px solid ${Colors.border.subtle}`,
            backgroundColor: Colors.dark.surface2,
          }}
        >
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            LIVE ZOOM PREVIEW CANVAS
          </span>
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: ACCENT_PINK }}>
            Origin: {origin} · Scale: {metrics.scale.toFixed(2)}x
          </span>
        </div>

        <div
          style={{
            height: 380,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: Spacing.scale.xl,
            backgroundColor: '#0a0d14',
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.05) 0%, transparent 70%),
              linear-gradient(${Colors.dark.surface1} 1px, transparent 1px),
              linear-gradient(90deg, ${Colors.dark.surface1} 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 20px 20px, 20px 20px',
            position: 'relative',
            overflow: clip ? 'hidden' : 'visible',
          }}
        >
          <div
            style={{
              width: mode === 'replace' ? 420 : 'auto',
              maxWidth: '100%',
              height: mode === 'replace' ? 240 : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mode === 'replace' ? (
              <ZoomTransition
                mode="replace"
                initialScale={initialScale}
                finalScale={finalScale}
                transformOrigin={origin}
                duration={duration}
                delay={delay}
                fade={fade}
                rotation={rotationVal}
                spring={useSpring}
                springPreset={springPreset}
                overshoot={overshoot}
                reverse={reverse}
                clip={clip}
                style={{ width: 380, height: 220 }}
                fromContent={
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: Colors.dark.surface2,
                      border: `1px solid ${Colors.accent.electricViolet}60`,
                      borderRadius: Spacing.radius.md,
                      padding: Spacing.scale.lg,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: Spacing.scale.sm,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                  >
                    <Layers size={36} color={Colors.accent.electricViolet} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: Colors.text.primary }}>
                      Outgoing Layer A
                    </span>
                    <span style={{ fontSize: 11, color: Colors.text.secondary }}>
                      Scaling out & fading away
                    </span>
                  </div>
                }
                toContent={
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: Colors.dark.surface1,
                      border: `1px solid ${Colors.accent.cyan}60`,
                      borderRadius: Spacing.radius.md,
                      padding: Spacing.scale.lg,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: Spacing.scale.sm,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                  >
                    <Sparkles size={36} color={Colors.accent.cyan} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: Colors.accent.cyan }}>
                      Incoming Layer B
                    </span>
                    <span style={{ fontSize: 11, color: Colors.text.secondary }}>
                      Scaling in to view
                    </span>
                  </div>
                }
              />
            ) : (
              <ZoomTransition
                mode={mode}
                initialScale={initialScale}
                finalScale={finalScale}
                transformOrigin={origin}
                duration={duration}
                delay={delay}
                fade={fade}
                rotation={rotationVal}
                spring={useSpring}
                springPreset={springPreset}
                overshoot={overshoot}
                reverse={reverse}
                clip={clip}
              >
                {contentType === 'typography' && (
                  <div
                    style={{
                      padding: `${Spacing.scale.lg}px ${Spacing.scale.xl}px`,
                      backgroundColor: Colors.dark.surface2,
                      border: `1px solid ${ACCENT_PINK}60`,
                      borderRadius: Spacing.radius.md,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: Spacing.scale.xs,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ ...Typography.caption.eyebrow, color: ACCENT_PINK }}>
                      KINETIC TYPOGRAPHY
                    </span>
                    <span style={{ ...Typography.headline.h3, color: Colors.text.primary, fontWeight: 800 }}>
                      Cinematic Zoom
                    </span>
                    <span style={{ fontSize: 12, color: Colors.text.tertiary, maxWidth: 280 }}>
                      Scales with sub-pixel precision from origin {origin}
                    </span>
                  </div>
                )}

                {contentType === 'shapes' && (
                  <div
                    style={{
                      width: 180,
                      height: 180,
                      borderRadius: Spacing.radius.lg,
                      background: `linear-gradient(135deg, ${ACCENT_PINK}, ${Colors.accent.electricViolet})`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: Spacing.scale.xs,
                      boxShadow: '0 12px 36px rgba(236, 72, 153, 0.35)',
                    }}
                  >
                    <Eye size={40} color="#ffffff" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>
                      Vector Shape
                    </span>
                  </div>
                )}

                {contentType === 'mockup' && (
                  <SmartphoneMockup
                    width={200}
                    height={380}
                    deviceColor={Colors.dark.surface2}
                    screenColor={Colors.dark.surface1}
                    model="flagship"
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: Spacing.scale.md,
                        gap: Spacing.scale.xs,
                      }}
                    >
                      <Sparkles size={28} color={ACCENT_PINK} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: Colors.text.primary }}>
                        App Interface
                      </span>
                    </div>
                  </SmartphoneMockup>
                )}
              </ZoomTransition>
            )}
          </div>
        </div>
      </div>

      {/* 4. Comparative Grid: 4 Zoom Variations */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.sm }}>
        <span style={{ ...Typography.caption.eyebrow, color: Colors.text.tertiary }}>
          COMPARATIVE ZOOM VARIATIONS (A/B TESTING)
        </span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {[
            { id: 'in', label: 'Zoom In (Enter)', origin: 'center', fade: true, spring: false },
            { id: 'out', label: 'Zoom Out (Exit)', origin: 'center', fade: true, spring: false },
            { id: 'through', label: 'Zoom Through (Flyby)', origin: 'center', fade: true, spring: false },
            { id: 'replace', label: 'Zoom Replace (Push)', origin: 'center', fade: true, spring: false },
          ].map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: Colors.dark.surface1,
                borderRadius: Spacing.radius.md,
                border: `1px solid ${Colors.border.default}`,
                padding: Spacing.scale.md,
                display: 'flex',
                flexDirection: 'column',
                gap: Spacing.scale.sm,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: Colors.text.primary }}>
                  {item.label}
                </span>
                <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan }}>
                  {item.origin}
                </span>
              </div>
              <div
                style={{
                  height: 120,
                  backgroundColor: Colors.dark.surface2,
                  borderRadius: Spacing.radius.sm,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {item.id === 'replace' ? (
                  <ZoomTransition
                    mode="replace"
                    duration={duration}
                    delay={delay}
                    fade={item.fade}
                    style={{ width: '100%', height: '100%' }}
                    fromContent={
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: Colors.dark.surface1,
                          color: Colors.accent.electricViolet,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        Scene A
                      </div>
                    }
                    toContent={
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: Colors.dark.surface2,
                          color: Colors.accent.cyan,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        Scene B
                      </div>
                    }
                  />
                ) : (
                  <ZoomTransition
                    mode={item.id as ZoomTransitionMode}
                    duration={duration}
                    delay={delay}
                    fade={item.fade}
                    transformOrigin={item.origin}
                  >
                    <div
                      style={{
                        padding: '10px 16px',
                        backgroundColor: Colors.dark.surface1,
                        border: `1px solid ${ACCENT_PINK}60`,
                        borderRadius: Spacing.radius.sm,
                        color: Colors.text.primary,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      Dynamic Card
                    </div>
                  </ZoomTransition>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
