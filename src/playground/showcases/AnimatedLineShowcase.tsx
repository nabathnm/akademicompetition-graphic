/**
 * AnimatedLine Showcase
 * Interactive development and evaluation harness for the AnimatedLine component.
 * Demonstrates horizontal, vertical, diagonal, and custom endpoint lines,
 * SVG stroke drawing reveals, stroke cap styles, dash patterns, and real-world UI divider/underline applications.
 * Layer 1 / Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame } from 'remotion';
import { Sliders } from 'lucide-react';
import { AnimatedLine } from '../../components/graphics/AnimatedLine.tsx';
import type {
  LineOrientation,
  LineAnimation,
} from '../../components/graphics/types.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

const ALL_ORIENTATIONS: Array<{ id: LineOrientation; label: string }> = [
  { id: 'horizontal', label: 'Horizontal' },
  { id: 'vertical', label: 'Vertical' },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'custom', label: 'Custom (x1, y1 -> x2, y2)' },
];

const ALL_ANIMATIONS: Array<{ id: LineAnimation; label: string }> = [
  { id: 'draw-in', label: 'Draw In (Start -> End)' },
  { id: 'draw-out', label: 'Draw Out (Retract)' },
  { id: 'reveal-left', label: 'Reveal Left (Start)' },
  { id: 'reveal-right', label: 'Reveal Right (End)' },
  { id: 'reveal-center', label: 'Reveal Center (Outward)' },
  { id: 'length-expansion', label: 'Length Expansion' },
  { id: 'stroke-width', label: 'Stroke Width Expansion' },
  { id: 'move-in', label: 'Move In (Slide)' },
  { id: 'fade-in', label: 'Fade In' },
  { id: 'none', label: 'None (Static)' },
];

const ALL_LINECAPS: Array<'round' | 'butt' | 'square'> = ['round', 'butt', 'square'];

const ALL_DASH_PATTERNS: Array<{ id: string; label: string; value: string | undefined }> = [
  { id: 'solid', label: 'Solid', value: undefined },
  { id: 'dashed', label: 'Dashed (8 4)', value: '8 4' },
  { id: 'dotted', label: 'Dotted (2 4)', value: '2 4' },
  { id: 'dash-dot', label: 'Dash-Dot (12 4 3 4)', value: '12 4 3 4' },
];

export const AnimatedLineShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();

  // Sandbox interactive controls state
  const [orientation, setOrientation] = useState<LineOrientation>('horizontal');
  const [selectedAnimation, setSelectedAnimation] = useState<LineAnimation>('draw-in');
  const [lineLength, setLineLength] = useState<number>(240);
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [strokeCap, setStrokeCap] = useState<'round' | 'butt' | 'square'>('round');
  const [dashPattern, setDashPattern] = useState<string | undefined>(undefined);
  const [strokeColor, setStrokeColor] = useState<string>(Colors.accent.brand);
  const [rotation, setRotation] = useState<number>(0);
  const [delay, setDelay] = useState<number>(10);
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
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>● VECTOR LINE ENGINE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Frame:</span>
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>{currentFrame}</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Delay:</span>
          <span style={{ color: Colors.accent.amber, fontWeight: 700 }}>{delay}f</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Orientation:</span>
          <span style={{ color: Colors.accent.brandLight, fontWeight: 700 }}>{orientation}</span>
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
            L={lineLength}px · W={strokeWidth}px · {strokeCap}
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
              LINE GEOMETRY & MOTION CONTROLS
            </span>
          </div>

          {/* Orientation Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              GEOMETRIC ORIENTATION
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {ALL_ORIENTATIONS.map((ori) => (
                <button
                  key={ori.id}
                  type="button"
                  onClick={() => setOrientation(ori.id)}
                  style={{
                    padding: '5px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: orientation === ori.id ? Colors.accent.brand : Colors.dark.surface3,
                    border: `1px solid ${orientation === ori.id ? Colors.accent.brandLight : Colors.border.default}`,
                    color: Colors.text.primary,
                    fontSize: 11,
                    fontWeight: orientation === ori.id ? 700 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {ori.label}
                </button>
              ))}
            </div>
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

          {/* Length & Stroke Width */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                LENGTH ({lineLength}px)
              </label>
              <input
                type="range"
                min={60}
                max={400}
                value={lineLength}
                onChange={(e) => setLineLength(Number(e.target.value))}
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
                max={16}
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Line Cap & Dash Pattern */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                LINE CAP
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {ALL_LINECAPS.map((cap) => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => setStrokeCap(cap)}
                    style={{
                      flex: 1,
                      padding: '4px 0',
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: strokeCap === cap ? Colors.accent.emerald : Colors.dark.surface3,
                      border: `1px solid ${strokeCap === cap ? Colors.accent.emerald : Colors.border.default}`,
                      color: strokeCap === cap ? '#FFF' : Colors.text.secondary,
                      fontSize: 10,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                ROTATION ({rotation}°)
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Dash Pattern Preset */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              DASH PATTERN
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {ALL_DASH_PATTERNS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDashPattern(p.value)}
                  style={{
                    padding: '4px 6px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: dashPattern === p.value ? Colors.accent.electricViolet : Colors.dark.surface3,
                    border: `1px solid ${dashPattern === p.value ? Colors.accent.electricViolet : Colors.border.default}`,
                    color: dashPattern === p.value ? '#FFF' : Colors.text.secondary,
                    fontSize: 10,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {p.label}
                </button>
              ))}
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

          {/* Stroke Color Swatches */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              STROKE COLOR
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#276EF1', '#0E8345', '#00D1FF', '#FFC043', '#7B2CBF', '#FFFFFF'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setStrokeColor(c)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    backgroundColor: c,
                    border: `2px solid ${strokeColor === c ? '#FFF' : 'transparent'}`,
                    cursor: 'pointer',
                  }}
                />
              ))}
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
            STAGE VIEWPORT (SVG COORDINATES)
          </div>

          {orientation === 'custom' ? (
            <AnimatedLine
              x1={20}
              y1={20}
              x2={lineLength}
              y2={Math.round(lineLength * 0.6)}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap={strokeCap}
              strokeDasharray={dashPattern}
              rotation={rotation}
              delay={delay}
              durationInFrames={duration}
              animation={selectedAnimation}
            />
          ) : (
            <AnimatedLine
              orientation={orientation}
              length={lineLength}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap={strokeCap}
              strokeDasharray={dashPattern}
              rotation={rotation}
              delay={delay}
              durationInFrames={duration}
              animation={selectedAnimation}
            />
          )}

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
            <span>ORIENTATION: {orientation.toUpperCase()}</span>
            <span>·</span>
            <span>CAP: {strokeCap.toUpperCase()}</span>
            <span>·</span>
            <span>STROKE: {strokeWidth}PX</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Geometry & Coordinates Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
          SECTION 3: GEOMETRY & COORDINATES PRESETS
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: Spacing.scale.md,
          }}
        >
          {/* Horizontal Preset */}
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
              minHeight: 140,
              gap: Spacing.scale.md,
            }}
          >
            <AnimatedLine
              orientation="horizontal"
              length={160}
              stroke={Colors.accent.brand}
              strokeWidth={3}
              animation="draw-in"
              delay={0}
              durationInFrames={25}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Horizontal Divider</div>
              <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                (0,0) → (160,0)
              </div>
            </div>
          </div>

          {/* Vertical Preset */}
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
              minHeight: 140,
              gap: Spacing.scale.md,
            }}
          >
            <AnimatedLine
              orientation="vertical"
              length={80}
              stroke={Colors.accent.emerald}
              strokeWidth={3}
              animation="draw-in"
              delay={4}
              durationInFrames={25}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Vertical Separator</div>
              <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                (0,0) → (0,80)
              </div>
            </div>
          </div>

          {/* Diagonal Preset */}
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
              minHeight: 140,
              gap: Spacing.scale.md,
            }}
          >
            <AnimatedLine
              orientation="diagonal"
              length={80}
              stroke={Colors.accent.electricViolet}
              strokeWidth={3}
              animation="draw-in"
              delay={8}
              durationInFrames={25}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Diagonal Vector</div>
              <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                45° Angle
              </div>
            </div>
          </div>

          {/* Custom Endpoints */}
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
              minHeight: 140,
              gap: Spacing.scale.md,
            }}
          >
            <AnimatedLine
              x1={10}
              y1={70}
              x2={150}
              y2={10}
              stroke={Colors.accent.amber}
              strokeWidth={3}
              animation="draw-in"
              delay={12}
              durationInFrames={25}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Custom Vector</div>
              <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                (10,70) → (150,10)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Stroke Styles & Caps Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald }}>
          SECTION 4: STROKE CAPS & DASH PATTERNS
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: Spacing.scale.md,
          }}
        >
          {/* Round Cap */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
              <span style={{ fontWeight: 700 }}>Round Cap (Solid)</span>
              <span style={{ fontFamily: Typography.fontFamily.mono }}>strokeLinecap="round"</span>
            </div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedLine
                orientation="horizontal"
                length={220}
                stroke={Colors.accent.cyan}
                strokeWidth={8}
                strokeLinecap="round"
                animation="draw-in"
                durationInFrames={30}
              />
            </div>
          </div>

          {/* Square Cap */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
              <span style={{ fontWeight: 700 }}>Square Cap (Solid)</span>
              <span style={{ fontFamily: Typography.fontFamily.mono }}>strokeLinecap="square"</span>
            </div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedLine
                orientation="horizontal"
                length={220}
                stroke={Colors.accent.brand}
                strokeWidth={8}
                strokeLinecap="square"
                animation="draw-in"
                durationInFrames={30}
              />
            </div>
          </div>

          {/* Butt Cap */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
              <span style={{ fontWeight: 700 }}>Butt Cap (Solid)</span>
              <span style={{ fontFamily: Typography.fontFamily.mono }}>strokeLinecap="butt"</span>
            </div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedLine
                orientation="horizontal"
                length={220}
                stroke={Colors.accent.amber}
                strokeWidth={8}
                strokeLinecap="butt"
                animation="draw-in"
                durationInFrames={30}
              />
            </div>
          </div>

          {/* Dotted Pattern */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
              <span style={{ fontWeight: 700 }}>Precision Dot Matrix</span>
              <span style={{ fontFamily: Typography.fontFamily.mono }}>dasharray="2 6"</span>
            </div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedLine
                orientation="horizontal"
                length={220}
                stroke={Colors.accent.emerald}
                strokeWidth={4}
                strokeLinecap="round"
                strokeDasharray="2 6"
                animation="fade-in"
                durationInFrames={20}
              />
            </div>
          </div>

          {/* Dashed Pattern */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
              <span style={{ fontWeight: 700 }}>Technical Dash</span>
              <span style={{ fontFamily: Typography.fontFamily.mono }}>dasharray="10 6"</span>
            </div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedLine
                orientation="horizontal"
                length={220}
                stroke={Colors.accent.electricViolet}
                strokeWidth={3}
                strokeDasharray="10 6"
                animation="fade-in"
                durationInFrames={20}
              />
            </div>
          </div>

          {/* Dash-Dot Pattern */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.lg,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
              <span style={{ fontWeight: 700 }}>Radar Dash-Dot</span>
              <span style={{ fontFamily: Typography.fontFamily.mono }}>dasharray="14 4 3 4"</span>
            </div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedLine
                orientation="horizontal"
                length={220}
                stroke={Colors.text.primary}
                strokeWidth={2}
                strokeDasharray="14 4 3 4"
                animation="fade-in"
                durationInFrames={20}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: Animation Capabilities Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber }}>
          SECTION 5: ANIMATION CAPABILITIES COMPARISON
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: Spacing.scale.md,
          }}
        >
          {/* Draw In */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.md,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.brand }}>
              1. Draw In (Start → End)
            </div>
            <div style={{ fontSize: 11, color: Colors.text.tertiary, marginBottom: Spacing.scale.sm }}>
              Progressive SVG stroke-dash reveal
            </div>
            <div style={{ padding: '16px 0' }}>
              <AnimatedLine
                orientation="horizontal"
                length={220}
                stroke={Colors.accent.brand}
                strokeWidth={3}
                animation="draw-in"
                delay={0}
                durationInFrames={25}
              />
            </div>
          </div>

          {/* Reveal Center */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.md,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.cyan }}>
              2. Reveal from Center
            </div>
            <div style={{ fontSize: 11, color: Colors.text.tertiary, marginBottom: Spacing.scale.sm }}>
              Symmetric bilateral expansion outward
            </div>
            <div style={{ padding: '16px 0' }}>
              <AnimatedLine
                orientation="horizontal"
                length={220}
                stroke={Colors.accent.cyan}
                strokeWidth={3}
                animation="reveal-center"
                delay={5}
                durationInFrames={25}
              />
            </div>
          </div>

          {/* Reveal Right */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.md,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.emerald }}>
              3. Reveal from Right (Reverse)
            </div>
            <div style={{ fontSize: 11, color: Colors.text.tertiary, marginBottom: Spacing.scale.sm }}>
              Draws backwards from end coordinate
            </div>
            <div style={{ padding: '16px 0' }}>
              <AnimatedLine
                orientation="horizontal"
                length={220}
                stroke={Colors.accent.emerald}
                strokeWidth={3}
                animation="reveal-right"
                delay={10}
                durationInFrames={25}
              />
            </div>
          </div>

          {/* Length Expansion */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.md,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.electricViolet }}>
              4. Length Expansion
            </div>
            <div style={{ fontSize: 11, color: Colors.text.tertiary, marginBottom: Spacing.scale.sm }}>
              Physical endpoint translation
            </div>
            <div style={{ padding: '16px 0' }}>
              <AnimatedLine
                orientation="horizontal"
                length={220}
                stroke={Colors.accent.electricViolet}
                strokeWidth={3}
                animation="length-expansion"
                delay={15}
                durationInFrames={25}
              />
            </div>
          </div>

          {/* Stroke Width Animation */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.md,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.amber }}>
              5. Stroke Width Expansion
            </div>
            <div style={{ fontSize: 11, color: Colors.text.tertiary, marginBottom: Spacing.scale.sm }}>
              Grows thickness from 0 to 8px
            </div>
            <div style={{ padding: '16px 0' }}>
              <AnimatedLine
                orientation="horizontal"
                length={220}
                stroke={Colors.accent.amber}
                strokeWidth={8}
                animation="stroke-width"
                delay={20}
                durationInFrames={25}
              />
            </div>
          </div>

          {/* Move In */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.xs,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.md,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.text.primary }}>
              6. Move In (Slide + Fade)
            </div>
            <div style={{ fontSize: 11, color: Colors.text.tertiary, marginBottom: Spacing.scale.sm }}>
              Directional upward spatial entrance
            </div>
            <div style={{ padding: '16px 0' }}>
              <AnimatedLine
                orientation="horizontal"
                length={220}
                stroke={Colors.text.primary}
                strokeWidth={3}
                animation="move-in"
                direction="up"
                delay={25}
                durationInFrames={25}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: Real-World Commercial UI Applications */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet }}>
          SECTION 6: REAL-WORLD MOTION COMPOSITIONS
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.scale.lg }}>
          {/* Preset A: Editorial Typographic Underline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.lg,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.xl,
              gap: Spacing.scale.sm,
            }}
          >
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.brand }}>
              ● EDITORIAL TYPOGRAPHY PRESET
            </span>
            <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  color: Colors.text.primary,
                  margin: 0,
                }}
              >
                NEXT-GEN AUTONOMOUS MOBILITY
              </h2>
              {/* Dynamic Animated Underline */}
              <div style={{ marginTop: 6 }}>
                <AnimatedLine
                  orientation="horizontal"
                  length={360}
                  stroke={Colors.accent.brand}
                  strokeWidth={4}
                  strokeLinecap="round"
                  animation="draw-in"
                  delay={12}
                  durationInFrames={24}
                />
              </div>
            </div>
            <p style={{ fontSize: 12, color: Colors.text.secondary, marginTop: 4 }}>
              High-impact editorial underline drawing directly beneath hero display headlines.
            </p>
          </div>

          {/* Preset B: Metric Card with Animated Divider */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.lg,
              border: `1px solid ${Colors.border.default}`,
              padding: Spacing.scale.xl,
              gap: Spacing.scale.md,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.emerald }}>
                ● TELEMETRY METRIC CARD
              </span>
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                VEHICLE #842
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontSize: 11, color: Colors.text.tertiary }}>RESPONSE LATENCY</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: Colors.text.primary }}>14.2 ms</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: Colors.text.tertiary }}>HEALTH INDEX</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: Colors.accent.emerald }}>99.8%</div>
              </div>
            </div>

            {/* Expanding Center Divider */}
            <AnimatedLine
              orientation="horizontal"
              length={340}
              stroke={Colors.border.strong}
              strokeWidth={1}
              strokeDasharray="6 4"
              animation="reveal-center"
              delay={8}
              durationInFrames={22}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.muted }}>
              <span>SYSTEM: LIDAR ARRAY ACTIVE</span>
              <span>SYNC: 60 FPS DETERMINISTIC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
