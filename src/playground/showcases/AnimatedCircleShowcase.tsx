/**
 * AnimatedCircle Showcase
 * Interactive development and evaluation harness for the AnimatedCircle component.
 * Demonstrates filled circles, outlines, rings, partial arcs, circular progress indicators,
 * pulse breathing, and choreographed multi-ring concentric radar compositions.
 * Layer 1 / Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame } from 'remotion';
import { Sliders } from 'lucide-react';
import { AnimatedCircle } from '../../components/graphics/AnimatedCircle.tsx';
import type {
  CircleAnimation,
} from '../../components/graphics/types.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

const ALL_ANIMATIONS: Array<{ id: CircleAnimation; label: string }> = [
  { id: 'scale-in', label: 'Scale In' },
  { id: 'draw-in', label: 'Draw In (Circumference)' },
  { id: 'draw-out', label: 'Draw Out (Retract)' },
  { id: 'radial-reveal', label: 'Radial Reveal (Angle Sweep)' },
  { id: 'ring-expansion', label: 'Ring Expansion' },
  { id: 'pulse', label: 'Pulse (Harmonic Breath)' },
  { id: 'progress', label: 'Circular Progress' },
  { id: 'rotate', label: 'Rotate (Continuous)' },
  { id: 'fade-in', label: 'Fade In' },
  { id: 'none', label: 'None (Static)' },
];

export const AnimatedCircleShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();

  // Sandbox interactive controls state
  const [selectedAnimation, setSelectedAnimation] = useState<CircleAnimation>('progress');
  const [radius, setRadius] = useState<number>(56);
  const [strokeWidth, setStrokeWidth] = useState<number>(6);
  const [fillColor, setFillColor] = useState<string>('transparent');
  const [strokeColor, setStrokeColor] = useState<string>(Colors.accent.cyan);
  const [progressVal, setProgressVal] = useState<number>(75);
  const [startAngle, setStartAngle] = useState<number>(0);
  const [endAngle, setEndAngle] = useState<number>(360);
  const [showTrack, setShowTrack] = useState<boolean>(true);
  const [delay, setDelay] = useState<number>(8);
  const [duration, setDuration] = useState<number>(25);

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
      {/* SECTION 1: Telemetry Diagnostic Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.md,
          fontFamily: Typography.fontFamily.mono,
          fontSize: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm }}>
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>● RADIAL CIRCLE ENGINE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Frame:</span>
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>{currentFrame}</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Delay:</span>
          <span style={{ color: Colors.accent.amber, fontWeight: 700 }}>{delay}f</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Radius:</span>
          <span style={{ color: Colors.accent.brandLight, fontWeight: 700 }}>{radius}px</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: Colors.dark.surface2,
              color: Colors.accent.emerald,
              fontSize: 11,
            }}
          >
            Mode: {selectedAnimation}
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: Colors.dark.surface2,
              color: Colors.accent.cyan,
              fontSize: 11,
            }}
          >
            Arc: {startAngle}° → {endAngle}° · W={strokeWidth}px
          </span>
        </div>
      </div>

      {/* SECTION 2: Interactive Sandbox & Controls Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          gap: Spacing.scale.lg,
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.lg,
          padding: Spacing.scale.lg,
        }}
      >
        {/* Controls Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: Spacing.scale.md,
            maxHeight: 520,
            overflowY: 'auto',
            paddingRight: Spacing.scale.xs,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
            <Sliders size={16} color={Colors.accent.cyan} />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em' }}>
              CIRCLE & PROGRESS CONTROLS
            </span>
          </div>

          {/* Animation Mode Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              ANIMATION MODE
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {ALL_ANIMATIONS.map((anim) => (
                <button
                  key={anim.id}
                  type="button"
                  onClick={() => setSelectedAnimation(anim.id)}
                  style={{
                    padding: '4px 6px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedAnimation === anim.id ? Colors.accent.cyan : Colors.dark.surface3,
                    border: `1px solid ${selectedAnimation === anim.id ? Colors.accent.cyan : Colors.border.default}`,
                    color: selectedAnimation === anim.id ? '#000' : Colors.text.secondary,
                    fontSize: 10,
                    fontWeight: selectedAnimation === anim.id ? 700 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {anim.label}
                </button>
              ))}
            </div>
          </div>

          {/* Radius & Stroke Width */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                RADIUS ({radius}px)
              </label>
              <input
                type="range"
                min={20}
                max={120}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                STROKE WIDTH ({strokeWidth}px)
              </label>
              <input
                type="range"
                min={1}
                max={24}
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Progress & Track Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                PROGRESS ({progressVal}%)
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={progressVal}
                onChange={(e) => setProgressVal(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowTrack((prev) => !prev)}
                style={{
                  padding: '6px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: showTrack ? Colors.accent.emerald : Colors.dark.surface3,
                  border: `1px solid ${showTrack ? Colors.accent.emerald : Colors.border.default}`,
                  color: showTrack ? '#FFF' : Colors.text.secondary,
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                TRACK: {showTrack ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Angles: Start & End Angle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                START ANGLE ({startAngle}°)
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={startAngle}
                onChange={(e) => setStartAngle(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                END ANGLE ({endAngle}°)
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={endAngle}
                onChange={(e) => setEndAngle(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Timing: Delay & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                DELAY (FRAMES)
              </label>
              <input
                type="number"
                min={0}
                max={60}
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value) || 0)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: Colors.dark.surface3,
                  border: `1px solid ${Colors.border.default}`,
                  color: Colors.text.primary,
                  fontSize: 12,
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                DURATION (FRAMES)
              </label>
              <input
                type="number"
                min={6}
                max={60}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value) || 20)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: Colors.dark.surface3,
                  border: `1px solid ${Colors.border.default}`,
                  color: Colors.text.primary,
                  fontSize: 12,
                }}
              />
            </div>
          </div>

          {/* Stroke & Fill Color Presets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                STROKE COLOR
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {['#00D1FF', '#276EF1', '#0E8345', '#FFC043', '#7B2CBF', '#FFFFFF'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setStrokeColor(c)}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      backgroundColor: c,
                      border: `2px solid ${strokeColor === c ? '#FFF' : 'transparent'}`,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                FILL COLOR
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  'transparent',
                  'rgba(0, 209, 255, 0.2)',
                  'rgba(39, 110, 241, 0.2)',
                  'rgba(14, 131, 69, 0.2)',
                  'rgba(255, 192, 67, 0.2)',
                ].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFillColor(f)}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      backgroundColor: f === 'transparent' ? Colors.dark.surface3 : f,
                      border: `2px solid ${fillColor === f ? '#FFF' : 'transparent'}`,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Sandbox Canvas */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.black,
            borderRadius: Spacing.radius.md,
            border: `1px dashed ${Colors.border.strong}`,
            padding: Spacing.scale.xxl,
            minHeight: 380,
            overflow: 'hidden',
          }}
        >
          {/* Subtle Coordinate Grid in background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle, ${Colors.border.subtle} 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: Spacing.scale.md,
              left: Spacing.scale.md,
              fontFamily: Typography.fontFamily.mono,
              fontSize: 11,
              color: Colors.text.tertiary,
            }}
          >
            STAGE VIEWPORT (RADIAL COORDINATES)
          </div>

          <AnimatedCircle
            radius={radius}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            startAngle={startAngle}
            endAngle={endAngle}
            progress={progressVal / 100}
            showTrack={showTrack}
            delay={delay}
            durationInFrames={duration}
            animation={selectedAnimation}
          >
            {selectedAnimation === 'progress' && (
              <div style={{ textAlign: 'center', fontFamily: Typography.fontFamily.mono }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: strokeColor }}>
                  {progressVal}%
                </span>
              </div>
            )}
          </AnimatedCircle>

          <div
            style={{
              position: 'absolute',
              bottom: Spacing.scale.md,
              display: 'flex',
              gap: Spacing.scale.md,
              fontFamily: Typography.fontFamily.mono,
              fontSize: 10,
              color: Colors.text.muted,
            }}
          >
            <span>DIAMETER: {radius * 2}PX</span>
            <span>·</span>
            <span>CIRCUMFERENCE: {(2 * Math.PI * radius).toFixed(1)}PX</span>
            <span>·</span>
            <span>STROKE: {strokeWidth}PX</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Circle Geometries Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
          SECTION 3: CIRCLE GEOMETRY PRESETS
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: Spacing.scale.md,
          }}
        >
          {/* Filled Circle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
              minHeight: 160,
              gap: Spacing.scale.md,
            }}
          >
            <AnimatedCircle
              radius={36}
              fill={Colors.accent.brand}
              stroke="none"
              animation="scale-in"
              delay={0}
              durationInFrames={20}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Filled Circle</div>
              <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                Solid Brand Fill
              </div>
            </div>
          </div>

          {/* Outline Circle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
              minHeight: 160,
              gap: Spacing.scale.md,
            }}
          >
            <AnimatedCircle
              radius={36}
              fill="transparent"
              stroke={Colors.accent.emerald}
              strokeWidth={3}
              animation="draw-in"
              delay={4}
              durationInFrames={24}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Outline Ring</div>
              <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                3px Emerald Stroke
              </div>
            </div>
          </div>

          {/* Thick Radial Ring */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
              minHeight: 160,
              gap: Spacing.scale.md,
            }}
          >
            <AnimatedCircle
              radius={32}
              fill="transparent"
              stroke={Colors.accent.electricViolet}
              strokeWidth={10}
              animation="scale-in"
              delay={8}
              durationInFrames={20}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Thick Donut Ring</div>
              <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                10px Violet Ring
              </div>
            </div>
          </div>

          {/* Partial Circle / Arc */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
              minHeight: 160,
              gap: Spacing.scale.md,
            }}
          >
            <AnimatedCircle
              radius={36}
              fill="transparent"
              stroke={Colors.accent.amber}
              strokeWidth={4}
              startAngle={0}
              endAngle={240}
              strokeLinecap="round"
              animation="radial-reveal"
              delay={12}
              durationInFrames={24}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Partial Arc (240°)</div>
              <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                Round Caps · 0° to 240°
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Radial Animation Modes Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald }}>
          SECTION 4: RADIAL ANIMATION CAPABILITIES
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: Spacing.scale.md,
          }}
        >
          {/* Scale In */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
              gap: Spacing.scale.sm,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.brand }}>
              1. Scale In
            </div>
            <div style={{ padding: '16px 0' }}>
              <AnimatedCircle
                radius={36}
                fill="rgba(39, 110, 241, 0.2)"
                stroke={Colors.accent.brand}
                strokeWidth={3}
                animation="scale-in"
                delay={0}
                durationInFrames={24}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.muted }}>
              Smooth Eased Spring Settle
            </span>
          </div>

          {/* Draw In (Circumference Trace) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
              gap: Spacing.scale.sm,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.cyan }}>
              2. Circumference Draw
            </div>
            <div style={{ padding: '16px 0' }}>
              <AnimatedCircle
                radius={36}
                fill="transparent"
                stroke={Colors.accent.cyan}
                strokeWidth={3}
                animation="draw-in"
                delay={5}
                durationInFrames={24}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.muted }}>
              strokeDashoffset Trace
            </span>
          </div>

          {/* Radial Reveal */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
              gap: Spacing.scale.sm,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.emerald }}>
              3. Radial Angle Sweep
            </div>
            <div style={{ padding: '16px 0' }}>
              <AnimatedCircle
                radius={36}
                fill="transparent"
                stroke={Colors.accent.emerald}
                strokeWidth={4}
                startAngle={0}
                endAngle={280}
                animation="radial-reveal"
                delay={10}
                durationInFrames={24}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.muted }}>
              Sweeps Arc from 0° to 280°
            </span>
          </div>

          {/* Ring Expansion */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
              gap: Spacing.scale.sm,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.electricViolet }}>
              4. Ring Expansion
            </div>
            <div style={{ padding: '16px 0' }}>
              <AnimatedCircle
                radius={36}
                fill="transparent"
                stroke={Colors.accent.electricViolet}
                strokeWidth={3}
                animation="ring-expansion"
                delay={15}
                durationInFrames={24}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.muted }}>
              Radius expands from 0 to 36px
            </span>
          </div>

          {/* Harmonic Pulse */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
              gap: Spacing.scale.sm,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.amber }}>
              5. Harmonic Pulse
            </div>
            <div style={{ padding: '16px 0' }}>
              <AnimatedCircle
                radius={36}
                fill="rgba(255, 192, 67, 0.15)"
                stroke={Colors.accent.amber}
                strokeWidth={2}
                animation="pulse"
                delay={0}
                durationInFrames={60}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.muted }}>
              Periodic Sine Breath Oscillation
            </span>
          </div>

          {/* Circular Progress */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
              gap: Spacing.scale.sm,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.cyan }}>
              6. Circular Progress
            </div>
            <div style={{ padding: '16px 0' }}>
              <AnimatedCircle
                radius={36}
                stroke={Colors.accent.cyan}
                strokeWidth={5}
                progress={0.84}
                showTrack={true}
                animation="progress"
                delay={20}
                durationInFrames={25}
              >
                <span style={{ fontSize: 12, fontWeight: 800, fontFamily: Typography.fontFamily.mono }}>
                  84%
                </span>
              </AnimatedCircle>
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.muted }}>
              Fills Arc with Track Backing
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 5: Real-World Commercial Compositions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet }}>
          SECTION 5: REAL-WORLD MOTION COMPOSITIONS
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.scale.lg }}>
          {/* Preset A: Multi-Ring Concentric Radar Reticle */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.lg,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.xl,
              minHeight: 280,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: Spacing.scale.md,
                left: Spacing.scale.md,
                fontFamily: Typography.fontFamily.mono,
                fontSize: 10,
                color: Colors.accent.cyan,
              }}
            >
              ● CONCENTRIC RADAR RETICLE (3 LAYERS)
            </div>

            {/* Concentric Layer 1: Outer Pulse Shockwave */}
            <div style={{ position: 'absolute' }}>
              <AnimatedCircle
                radius={88}
                fill="none"
                stroke="rgba(0, 209, 255, 0.25)"
                strokeWidth={1}
                strokeDasharray="6 4"
                animation="pulse"
                delay={0}
                durationInFrames={40}
              />
            </div>

            {/* Concentric Layer 2: Mid Range Ring with Draw */}
            <div style={{ position: 'absolute' }}>
              <AnimatedCircle
                radius={64}
                fill="none"
                stroke={Colors.accent.brand}
                strokeWidth={2}
                animation="draw-in"
                delay={6}
                durationInFrames={30}
              />
            </div>

            {/* Concentric Layer 3: Inner Target Ring */}
            <div style={{ position: 'absolute' }}>
              <AnimatedCircle
                radius={36}
                fill="rgba(0, 209, 255, 0.15)"
                stroke={Colors.accent.cyan}
                strokeWidth={2}
                animation="scale-in"
                delay={12}
                durationInFrames={20}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: Colors.accent.emerald,
                  }}
                />
              </AnimatedCircle>
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: Spacing.scale.md,
                display: 'flex',
                gap: Spacing.scale.md,
                fontFamily: Typography.fontFamily.mono,
                fontSize: 10,
                color: Colors.text.muted,
              }}
            >
              <span>LOCK: 3 TARGETS ACQUIRED</span>
              <span>·</span>
              <span>AZIMUTH: 042°</span>
            </div>
          </div>

          {/* Preset B: Metric Health Progress Dashboard */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.lg,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.xl,
              gap: Spacing.scale.md,
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.emerald }}>
                ● SUBSYSTEM BATTERY CHARGE
              </span>
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                400V PACK
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xl }}>
              <AnimatedCircle
                radius={50}
                stroke={Colors.accent.emerald}
                strokeWidth={8}
                progress={0.92}
                showTrack={true}
                trackStroke={Colors.dark.surface3}
                trackStrokeWidth={8}
                animation="progress"
                delay={8}
                durationInFrames={28}
              >
                <div style={{ textAlign: 'center', fontFamily: Typography.fontFamily.mono }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: Colors.text.primary }}>
                    92%
                  </div>
                  <div style={{ fontSize: 8, color: Colors.text.tertiary }}>CHARGE</div>
                </div>
              </AnimatedCircle>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div>
                  <div style={{ fontSize: 11, color: Colors.text.tertiary }}>ESTIMATED RANGE</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: Colors.text.primary }}>348 MILES</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: Colors.text.tertiary }}>CHARGING SPEED</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: Colors.accent.emerald }}>150 kW FAST CHARGE</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: Colors.text.muted, borderTop: `1px solid ${Colors.border.subtle}`, paddingTop: Spacing.scale.sm }}>
              <span>CELL TEMP: 28°C OPTIMAL</span>
              <span>CYCLE: 142 COMPLETED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
