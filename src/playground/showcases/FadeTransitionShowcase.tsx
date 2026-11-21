/**
 * FadeTransition Showcase
 * Interactive playground showcase for FadeTransition.
 * Demonstrates:
 * - Fade In (mode="in")
 * - Fade Out (mode="out")
 * - Fade In and Out envelope (mode="in-out")
 * - Dual-layer Crossfade dissolve (mode="crossfade")
 * - Diverse durations, delays, and easing curves
 * - Typography, geometric shapes, and device mockup content
 * Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  RotateCcw,
  Layers,
  Type,
  Palette,
  Laptop,
} from 'lucide-react';
import { FadeTransition } from '../../components/transitions/FadeTransition.tsx';
import { calculateFadeOpacity } from '../../components/transitions/fadeTransitionStyle.ts';
import type { FadeTransitionMode } from '../../components/transitions/types.ts';
import type { EasingPresetName } from '../../utils/animation/easing.ts';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup.tsx';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

export const FadeTransitionShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mode and Timing Configuration
  const [mode, setMode] = useState<FadeTransitionMode>('in');
  const [duration, setDuration] = useState<number>(30);
  const [delay, setDelay] = useState<number>(5);
  const [easing, setEasing] = useState<EasingPresetName>('easeInOut');
  const [fromOpacity, setFromOpacity] = useState<number>(0);
  const [toOpacity, setToOpacity] = useState<number>(1);
  const [reverse, setReverse] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>('transparent');

  // Content Selection
  const [contentType, setContentType] = useState<'typography' | 'shapes' | 'mockup'>('typography');

  // Replay frame offset
  const [replayOffset, setReplayOffset] = useState<number>(0);

  const handleReplay = () => {
    setReplayOffset(currentFrame);
  };

  const effectiveFrame = Math.max(0, currentFrame - replayOffset);

  // Compute live metrics for display
  const metrics = calculateFadeOpacity({
    currentFrame: effectiveFrame,
    mode,
    duration,
    delay,
    fromOpacity,
    toOpacity,
    reverse,
    easing,
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
              backgroundColor: 'rgba(123, 44, 191, 0.15)',
              border: `1px solid ${Colors.accent.electricViolet}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.accent.electricViolet,
            }}
          >
            <Layers size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet }}>
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
              FadeTransition Engine
            </h3>
          </div>
        </div>

        {/* Live Diagnostics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.lg }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              TRANSITION MODE
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.cyan }}>
              {mode.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              OPACITY METRIC
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.emerald }}>
              {mode === 'crossfade'
                ? `Out: ${(metrics.outgoingOpacity * 100).toFixed(0)}% | In: ${(metrics.incomingOpacity * 100).toFixed(0)}%`
                : `${(metrics.opacity * 100).toFixed(1)}% (${metrics.phase})`}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              TIMELINE
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.amber }}>
              f={effectiveFrame} ({((effectiveFrame / fps) % 60).toFixed(1)}s)
            </span>
          </div>

          <button
            type="button"
            onClick={handleReplay}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: Spacing.radius.sm,
              backgroundColor: Colors.accent.electricViolet,
              border: 'none',
              color: '#ffffff',
              fontFamily: Typography.fontFamily.mono,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} />
            REPLAY
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
            TRANSITION MODE
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'in', label: 'Fade In' },
              { id: 'out', label: 'Fade Out' },
              { id: 'in-out', label: 'In-Out' },
              { id: 'crossfade', label: 'Crossfade' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id as FadeTransitionMode)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: mode === tab.id ? Colors.accent.electricViolet : Colors.dark.surface2,
                  border: `1px solid ${mode === tab.id ? Colors.accent.electricViolet : Colors.border.default}`,
                  color: mode === tab.id ? '#ffffff' : Colors.text.secondary,
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

        {/* Duration in Frames */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            DURATION ({duration} frames · {(duration / fps).toFixed(2)}s)
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[15, 25, 40, 60].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: duration === d ? Colors.accent.electricViolet : Colors.dark.surface2,
                  border: `1px solid ${duration === d ? Colors.accent.electricViolet : Colors.border.default}`,
                  color: duration === d ? '#ffffff' : Colors.text.secondary,
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

        {/* Frame Delay */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            DELAY ({delay} frames)
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0, 5, 10, 20].map((del) => (
              <button
                key={del}
                type="button"
                onClick={() => setDelay(del)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: delay === del ? Colors.accent.electricViolet : Colors.dark.surface2,
                  border: `1px solid ${delay === del ? Colors.accent.electricViolet : Colors.border.default}`,
                  color: delay === del ? '#ffffff' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {del}f
              </button>
            ))}
          </div>
        </div>

        {/* Easing Curve */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            EASING CURVE
          </label>
          <select
            value={easing}
            onChange={(e) => setEasing(e.target.value as EasingPresetName)}
            style={{
              padding: '6px 8px',
              backgroundColor: Colors.dark.surface2,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.xs,
              color: Colors.text.primary,
              fontSize: 12,
              fontFamily: Typography.fontFamily.mono,
            }}
          >
            <option value="easeInOut">easeInOut (smooth sinusoidal)</option>
            <option value="easeOut">easeOut (decelerating entry)</option>
            <option value="easeIn">easeIn (accelerating exit)</option>
            <option value="linear">linear (constant velocity)</option>
            <option value="standard">standard (material curve)</option>
            <option value="emphasized">emphasized (dramatic overshoot)</option>
          </select>
        </div>

        {/* Opacity Range Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            OPACITY RANGE ({fromOpacity} → {toOpacity})
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { label: '0 → 1 (Full)', from: 0, to: 1 },
              { label: '0.2 → 0.9 (Subtle)', from: 0.2, to: 0.9 },
              { label: '0.4 → 1.0 (Ghost)', from: 0.4, to: 1.0 },
            ].map((rng) => (
              <button
                key={rng.label}
                type="button"
                onClick={() => {
                  setFromOpacity(rng.from);
                  setToOpacity(rng.to);
                }}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: fromOpacity === rng.from && toOpacity === rng.to ? Colors.accent.electricViolet : Colors.dark.surface2,
                  border: `1px solid ${fromOpacity === rng.from && toOpacity === rng.to ? Colors.accent.electricViolet : Colors.border.default}`,
                  color: fromOpacity === rng.from && toOpacity === rng.to ? '#ffffff' : Colors.text.secondary,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {rng.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reverse & Background Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            DIRECTION & CONTAINER
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={reverse} onChange={(e) => setReverse(e.target.checked)} />
              Reverse
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={bgColor !== 'transparent'}
                onChange={(e) => setBgColor(e.target.checked ? '#0f172a' : 'transparent')}
              />
              Backdrop Tint
            </label>
          </div>
        </div>

        {/* Content Type Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            CONTENT TYPE
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'typography', label: 'Typography & Banners', icon: Type },
              { id: 'shapes', label: 'Geometric Cards & Visuals', icon: Palette },
              { id: 'mockup', label: 'Device Mockup Hardware', icon: Laptop },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setContentType(tab.id as typeof contentType)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '6px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: contentType === tab.id ? Colors.accent.electricViolet : Colors.dark.surface2,
                    border: `1px solid ${contentType === tab.id ? Colors.accent.electricViolet : Colors.border.default}`,
                    color: contentType === tab.id ? '#ffffff' : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Live Staging Stage */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 520,
          padding: `${Spacing.scale.xxl}px ${Spacing.scale.lg}px`,
          backgroundColor: Colors.dark.bgPrimary,
          borderRadius: Spacing.radius.lg,
          border: `1px solid ${Colors.border.default}`,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(123, 44, 191, 0.1) 0%, transparent 65%), radial-gradient(circle at 80% 85%, rgba(0, 209, 255, 0.05) 0%, transparent 50%)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 760, position: 'relative' }}>
          <FadeTransition
            mode={mode}
            duration={duration}
            delay={delay}
            easing={easing}
            fromOpacity={fromOpacity}
            toOpacity={toOpacity}
            reverse={reverse}
            backgroundColor={bgColor}
            style={{ borderRadius: Spacing.radius.md }}
            fromContent={
              mode === 'crossfade' ? (
                /* Crossfade Layer A: Outgoing Light/Neon Card */
                <div
                  style={{
                    padding: 32,
                    backgroundColor: '#111827',
                    borderRadius: 16,
                    border: `1px solid ${Colors.accent.cyan}40`,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan, fontWeight: 700 }}>
                      LAYER A · SOURCE SCENE
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(0, 209, 255, 0.15)', color: Colors.accent.cyan, fontSize: 10 }}>
                      Active
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff' }}>
                    Original Presentation View
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#9ca3af', lineHeight: 1.5 }}>
                    This layer fades out smoothly during the cross-dissolve transition window.
                  </p>
                </div>
              ) : undefined
            }
            toContent={
              mode === 'crossfade' ? (
                /* Crossfade Layer B: Incoming Emerald Card */
                <div
                  style={{
                    padding: 32,
                    backgroundColor: '#064e3b',
                    borderRadius: 16,
                    border: `1px solid ${Colors.accent.emerald}`,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: '#a7f3d0', fontWeight: 700 }}>
                      LAYER B · TARGET SCENE
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(16, 185, 129, 0.25)', color: '#a7f3d0', fontSize: 10 }}>
                      Transitioned
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff' }}>
                    Seamless Cross-Dissolved Target
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#d1fae5', lineHeight: 1.5 }}>
                    Both layers overlap simultaneously with pure deterministic opacity curves.
                  </p>
                </div>
              ) : undefined
            }
          >
            {/* Standard Single Layer Content for 'in', 'out', 'in-out' modes */}
            {mode !== 'crossfade' && (
              <>
                {/* Content Option 1: Typography Banner */}
                {contentType === 'typography' && (
                  <div
                    style={{
                      padding: 36,
                      backgroundColor: Colors.dark.surface1,
                      borderRadius: 16,
                      border: `1px solid ${Colors.accent.electricViolet}50`,
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet }}>
                      DETERMINISTIC MOTION PRIMITIVE
                    </span>
                    <h2 style={{ ...Typography.headline.h2, color: Colors.text.primary, margin: 0 }}>
                      FadeTransition
                    </h2>
                    <p style={{ ...Typography.body.large, color: Colors.text.secondary, maxWidth: 480, margin: 0 }}>
                      Smoothly dissolves elements between visible and invisible states using frame-accurate Remotion interpolation.
                    </p>
                  </div>
                )}

                {/* Content Option 2: Geometric Cards */}
                {contentType === 'shapes' && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 16,
                      padding: 24,
                      backgroundColor: Colors.dark.surface1,
                      borderRadius: 16,
                      border: `1px solid ${Colors.border.default}`,
                    }}
                  >
                    {[
                      { title: 'Snappy', color: Colors.accent.cyan, desc: 'Quick 15f dissolve' },
                      { title: 'Balanced', color: Colors.accent.electricViolet, desc: 'Natural 30f ease' },
                      { title: 'Cinematic', color: Colors.accent.emerald, desc: 'Deep 60f fade' },
                    ].map((card) => (
                      <div
                        key={card.title}
                        style={{
                          padding: 20,
                          backgroundColor: Colors.dark.surface2,
                          borderRadius: 12,
                          border: `1px solid ${card.color}40`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                        }}
                      >
                        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: card.color }} />
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{card.title}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{card.desc}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Content Option 3: Mockup Content */}
                {contentType === 'mockup' && (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <SmartphoneMockup
                      width={240}
                      model="compact"
                      shadow="medium"
                      animation="none"
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#0f172a',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 16,
                          gap: 8,
                        }}
                      >
                        <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.accent.electricViolet }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>Faded Mobile App</span>
                        <span style={{ fontSize: 10, color: '#94a3b8' }}>Mode: {mode}</span>
                      </div>
                    </SmartphoneMockup>
                  </div>
                )}
              </>
            )}
          </FadeTransition>
        </div>
      </div>
    </div>
  );
};
