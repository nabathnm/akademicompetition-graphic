/**
 * WipeTransition Showcase
 * Interactive motion graphics playground component demonstrating WipeTransition capabilities:
 * - Directions: Left-to-Right, Right-to-Left, Top-to-Bottom, Bottom-to-Top, Center-Out, Center-In, Diagonal, Radial
 * - Modes: Reveal (In), Hide (Out), Reveal-Hide (In-Out), Replace (Cross-Wipe)
 * - Leading Edge Bar: Configurable indicator with optional glow
 * - Modifiers: Simultaneous Opacity Fade, Reverse progression, custom durations
 * - Multi-content compatibility: Typography, Shapes, Mockups
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Scissors,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Maximize2,
  Minimize2,
  Compass,
  Circle,
  RotateCw,
  Sparkles,
  Smartphone,
  Square,
  Type,
  Layers,
} from 'lucide-react';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { WipeTransition } from '../../components/transitions/WipeTransition';
import { calculateWipeMetrics } from '../../components/transitions/wipeTransitionStyle';
import type { WipeDirection, WipeTransitionMode } from '../../components/transitions/types';
import type { EasingPresetName } from '../../utils/animation/easing';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup';

const DIRECTION_OPTIONS: { id: WipeDirection; label: string; icon: React.FC<{ size?: number }> }[] = [
  { id: 'left-to-right', label: 'Left → Right', icon: ArrowRight },
  { id: 'right-to-left', label: 'Right → Left', icon: ArrowLeft },
  { id: 'top-to-bottom', label: 'Top → Bottom', icon: ArrowDown },
  { id: 'bottom-to-top', label: 'Bottom → Top', icon: ArrowUp },
  { id: 'center-out', label: 'Center Out', icon: Maximize2 },
  { id: 'center-in', label: 'Center In', icon: Minimize2 },
  { id: 'diagonal', label: 'Diagonal', icon: Compass },
  { id: 'radial', label: 'Radial (Iris)', icon: Circle },
];

export const WipeTransitionShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mode and Direction
  const [direction, setDirection] = useState<WipeDirection>('left-to-right');
  const [mode, setMode] = useState<WipeTransitionMode>('reveal');

  // Motion Dynamics
  const [duration, setDuration] = useState<number>(25);
  const [delay] = useState<number>(5);
  const [easing, setEasing] = useState<EasingPresetName>('easeInOut');
  const [fade, setFade] = useState<boolean>(false);
  const [showEdge, setShowEdge] = useState<boolean>(true);
  const [reverse, setReverse] = useState<boolean>(false);

  // Content Selection
  const [contentType, setContentType] = useState<'typography' | 'shapes' | 'mockup'>('typography');

  // Replay frame offset
  const [replayOffset, setReplayOffset] = useState<number>(0);

  const handleReplay = () => {
    setReplayOffset(currentFrame);
  };

  const effectiveFrame = Math.max(0, currentFrame - replayOffset);

  // Live metrics calculation
  const metrics = calculateWipeMetrics({
    currentFrame: effectiveFrame,
    direction,
    mode,
    duration,
    delay,
    easing,
    fade,
    reverse,
    edgeWidth: 3,
  });

  const edgeColor = Colors.accent.cyan;

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
              backgroundColor: 'rgba(0, 209, 255, 0.15)',
              border: `1px solid ${Colors.accent.cyan}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.accent.cyan,
            }}
          >
            <Scissors size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
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
              WipeTransition Engine
            </h3>
          </div>
        </div>

        {/* Live Diagnostics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.lg }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              DIRECTION
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.cyan }}>
              {direction.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              WIPE MODE
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.emerald }}>
              {mode.toUpperCase()}
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
            WIPE MODE
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'reveal', label: 'Reveal' },
              { id: 'hide', label: 'Hide' },
              { id: 'reveal-hide', label: 'In-Out' },
              { id: 'replace', label: 'Replace' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id as WipeTransitionMode)}
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

        {/* Direction Selector (8 directions) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            WIPE DIRECTION (8 PATTERNS)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
            {DIRECTION_OPTIONS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDirection(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '6px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: direction === item.id ? Colors.accent.cyan : Colors.dark.surface2,
                    border: `1px solid ${direction === item.id ? Colors.accent.cyan : Colors.border.default}`,
                    color: direction === item.id ? '#000000' : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={13} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Easing Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            EASING CURVE
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'easeInOut', label: 'In-Out' },
              { id: 'easeOut', label: 'Out' },
              { id: 'linear', label: 'Linear' },
            ].map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setEasing(e.id as EasingPresetName)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: easing === e.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${easing === e.id ? Colors.accent.cyan : Colors.border.default}`,
                  color: easing === e.id ? '#000000' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {e.label}
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

        {/* Modifiers (Edge, Fade, Reverse) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            MODIFIERS
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showEdge} onChange={(e) => setShowEdge(e.target.checked)} />
              Edge Bar
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={fade} onChange={(e) => setFade(e.target.checked)} />
              Fade
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
            LIVE WIPE PREVIEW CANVAS
          </span>
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan }}>
            {metrics.clipPath}
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
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 209, 255, 0.05) 0%, transparent 70%),
              linear-gradient(${Colors.dark.surface1} 1px, transparent 1px),
              linear-gradient(90deg, ${Colors.dark.surface1} 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 20px 20px, 20px 20px',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: mode === 'replace' ? 440 : 'auto',
              maxWidth: '100%',
              height: mode === 'replace' ? 240 : 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mode === 'replace' ? (
              <WipeTransition
                mode="replace"
                direction={direction}
                duration={duration}
                delay={delay}
                easing={easing}
                fade={fade}
                reverse={reverse}
                edgeColor={showEdge ? edgeColor : undefined}
                edgeWidth={3}
                style={{ width: 420, height: 220 }}
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
                      Wiping away progressively
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
                      Revealing across viewport
                    </span>
                  </div>
                }
              />
            ) : (
              <WipeTransition
                mode={mode}
                direction={direction}
                duration={duration}
                delay={delay}
                easing={easing}
                fade={fade}
                reverse={reverse}
                edgeColor={showEdge ? edgeColor : undefined}
                edgeWidth={3}
              >
                {contentType === 'typography' && (
                  <div
                    style={{
                      padding: `${Spacing.scale.lg}px ${Spacing.scale.xl}px`,
                      backgroundColor: Colors.dark.surface2,
                      border: `1px solid ${Colors.accent.cyan}60`,
                      borderRadius: Spacing.radius.md,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: Spacing.scale.xs,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
                      PRECISION CLIPPING
                    </span>
                    <span style={{ ...Typography.headline.h3, color: Colors.text.primary, fontWeight: 800 }}>
                      Directional Wipe
                    </span>
                    <span style={{ fontSize: 12, color: Colors.text.tertiary, maxWidth: 300 }}>
                      Deterministic boundary progression along {direction}
                    </span>
                  </div>
                )}

                {contentType === 'shapes' && (
                  <div
                    style={{
                      width: 220,
                      height: 220,
                      borderRadius: Spacing.radius.lg,
                      background: `linear-gradient(135deg, ${Colors.accent.cyan}, ${Colors.accent.brand})`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: Spacing.scale.xs,
                      boxShadow: '0 12px 36px rgba(0, 209, 255, 0.35)',
                    }}
                  >
                    <Scissors size={44} color="#ffffff" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>
                      Clipped Geometry
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
                      <Sparkles size={28} color={Colors.accent.cyan} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: Colors.text.primary }}>
                        App Viewport
                      </span>
                    </div>
                  </SmartphoneMockup>
                )}
              </WipeTransition>
            )}
          </div>
        </div>
      </div>

      {/* 4. Comparative Grid: 4 Wipe Directions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.sm }}>
        <span style={{ ...Typography.caption.eyebrow, color: Colors.text.tertiary }}>
          COMPARATIVE WIPE DIRECTIONS (A/B TESTING)
        </span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {[
            { id: 'left-to-right', label: 'Left → Right (Linear)', dir: 'left-to-right' as WipeDirection },
            { id: 'center-out', label: 'Center Out (Iris Box)', dir: 'center-out' as WipeDirection },
            { id: 'diagonal', label: 'Diagonal (45° Sweep)', dir: 'diagonal' as WipeDirection },
            { id: 'radial', label: 'Radial (Circular Mask)', dir: 'radial' as WipeDirection },
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
                  {item.dir}
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
                <WipeTransition
                  mode="reveal"
                  direction={item.dir}
                  duration={duration}
                  delay={delay}
                  easing={easing}
                  edgeColor={showEdge ? edgeColor : undefined}
                  style={{ width: '100%', height: '100%' }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: Colors.dark.surface1,
                      border: `1px solid ${Colors.accent.cyan}40`,
                      color: Colors.text.primary,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Wiping Content
                  </div>
                </WipeTransition>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
