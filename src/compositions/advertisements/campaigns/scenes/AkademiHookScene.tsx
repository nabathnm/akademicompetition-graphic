/**
 * Scene 1: Opening Hook
 * Captures immediate audience attention in the first 2 seconds with high-energy typography,
 * pulsating geometric shapes, and dynamic accent lines.
 *
 * Duration: 120 frames (4.0 seconds at 30 FPS)
 * Copy: "Eh, ada yang baru nih!"
 */

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Sparkles } from 'lucide-react';
import { AKADEMI_RELAUNCH_CONFIG } from '../akademiRelaunchConfig.ts';
import { WordReveal } from '../../../../components/typography/WordReveal.tsx';
import { AnimatedCircle } from '../../../../components/graphics/AnimatedCircle.tsx';
import { AnimatedLine } from '../../../../components/graphics/AnimatedLine.tsx';
import { Typography } from '../../../../styles/typography.ts';

export const AkademiHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { copy, theme } = AKADEMI_RELAUNCH_CONFIG;

  // Eyebrow badge entrance spring
  const badgeProgress = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 180 },
  });

  // Secondary subtext fade-in
  const subtextOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtextY = interpolate(frame, [35, 55], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 48px',
        textAlign: 'center',
      }}
    >
      {/* Background Decorative Pulsing Circles */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          opacity: 0.35,
        }}
      >
        <AnimatedCircle
          radius={260}
          strokeWidth={2}
          stroke={theme.accentCyan}
          animation="pulse"
          fill="none"
          durationInFrames={60}
        />
        <div style={{ position: 'absolute', top: 30, left: 30 }}>
          <AnimatedCircle
            radius={200}
            strokeWidth={1.5}
            stroke={theme.accentGold}
            animation="ring-expansion"
            fill="none"
            durationInFrames={80}
          />
        </div>
      </div>

      {/* Eyebrow Notification Pill */}
      <div
        style={{
          transform: `scale(${badgeProgress}) translateY(${interpolate(badgeProgress, [0, 1], [30, 0])}px)`,
          opacity: badgeProgress,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 24px',
          borderRadius: 999,
          background: 'rgba(0, 240, 255, 0.08)',
          border: `1px solid ${theme.accentCyan}`,
          boxShadow: '0 0 24px rgba(0, 240, 255, 0.25)',
          marginBottom: 36,
        }}
      >
        <Sparkles size={20} color={theme.accentCyan} />
        <span
          style={{
            fontFamily: Typography.fontFamily.mono,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '0.2em',
            color: theme.accentCyan,
            textTransform: 'uppercase',
          }}
        >
          {copy.scene1.eyebrow}
        </span>
      </div>

      {/* Main Hook Kinetic Headline */}
      <div style={{ maxWidth: 880, marginBottom: 28 }}>
        <WordReveal
          text={copy.scene1.headline}
          variant="slide-up"
          staggerDelay={4}
          delay={10}
          durationInFrames={20}
          springPreset="snappy"
          style={{
            fontFamily: Typography.fontFamily.sans,
            fontSize: 84,
            fontWeight: 900,
            lineHeight: 1.12,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
          }}
        />
      </div>

      {/* Dynamic Symmetrical Accent Line */}
      <div style={{ width: 340, height: 4, margin: '16px auto 28px' }}>
        <AnimatedLine
          x1={0}
          y1={2}
          x2={340}
          y2={2}
          stroke={theme.accentGold}
          strokeWidth={3}
          animation="reveal-center"
          startFrame={25}
          durationInFrames={30}
        />
      </div>

      {/* Subheadline Callout */}
      <div
        style={{
          opacity: subtextOpacity,
          transform: `translateY(${subtextY}px)`,
          maxWidth: 720,
        }}
      >
        <p
          style={{
            fontFamily: Typography.fontFamily.sans,
            fontSize: 28,
            fontWeight: 600,
            color: theme.textSecondary,
            lineHeight: 1.45,
            margin: 0,
          }}
        >
          {copy.scene1.subheadline}
        </p>
      </div>
    </div>
  );
};
