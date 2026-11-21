/**
 * SlideTransition Showcase
 * Interactive playground showcase for SlideTransition.
 * Demonstrates:
 * - All 8 cardinal and diagonal directions (left, right, top, bottom, top-left, top-right, bottom-left, bottom-right)
 * - Enter, exit, enter-exit, and replace (cross-slide push) modes
 * - Combined slide and fade
 * - Different distances (percentages and pixels)
 * - Spring physics with overshoot vs cubic-bezier easing curves
 * - Typography, geometric cards, and device mockup content
 * Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  RotateCcw,
  Move,
  Type,
  Palette,
  Smartphone,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
} from 'lucide-react';
import { SlideTransition } from '../../components/transitions/SlideTransition.tsx';
import { calculateSlideMetrics } from '../../components/transitions/slideTransitionStyle.ts';
import type {
  SlideDirection,
  SlideTransitionMode,
} from '../../components/transitions/types.ts';
import type { EasingPresetName } from '../../utils/animation/easing.ts';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup.tsx';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

interface DirectionOption {
  id: SlideDirection;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

const DIRECTION_OPTIONS: DirectionOption[] = [
  { id: 'left', label: 'Left (←)', icon: ArrowLeft },
  { id: 'right', label: 'Right (→)', icon: ArrowRight },
  { id: 'top', label: 'Top (↑)', icon: ArrowUp },
  { id: 'bottom', label: 'Bottom (↓)', icon: ArrowDown },
  { id: 'top-left', label: 'Top-Left (↖)', icon: ArrowUpLeft },
  { id: 'top-right', label: 'Top-Right (↗)', icon: ArrowUpRight },
  { id: 'bottom-left', label: 'Bottom-Left (↙)', icon: ArrowDownLeft },
  { id: 'bottom-right', label: 'Bottom-Right (↘)', icon: ArrowDownRight },
];

export const SlideTransitionShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mode and Direction
  const [mode, setMode] = useState<SlideTransitionMode>('enter');
  const [direction, setDirection] = useState<SlideDirection>('left');
  const [distance, setDistance] = useState<string | number>('100%');

  // Motion Dynamics
  const [motionStyle, setMotionStyle] = useState<'easing' | 'snappy' | 'bouncy'>('easing');
  const [duration, setDuration] = useState<number>(25);
  const [delay] = useState<number>(5);
  const [easing] = useState<EasingPresetName>('easeOut');
  const [fade, setFade] = useState<boolean>(true);
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

  // Live metrics calculation
  const metrics = calculateSlideMetrics({
    currentFrame: effectiveFrame,
    fps,
    direction,
    mode,
    distance,
    duration,
    delay,
    easing,
    fade,
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
              backgroundColor: 'rgba(0, 209, 255, 0.15)',
              border: `1px solid ${Colors.accent.cyan}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.accent.cyan,
            }}
          >
            <Move size={20} />
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
              SlideTransition Engine
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
              {direction.toUpperCase()} ({mode.toUpperCase()})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              COORDINATES (ΔX, ΔY)
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.emerald }}>
              {metrics.translateX}, {metrics.translateY}
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
              backgroundColor: Colors.accent.cyan,
              border: 'none',
              color: '#000000',
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
            SLIDE MODE
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'enter', label: 'Enter' },
              { id: 'exit', label: 'Exit' },
              { id: 'enter-exit', label: 'In-Out' },
              { id: 'replace', label: 'Replace' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMode(tab.id as SlideTransitionMode)}
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
            MOVEMENT DIRECTION (8 VECTORS)
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
            {DIRECTION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = direction === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDirection(opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '6px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: isSelected ? Colors.accent.cyan : Colors.dark.surface2,
                    border: `1px solid ${isSelected ? Colors.accent.cyan : Colors.border.default}`,
                    color: isSelected ? '#000000' : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={12} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Movement Style (Spring vs Easing) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            PHYSICS & TIMING
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

        {/* Distance Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            SLIDE DISTANCE
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {['100%', '50%', '300px', '120px'].map((dist) => (
              <button
                key={dist}
                type="button"
                onClick={() => setDistance(dist)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: distance === dist ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${distance === dist ? Colors.accent.cyan : Colors.border.default}`,
                  color: distance === dist ? '#000000' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {dist}
              </button>
            ))}
          </div>
        </div>

        {/* Duration & Delay */}
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

        {/* Toggles (Fade, Clip, Reverse) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            MODIFIERS
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={fade} onChange={(e) => setFade(e.target.checked)} />
              Fade
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: 'span 2' }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            CONTENT ARTIFACT
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'typography', label: 'Typography Banner', icon: Type },
              { id: 'shapes', label: 'Geometric Cards', icon: Palette },
              { id: 'mockup', label: 'Device Mockup', icon: Smartphone },
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
                    backgroundColor: contentType === tab.id ? Colors.accent.cyan : Colors.dark.surface2,
                    border: `1px solid ${contentType === tab.id ? Colors.accent.cyan : Colors.border.default}`,
                    color: contentType === tab.id ? '#000000' : Colors.text.secondary,
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
            'radial-gradient(circle at 50% 30%, rgba(0, 209, 255, 0.08) 0%, transparent 65%), radial-gradient(circle at 80% 85%, rgba(39, 110, 241, 0.05) 0%, transparent 50%)',
        }}
      >
        <div style={{ width: '100%', maxWidth: 760, position: 'relative' }}>
          <SlideTransition
            direction={direction}
            mode={mode}
            distance={distance}
            duration={duration}
            delay={delay}
            easing={easing}
            fade={fade}
            spring={useSpring}
            springPreset={springPreset}
            overshoot={overshoot}
            reverse={reverse}
            clip={clip}
            fromContent={
              mode === 'replace' ? (
                /* Replace Outgoing: Source View */
                <div
                  style={{
                    padding: 32,
                    backgroundColor: '#0f172a',
                    borderRadius: 16,
                    border: `1px solid ${Colors.accent.electricViolet}50`,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.electricViolet, fontWeight: 700 }}>
                      OUTGOING SCENE 01
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(123, 44, 191, 0.2)', color: Colors.accent.electricViolet, fontSize: 10 }}>
                      Exiting
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff' }}>
                    Dashboard Analytics Scene
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>
                    This layer slides away along the direction vector as the replacement incoming scene pushes in.
                  </p>
                </div>
              ) : undefined
            }
            toContent={
              mode === 'replace' ? (
                /* Replace Incoming: Target View */
                <div
                  style={{
                    padding: 32,
                    backgroundColor: '#07182b',
                    borderRadius: 16,
                    border: `1px solid ${Colors.accent.cyan}60`,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan, fontWeight: 700 }}>
                      INCOMING SCENE 02
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: 4, backgroundColor: 'rgba(0, 209, 255, 0.2)', color: Colors.accent.cyan, fontSize: 10 }}>
                      Entering
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#ffffff' }}>
                    Live Production Deployment
                  </h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#7dd3fc', lineHeight: 1.5 }}>
                    Synchronized coordinated push and pull with zero frame boundary jumps.
                  </p>
                </div>
              ) : undefined
            }
          >
            {/* Standard Single Layer Content for enter, exit, enter-exit */}
            {mode !== 'replace' && (
              <>
                {/* Content Option 1: Typography Banner */}
                {contentType === 'typography' && (
                  <div
                    style={{
                      padding: 36,
                      backgroundColor: Colors.dark.surface1,
                      borderRadius: 16,
                      border: `1px solid ${Colors.accent.cyan}50`,
                      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
                      SPATIAL VECTOR PRIMITIVE
                    </span>
                    <h2 style={{ ...Typography.headline.h2, color: Colors.text.primary, margin: 0 }}>
                      SlideTransition
                    </h2>
                    <p style={{ ...Typography.body.large, color: Colors.text.secondary, maxWidth: 480, margin: 0 }}>
                      Moves visual content smoothly across 8 directional vectors with optional spring physics and overshoot.
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
                      { title: 'Direction', val: direction.toUpperCase(), color: Colors.accent.cyan },
                      { title: 'Physics', val: motionStyle.toUpperCase(), color: Colors.accent.emerald },
                      { title: 'Distance', val: distance.toString(), color: Colors.accent.amber },
                    ].map((card) => (
                      <div
                        key={card.title}
                        style={{
                          padding: 18,
                          backgroundColor: Colors.dark.surface2,
                          borderRadius: 12,
                          border: `1px solid ${card.color}40`,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                        }}
                      >
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>{card.title}</span>
                        <span style={{ fontSize: 16, fontWeight: 800, color: card.color }}>{card.val}</span>
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
                          backgroundColor: '#07182b',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 16,
                          gap: 8,
                        }}
                      >
                        <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.accent.cyan }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>Sliding Mobile App</span>
                        <span style={{ fontSize: 10, color: '#7dd3fc' }}>Vector: {direction}</span>
                      </div>
                    </SmartphoneMockup>
                  </div>
                )}
              </>
            )}
          </SlideTransition>
        </div>
      </div>
    </div>
  );
};
