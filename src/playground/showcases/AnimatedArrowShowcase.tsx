/**
 * AnimatedArrow Showcase
 * Interactive development and evaluation harness for the AnimatedArrow component.
 * Demonstrates straight, diagonal, and curved arrows, single and double arrowheads,
 * multiple arrowhead styles (triangle, chevron, stealth, barb, circle), and sequenced reveal kinetics.
 * Layer 1 / Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame } from 'remotion';
import { Sliders } from 'lucide-react';
import { AnimatedArrow } from '../../components/graphics/AnimatedArrow.tsx';
import type {
  ArrowDirection,
  ArrowheadStyle,
  ArrowheadPlacement,
  ArrowheadTiming,
  ArrowAnimation,
} from '../../components/graphics/types.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

const ALL_DIRECTIONS: Array<{ id: ArrowDirection; label: string }> = [
  { id: 'right', label: 'Right (→)' },
  { id: 'left', label: 'Left (←)' },
  { id: 'up', label: 'Up (↑)' },
  { id: 'down', label: 'Down (↓)' },
  { id: 'diagonal-up-right', label: 'Up-Right (↗)' },
  { id: 'diagonal-down-right', label: 'Down-Right (↘)' },
];

const ALL_HEAD_STYLES: Array<{ id: ArrowheadStyle; label: string }> = [
  { id: 'triangle', label: 'Triangle (Solid)' },
  { id: 'chevron', label: 'Chevron (Open V)' },
  { id: 'stealth', label: 'Stealth (Notched)' },
  { id: 'barb', label: 'Barb (Curved)' },
  { id: 'circle', label: 'Circle (Terminal Dot)' },
];

const ALL_PLACEMENTS: Array<{ id: ArrowheadPlacement; label: string }> = [
  { id: 'end', label: 'End Tip' },
  { id: 'start', label: 'Start Tip' },
  { id: 'both', label: 'Both (Double-Headed)' },
];

const ALL_ANIMATIONS: Array<{ id: ArrowAnimation; label: string }> = [
  { id: 'draw-in', label: 'Draw In' },
  { id: 'draw-out', label: 'Draw Out' },
  { id: 'arrowhead-reveal', label: 'Head Reveal' },
  { id: 'move-in', label: 'Move In (Slide)' },
  { id: 'scale-in', label: 'Scale In' },
  { id: 'fade-in', label: 'Fade In' },
  { id: 'none', label: 'None (Static)' },
];

export const AnimatedArrowShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();

  // Sandbox interactive controls state
  const [selectedDirection, setSelectedDirection] = useState<ArrowDirection>('right');
  const [selectedHeadStyle, setSelectedHeadStyle] = useState<ArrowheadStyle>('triangle');
  const [selectedPlacement, setSelectedPlacement] = useState<ArrowheadPlacement>('end');
  const [selectedTiming, setSelectedTiming] = useState<ArrowheadTiming>('with-line');
  const [selectedAnimation, setSelectedAnimation] = useState<ArrowAnimation>('draw-in');
  const [arrowLength, setArrowLength] = useState<number>(220);
  const [curvature, setCurvature] = useState<number>(0);
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [arrowheadSize, setArrowheadSize] = useState<number>(14);
  const [strokeColor, setStrokeColor] = useState<string>(Colors.accent.brand);
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
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>● VECTOR ARROW ENGINE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Frame:</span>
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>{currentFrame}</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Delay:</span>
          <span style={{ color: Colors.accent.amber, fontWeight: 700 }}>{delay}f</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Direction:</span>
          <span style={{ color: Colors.accent.brandLight, fontWeight: 700 }}>{selectedDirection}</span>
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
            Head: {selectedHeadStyle} ({selectedTiming})
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
            L={arrowLength}px · Curve={curvature.toFixed(2)} · S={strokeWidth}px
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
              ARROW GEOMETRY & MOTION CONTROLS
            </span>
          </div>

          {/* Direction Preset */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              DIRECTION PRESET
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {ALL_DIRECTIONS.map((dir) => (
                <button
                  key={dir.id}
                  type="button"
                  onClick={() => setSelectedDirection(dir.id)}
                  style={{
                    padding: '4px 6px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedDirection === dir.id ? Colors.accent.brand : Colors.dark.surface3,
                    border: `1px solid ${selectedDirection === dir.id ? Colors.accent.brandLight : Colors.border.default}`,
                    color: Colors.text.primary,
                    fontSize: 11,
                    fontWeight: selectedDirection === dir.id ? 700 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {dir.label}
                </button>
              ))}
            </div>
          </div>

          {/* Arrowhead Style */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              ARROWHEAD STYLE
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              {ALL_HEAD_STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedHeadStyle(st.id)}
                  style={{
                    padding: '4px 6px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedHeadStyle === st.id ? Colors.accent.electricViolet : Colors.dark.surface3,
                    border: `1px solid ${selectedHeadStyle === st.id ? Colors.accent.electricViolet : Colors.border.default}`,
                    color: '#FFF',
                    fontSize: 10,
                    fontWeight: selectedHeadStyle === st.id ? 700 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Placement & Timing */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                PLACEMENT
              </label>
              <div style={{ display: 'flex', gap: 2 }}>
                {ALL_PLACEMENTS.map((pl) => (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() => setSelectedPlacement(pl.id)}
                    style={{
                      flex: 1,
                      padding: '4px 2px',
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: selectedPlacement === pl.id ? Colors.accent.emerald : Colors.dark.surface3,
                      border: `1px solid ${selectedPlacement === pl.id ? Colors.accent.emerald : Colors.border.default}`,
                      color: selectedPlacement === pl.id ? '#FFF' : Colors.text.secondary,
                      fontSize: 9,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {pl.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                HEAD TIMING
              </label>
              <div style={{ display: 'flex', gap: 2 }}>
                {(['with-line', 'after-line'] as ArrowheadTiming[]).map((tm) => (
                  <button
                    key={tm}
                    type="button"
                    onClick={() => setSelectedTiming(tm)}
                    style={{
                      flex: 1,
                      padding: '4px 2px',
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: selectedTiming === tm ? Colors.accent.cyan : Colors.dark.surface3,
                      border: `1px solid ${selectedTiming === tm ? Colors.accent.cyan : Colors.border.default}`,
                      color: selectedTiming === tm ? '#000' : Colors.text.secondary,
                      fontSize: 9,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    {tm}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Curvature & Length */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                CURVATURE ({curvature.toFixed(2)})
              </label>
              <input
                type="range"
                min={-100}
                max={100}
                value={Math.round(curvature * 100)}
                onChange={(e) => setCurvature(Number(e.target.value) / 100)}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                LENGTH ({arrowLength}px)
              </label>
              <input
                type="range"
                min={60}
                max={320}
                value={arrowLength}
                onChange={(e) => setArrowLength(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Stroke Width & Arrowhead Size */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                STROKE WIDTH ({strokeWidth}px)
              </label>
              <input
                type="range"
                min={1}
                max={12}
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                HEAD SIZE ({arrowheadSize}px)
              </label>
              <input
                type="range"
                min={8}
                max={30}
                value={arrowheadSize}
                onChange={(e) => setArrowheadSize(Number(e.target.value))}
                style={{ width: '100%' }}
              />
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
                    backgroundColor: selectedAnimation === anim.id ? Colors.accent.amber : Colors.dark.surface3,
                    border: `1px solid ${selectedAnimation === anim.id ? Colors.accent.amber : Colors.border.default}`,
                    color: selectedAnimation === anim.id ? '#000' : Colors.text.secondary,
                    fontSize: 10,
                    fontWeight: selectedAnimation === anim.id ? 700 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {anim.label}
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

          <AnimatedArrow
            direction={selectedDirection}
            length={arrowLength}
            curvature={curvature}
            arrowheadStyle={selectedHeadStyle}
            arrowheadPlacement={selectedPlacement}
            headTiming={selectedTiming}
            arrowheadSize={arrowheadSize}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            delay={delay}
            durationInFrames={duration}
            animation={selectedAnimation}
          />

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
            <span>DIRECTION: {selectedDirection.toUpperCase()}</span>
            <span>·</span>
            <span>HEAD: {selectedHeadStyle.toUpperCase()} ({selectedPlacement.toUpperCase()})</span>
            <span>·</span>
            <span>CURVATURE: {curvature.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: Arrowhead Styles & Placements Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
          SECTION 3: ARROWHEAD STYLES & PLACEMENTS
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: Spacing.scale.md,
          }}
        >
          {/* Style 1: Solid Triangle */}
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
              1. Classic Solid Triangle
            </div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedArrow
                direction="right"
                length={160}
                arrowheadStyle="triangle"
                arrowheadSize={14}
                stroke={Colors.accent.brand}
                strokeWidth={3}
                animation="draw-in"
                delay={0}
                durationInFrames={24}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              style="triangle"
            </span>
          </div>

          {/* Style 2: Chevron Open V */}
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
              2. Open Chevron (V-Bar)
            </div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedArrow
                direction="right"
                length={160}
                arrowheadStyle="chevron"
                arrowheadSize={14}
                stroke={Colors.accent.cyan}
                strokeWidth={3}
                animation="draw-in"
                delay={4}
                durationInFrames={24}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              style="chevron"
            </span>
          </div>

          {/* Style 3: Stealth Notched */}
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
              3. Stealth (Tactical Notch)
            </div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedArrow
                direction="right"
                length={160}
                arrowheadStyle="stealth"
                arrowheadSize={16}
                stroke={Colors.accent.emerald}
                strokeWidth={3}
                animation="draw-in"
                delay={8}
                durationInFrames={24}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              style="stealth"
            </span>
          </div>

          {/* Style 4: Curved Barb */}
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
              4. Curved Barb Wings
            </div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedArrow
                direction="right"
                length={160}
                arrowheadStyle="barb"
                arrowheadSize={16}
                stroke={Colors.accent.amber}
                strokeWidth={3}
                animation="draw-in"
                delay={12}
                durationInFrames={24}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              style="barb"
            </span>
          </div>

          {/* Style 5: Circle Terminal Node */}
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
              5. Terminal Circle Node
            </div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedArrow
                direction="right"
                length={160}
                arrowheadStyle="circle"
                arrowheadSize={14}
                stroke={Colors.accent.electricViolet}
                strokeWidth={3}
                animation="draw-in"
                delay={16}
                durationInFrames={24}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              style="circle"
            </span>
          </div>

          {/* Style 6: Double-Headed Arrow */}
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
            <div style={{ fontSize: 12, fontWeight: 700, color: Colors.text.primary }}>
              6. Double-Headed (Bidirectional)
            </div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedArrow
                direction="right"
                length={160}
                arrowheadStyle="triangle"
                arrowheadPlacement="both"
                arrowheadSize={13}
                stroke={Colors.text.primary}
                strokeWidth={3}
                animation="draw-in"
                delay={20}
                durationInFrames={24}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              arrowheadPlacement="both"
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: Straight & Curved Arrows Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald }}>
          SECTION 4: STRAIGHT & CURVED BEZIER ARROWS
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: Spacing.scale.md,
          }}
        >
          {/* Curve 1: Straight Horizontal */}
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
            <div style={{ fontSize: 12, fontWeight: 700 }}>Straight Linear (0°)</div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedArrow
                direction="right"
                length={180}
                curvature={0}
                stroke={Colors.accent.brand}
                strokeWidth={3}
                animation="draw-in"
                durationInFrames={25}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              curvature = 0
            </span>
          </div>

          {/* Curve 2: Gentle Upward Arc */}
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
            <div style={{ fontSize: 12, fontWeight: 700 }}>Gentle Arc (-0.35)</div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedArrow
                direction="right"
                length={180}
                curvature={-0.35}
                stroke={Colors.accent.cyan}
                strokeWidth={3}
                animation="draw-in"
                delay={5}
                durationInFrames={25}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              curvature = -0.35
            </span>
          </div>

          {/* Curve 3: Deep Downward Sweep */}
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
            <div style={{ fontSize: 12, fontWeight: 700 }}>Deep Downward Arc (+0.60)</div>
            <div style={{ padding: '20px 0' }}>
              <AnimatedArrow
                direction="right"
                length={180}
                curvature={0.6}
                stroke={Colors.accent.emerald}
                strokeWidth={3}
                animation="draw-in"
                delay={10}
                durationInFrames={25}
              />
            </div>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              curvature = +0.60
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 5: Real-World Commercial UI Compositions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.electricViolet }}>
          SECTION 5: REAL-WORLD MOTION COMPOSITIONS
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.scale.lg }}>
          {/* Composition 1: Route Navigation Waypoint */}
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
              <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan }}>
                ● AUTONOMOUS ROUTE TRAJECTORY
              </span>
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                DROP-OFF: 250M
              </span>
            </div>

            {/* Curved Path Vector Arrow */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
              <AnimatedArrow
                x1={20}
                y1={60}
                x2={280}
                y2={20}
                curvature={-0.45}
                arrowheadStyle="stealth"
                arrowheadSize={16}
                stroke={Colors.accent.cyan}
                strokeWidth={4}
                headTiming="after-line"
                animation="draw-in"
                delay={5}
                durationInFrames={26}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.muted, borderTop: `1px solid ${Colors.border.subtle}`, paddingTop: Spacing.scale.sm }}>
              <span>BEARING: 034° NORTH-EAST</span>
              <span>LIDAR WAYPOINT LOCK</span>
            </div>
          </div>

          {/* Composition 2: Financial Momentum Metric Card */}
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
                ● PLATFORM PERFORMANCE
              </span>
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                Q3 AGGREGATE
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, color: Colors.text.tertiary }}>MOMENTUM RATE</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: Colors.accent.emerald }}>
                  +24.8%
                </div>
              </div>

              {/* Diagonal Upward Arrow */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <AnimatedArrow
                  direction="diagonal-up-right"
                  length={70}
                  arrowheadStyle="triangle"
                  arrowheadSize={14}
                  stroke={Colors.accent.emerald}
                  strokeWidth={4}
                  animation="draw-in"
                  delay={10}
                  durationInFrames={22}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.muted, borderTop: `1px solid ${Colors.border.subtle}`, paddingTop: Spacing.scale.sm }}>
              <span>EFFICIENCY GAIN: +12.4%</span>
              <span>SETTLE: 60 FPS DETERMINISTIC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
