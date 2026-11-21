/**
 * MotionUtilitiesShowcase Component
 * Development & diagnostic showcase in the Motion Playground to inspect and validate
 * the behavior of animation utilities and hooks frame-by-frame.
 *
 * NOTE: This is a diagnostic evaluation harness, NOT an advertisement or reusable visual component.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { useMotion } from '../../hooks/useMotion';
import { useFrameProgress } from '../../hooks/useFrameProgress';
import { useSpringProgress } from '../../hooks/useSpringProgress';
import { useStagger } from '../../hooks/useStagger';
import { useTyping } from '../../hooks/useTyping';
import { formatTimecode } from '../../utils/timing/frame';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';

export const MotionUtilitiesShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Master hook & Frame progress
  const motion = useMotion();
  const motionFade = motion.fadeIn({ startFrame: 0, duration: 30 });
  const motionSlide = motion.slideIn({ startFrame: 0, duration: 30, from: 20, to: 0 });

  const frameProgress = useFrameProgress({
    startFrame: 0,
    durationInFrames: 60,
    easing: 'standard',
  });

  // 2. Spring presets comparison
  const springGentle = useSpringProgress({ startFrame: 10, preset: 'gentle' });
  const springSmooth = useSpringProgress({ startFrame: 10, preset: 'smooth' });
  const springBouncy = useSpringProgress({ startFrame: 10, preset: 'bouncy' });
  const springSnappy = useSpringProgress({ startFrame: 10, preset: 'snappy' });
  const springHeavy = useSpringProgress({ startFrame: 10, preset: 'heavy' });

  // 3. Stagger hook (6 items cascading)
  const stagger = useStagger({
    itemCount: 6,
    startFrame: 15,
    staggerDelay: 5,
    itemDuration: 20,
    easing: 'easeOutCubic',
  });

  // 4. Typing hook
  const typing = useTyping({
    text: 'DETERMINISTIC MOTION ENGINE // REMOTION TS',
    startFrame: 5,
    framesPerCharacter: 2,
    cursor: { blinkSpeedFrames: 14, cursorChar: '█' },
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.scale.xl,
        width: '100%',
        color: Colors.text.primary,
        fontFamily: Typography.fontFamily.sans,
      }}
    >
      {/* SECTION 1: Telemetry & useFrameProgress State */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: Spacing.scale.md,
        }}
      >
        {/* Frame Telemetry Card */}
        <div
          style={{
            backgroundColor: Colors.dark.surface1,
            border: `1px solid ${Colors.border.default}`,
            borderRadius: Spacing.radius.md,
            padding: Spacing.scale.md,
          }}
        >
          <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: 8 }}>
            FRAME TELEMETRY
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: Typography.fontFamily.mono, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: Colors.text.secondary }}>Current Frame:</span>
              <strong style={{ color: Colors.text.primary }}>{currentFrame} / {durationInFrames}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: Colors.text.secondary }}>FPS:</span>
              <strong style={{ color: Colors.text.primary }}>{fps}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: Colors.text.secondary }}>Timecode:</span>
              <strong style={{ color: Colors.accent.amber }}>{formatTimecode(currentFrame, fps)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${Colors.border.subtle}`, paddingTop: 4, marginTop: 2 }}>
              <span style={{ color: Colors.text.tertiary }}>useMotion() Fade:</span>
              <span style={{ color: Colors.text.secondary }}>{(motionFade * 100).toFixed(0)}% (y: {motionSlide.toFixed(1)}px)</span>
            </div>
          </div>
        </div>

        {/* useFrameProgress State Card */}
        <div
          style={{
            backgroundColor: Colors.dark.surface1,
            border: `1px solid ${Colors.border.default}`,
            borderRadius: Spacing.radius.md,
            padding: Spacing.scale.md,
          }}
        >
          <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.brand, marginBottom: 8 }}>
            useFrameProgress() STATE [0..60f]
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: Typography.fontFamily.mono }}>
              <span>Linear: {(frameProgress.rawProgress * 100).toFixed(1)}%</span>
              <span>Eased (Standard): {(frameProgress.easedProgress * 100).toFixed(1)}%</span>
            </div>
            {/* Visual progress bar */}
            <div style={{ height: 8, backgroundColor: Colors.dark.surface3, borderRadius: Spacing.radius.full, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, Math.max(0, frameProgress.easedProgress * 100))}%`,
                  backgroundColor: Colors.accent.brand,
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: 10, fontFamily: Typography.fontFamily.mono }}>
              <span style={{ color: frameProgress.isStarted ? Colors.accent.emerald : Colors.text.tertiary }}>
                ● Started
              </span>
              <span style={{ color: frameProgress.isActive ? Colors.accent.amber : Colors.text.tertiary }}>
                ● Active
              </span>
              <span style={{ color: frameProgress.isComplete ? Colors.accent.cyan : Colors.text.tertiary }}>
                ● Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Spring Physics Presets Comparison */}
      <div
        style={{
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.md,
          padding: Spacing.scale.md,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.scale.sm }}>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet }}>
            SPRING PRESETS COMPARISON (TRIGGER AT FRAME 10)
          </span>
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
            from: 0 → to: 1
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.sm }}>
          {[
            { name: 'Gentle', val: springGentle, desc: 'd:26 m:1.2 s:80', color: '#4B88F5' },
            { name: 'Smooth', val: springSmooth, desc: 'd:20 m:1.0 s:120', color: '#276EF1' },
            { name: 'Bouncy', val: springBouncy, desc: 'd:10 m:0.7 s:160', color: '#FFC043' },
            { name: 'Snappy', val: springSnappy, desc: 'd:15 m:0.6 s:200', color: '#0E8345' },
            { name: 'Heavy', val: springHeavy, desc: 'd:32 m:2.0 s:90', color: '#7B2CBF' },
          ].map((preset) => (
            <div key={preset.name} style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.md }}>
              <div style={{ width: 80, fontSize: 12, fontWeight: 600 }}>{preset.name}</div>
              <div style={{ width: 120, fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                {preset.desc}
              </div>
              <div style={{ flex: 1, height: 16, backgroundColor: Colors.dark.surface2, borderRadius: Spacing.radius.xs, position: 'relative', overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: `${Math.max(0, Math.min(100, preset.val * 100))}%`,
                    backgroundColor: preset.color,
                  }}
                />
              </div>
              <div style={{ width: 60, textAlign: 'right', fontSize: 12, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
                {preset.val.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Staggered Timeline Hook (useStagger) */}
      <div
        style={{
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.md,
          padding: Spacing.scale.md,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.scale.sm }}>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald }}>
            USESTAGGER() CASCADE (6 ITEMS · INTERVAL: 5f · DURATION: 20f)
          </span>
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
            Total Span: {stagger.totalDurationInFrames}f
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: Spacing.scale.xs }}>
          {stagger.progressList.map((prog, idx) => {
            const status = stagger.getItemStatus(idx);
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: Colors.dark.surface2,
                  padding: Spacing.scale.sm,
                  borderRadius: Spacing.radius.sm,
                  border: `1px solid ${status.isActive ? Colors.accent.emerald : Colors.border.subtle}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: Typography.fontFamily.mono }}>
                  <span>Item #{idx + 1}</span>
                  <span style={{ color: status.isComplete ? Colors.accent.emerald : Colors.text.secondary }}>
                    {(prog * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ height: 6, backgroundColor: Colors.dark.surface3, borderRadius: Spacing.radius.full, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${prog * 100}%`,
                      backgroundColor: status.isComplete ? Colors.accent.emerald : Colors.accent.brand,
                    }}
                  />
                </div>
                <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                  Start: {status.itemStartFrame}f
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Typewriter Hook (useTyping) */}
      <div
        style={{
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.md,
          padding: Spacing.scale.md,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.scale.sm }}>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber }}>
            USETYPING() PROGRESSION (START: 5f · SPEED: 2f/CHAR)
          </span>
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
            {typing.visibleCharCount} / {typing.totalCharCount} CHARS ({typing.isComplete ? 'COMPLETE' : typing.isTyping ? 'TYPING' : 'WAITING'})
          </span>
        </div>

        <div
          style={{
            minHeight: 48,
            backgroundColor: Colors.dark.bgPrimary,
            borderRadius: Spacing.radius.sm,
            padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
            border: `1px solid ${Colors.border.subtle}`,
            fontFamily: Typography.fontFamily.mono,
            fontSize: 16,
            color: Colors.accent.cyan,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <span>{typing.fullTextWithCursor}</span>
        </div>
      </div>
    </div>
  );
};
