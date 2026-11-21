/**
 * AnimatedShape Showcase
 * Interactive development and evaluation harness for the AnimatedShape component.
 * Demonstrates 6 geometric shape types, 8 animation modes, SVG stroke drawing reveals,
 * fill/stroke variations, and a choreographed technical radar beacon composition.
 * Layer 1 / Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame } from 'remotion';
import { Sliders } from 'lucide-react';
import { AnimatedShape } from '../../components/graphics/AnimatedShape.tsx';
import type {
  ShapeType,
  ShapeAnimation,
  ShapeAnimationDirection,
} from '../../components/graphics/types.ts';
import type { SpringPresetName } from '../../styles/motion.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

const ALL_SHAPES: Array<{ id: ShapeType; label: string }> = [
  { id: 'rectangle', label: 'Rectangle' },
  { id: 'rounded-rectangle', label: 'Rounded Rect' },
  { id: 'circle', label: 'Circle / Ellipse' },
  { id: 'polygon', label: 'Polygon (Hexagon)' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'star', label: 'Star (5-Point)' },
];

const ALL_ANIMATIONS: Array<{ id: ShapeAnimation; label: string }> = [
  { id: 'combined', label: 'Combined (Draw + Pop + Fade)' },
  { id: 'draw', label: 'Draw (SVG Stroke Reveal)' },
  { id: 'pop', label: 'Pop (Spring Overshoot)' },
  { id: 'scale-in', label: 'Scale In' },
  { id: 'fade-in', label: 'Fade In' },
  { id: 'rotate', label: 'Rotate (360° Continuous)' },
  { id: 'move', label: 'Move (Directional)' },
  { id: 'bounce', label: 'Bounce Physics' },
  { id: 'none', label: 'None (Static)' },
];

const ALL_SPRINGS: Array<{ id: SpringPresetName; label: string }> = [
  { id: 'snappy', label: 'Snappy' },
  { id: 'bouncy', label: 'Bouncy' },
  { id: 'smooth', label: 'Smooth' },
  { id: 'gentle', label: 'Gentle' },
  { id: 'stiff', label: 'Stiff' },
];

export const AnimatedShapeShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();

  // Sandbox interactive controls state
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rounded-rectangle');
  const [selectedAnimation, setSelectedAnimation] = useState<ShapeAnimation>('combined');
  const [shapeWidth, setShapeWidth] = useState<number>(140);
  const [shapeHeight, setShapeHeight] = useState<number>(140);
  const [borderRadius, setBorderRadius] = useState<number>(16);
  const [fillColor, setFillColor] = useState<string>('rgba(39, 110, 241, 0.2)');
  const [strokeColor, setStrokeColor] = useState<string>(Colors.accent.brand);
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [baseRotation, setBaseRotation] = useState<number>(0);
  const [delay, setDelay] = useState<number>(10);
  const [duration, setDuration] = useState<number>(24);
  const [selectedSpring, setSelectedSpring] = useState<SpringPresetName>('snappy');
  const [moveDirection, setMoveDirection] = useState<ShapeAnimationDirection>('up');

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
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>● GRAPHICS ENGINE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Frame:</span>
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>{currentFrame}</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Trigger Delay:</span>
          <span style={{ color: Colors.accent.amber, fontWeight: 700 }}>{delay}f</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Shape:</span>
          <span style={{ color: Colors.accent.brandLight, fontWeight: 700 }}>{selectedShape}</span>
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
            Animation: {selectedAnimation}
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
            {shapeWidth}×{shapeHeight}px
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
            <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
              SHAPE & ANIMATION CONTROLS
            </span>
          </div>

          {/* Shape Type Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              GEOMETRIC SHAPE
            </label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {ALL_SHAPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedShape(s.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedShape === s.id ? Colors.accent.brand : Colors.dark.surface3,
                    border: `1px solid ${selectedShape === s.id ? Colors.accent.brand : Colors.border.default}`,
                    color: selectedShape === s.id ? '#FFF' : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: selectedShape === s.id ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {s.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Animation Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              ANIMATION PRESET
            </label>
            <select
              value={selectedAnimation}
              onChange={(e) => setSelectedAnimation(e.target.value as ShapeAnimation)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.text.primary,
                fontSize: 12,
              }}
            >
              {ALL_ANIMATIONS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {/* Width & Height */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                WIDTH (PX)
              </label>
              <input
                type="number"
                min={40}
                max={300}
                value={shapeWidth}
                onChange={(e) => setShapeWidth(Number(e.target.value) || 100)}
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
                HEIGHT (PX)
              </label>
              <input
                type="number"
                min={40}
                max={300}
                value={shapeHeight}
                onChange={(e) => setShapeHeight(Number(e.target.value) || 100)}
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

          {/* Rotation & Move Direction */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                ROTATION ({baseRotation}°)
              </label>
              <input
                type="range"
                min={0}
                max={360}
                value={baseRotation}
                onChange={(e) => setBaseRotation(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                DIRECTION
              </label>
              <div style={{ display: 'flex', gap: 2 }}>
                {(['up', 'down', 'left', 'right'] as ShapeAnimationDirection[]).map((dir) => (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => setMoveDirection(dir)}
                    style={{
                      flex: 1,
                      padding: '3px 4px',
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: moveDirection === dir ? Colors.accent.cyan : Colors.dark.surface3,
                      border: `1px solid ${moveDirection === dir ? Colors.accent.cyan : Colors.border.default}`,
                      color: moveDirection === dir ? '#000' : Colors.text.secondary,
                      fontSize: 10,
                      cursor: 'pointer',
                    }}
                  >
                    {dir}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stroke Width & Radius */}
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
                RADIUS ({borderRadius}px)
              </label>
              <input
                type="range"
                min={0}
                max={50}
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Spring Preset */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SPRING PRESET (FOR POP/BOUNCE)
            </label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {ALL_SPRINGS.map((sp) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setSelectedSpring(sp.id)}
                  style={{
                    padding: '3px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedSpring === sp.id ? Colors.accent.electricViolet : Colors.dark.surface3,
                    border: `1px solid ${selectedSpring === sp.id ? Colors.accent.electricViolet : Colors.border.default}`,
                    color: selectedSpring === sp.id ? '#FFF' : Colors.text.secondary,
                    fontSize: 10,
                    cursor: 'pointer',
                  }}
                >
                  {sp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stroke & Fill Color Presets */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                STROKE COLOR
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {['#276EF1', '#0E8345', '#00D1FF', '#FFC043', '#FFFFFF'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setStrokeColor(c)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      backgroundColor: c,
                      border: `2px solid ${strokeColor === c ? Colors.white : 'transparent'}`,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                FILL PRESET
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {[
                  'rgba(39, 110, 241, 0.2)',
                  'rgba(14, 131, 69, 0.2)',
                  'rgba(0, 209, 255, 0.2)',
                  'transparent',
                ].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFillColor(f)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      backgroundColor: f === 'transparent' ? Colors.dark.surface3 : f,
                      border: `2px solid ${fillColor === f ? Colors.white : 'transparent'}`,
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
            STAGE VIEWPORT (CANVAS COORDINATES)
          </div>

          <AnimatedShape
            shape={selectedShape}
            width={shapeWidth}
            height={shapeHeight}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            borderRadius={borderRadius}
            rotation={baseRotation}
            delay={delay}
            durationInFrames={duration}
            animation={selectedAnimation}
            springPreset={selectedSpring}
            direction={moveDirection}
          />

          <div
            style={{
              position: 'absolute',
              bottom: Spacing.scale.md,
              fontFamily: Typography.fontFamily.mono,
              fontSize: 11,
              color: Colors.text.muted,
            }}
          >
            Animation: {selectedAnimation} · Frame: {currentFrame}
          </div>
        </div>
      </div>

      {/* SECTION 3: Supported Shapes Gallery */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            Geometric Shape Primitives
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            All primary 2D geometric shapes rendered purely through SVG paths and primitives.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {ALL_SHAPES.map((s, idx) => (
            <div
              key={s.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: Spacing.scale.md,
                backgroundColor: Colors.dark.surface1,
                borderRadius: Spacing.radius.md,
                border: `1px solid ${Colors.border.default}`,
                minHeight: 180,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: Colors.accent.cyan }}>
                  {s.label}
                </span>
                <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.muted }}>
                  shape="{s.id}"
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
                <AnimatedShape
                  shape={s.id}
                  width={90}
                  height={90}
                  fill="rgba(0, 209, 255, 0.12)"
                  stroke={Colors.accent.cyan}
                  strokeWidth={2.5}
                  borderRadius={12}
                  delay={idx * 6}
                  durationInFrames={18}
                  animation="combined"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Animation Styles Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            Animation Styles & Kinematics
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Progressive SVG stroke-dash draws, spring pop overshoots, continuous rotations, and directional movement slides.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {[
            { anim: 'draw' as const, title: 'Draw Reveal', desc: 'Progressive outline stroke-dash path animation', shape: 'rounded-rectangle' as ShapeType, color: Colors.accent.emerald },
            { anim: 'pop' as const, title: 'Spring Pop', desc: 'Elastic overshoot scale pop with bounce settle', shape: 'circle' as ShapeType, color: Colors.accent.brand },
            { anim: 'rotate' as const, title: 'Continuous Rotation', desc: '360° technical angular rotation loop', shape: 'polygon' as ShapeType, color: Colors.accent.amber },
            { anim: 'move' as const, title: 'Directional Move', desc: 'Smooth translate slide with decelerate ease', shape: 'triangle' as ShapeType, color: Colors.accent.electricViolet },
            { anim: 'scale-in' as const, title: 'Scale In', desc: 'Cubic scale expansion from zero to unit', shape: 'rectangle' as ShapeType, color: Colors.accent.cyan },
            { anim: 'combined' as const, title: 'Combined Master', desc: 'Simultaneous stroke draw and spring pop', shape: 'star' as ShapeType, color: Colors.white },
          ].map((item, idx) => (
            <div
              key={item.anim}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: Spacing.scale.md,
                backgroundColor: Colors.dark.surface1,
                borderRadius: Spacing.radius.md,
                border: `1px solid ${Colors.border.default}`,
                minHeight: 180,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>
                  {item.title}
                </span>
                <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.muted }}>
                  animation="{item.anim}"
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
                <AnimatedShape
                  shape={item.shape}
                  width={80}
                  height={80}
                  fill={item.anim === 'draw' ? 'transparent' : `${item.color}22`}
                  stroke={item.color}
                  strokeWidth={2.5}
                  delay={idx * 6}
                  durationInFrames={20}
                  animation={item.anim}
                />
              </div>

              <span style={{ fontSize: 11, color: Colors.text.secondary }}>
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Choreographed Geometric Infographic (Radar Beacon) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            Choreographed Geometric Composition (Autonomous Vehicle Radar Reticle)
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Real-world autonomous vehicle navigation reticle composing concentric rotating polygons, pulsing sonar rings, and directional beacon needles.
          </p>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 360,
            backgroundColor: Colors.black,
            borderRadius: Spacing.radius.lg,
            border: `1px solid ${Colors.border.default}`,
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Grid */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle, ${Colors.border.subtle} 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
              opacity: 0.4,
            }}
          />

          {/* Layer 1: Outer Rotating Hexagon Reticle */}
          <div style={{ position: 'absolute' }}>
            <AnimatedShape
              shape="polygon"
              sides={6}
              width={260}
              height={260}
              fill="transparent"
              stroke={Colors.accent.brand}
              strokeWidth={1.5}
              strokeDasharray="8 6"
              delay={0}
              durationInFrames={120}
              animation={{ type: 'rotate', direction: 'clockwise', to: 360, loop: true }}
            />
          </div>

          {/* Layer 2: Middle Concentric Circle with Draw Reveal */}
          <div style={{ position: 'absolute' }}>
            <AnimatedShape
              shape="circle"
              width={180}
              height={180}
              fill="rgba(0, 209, 255, 0.05)"
              stroke={Colors.accent.cyan}
              strokeWidth={2}
              delay={10}
              durationInFrames={28}
              animation="draw"
            />
          </div>

          {/* Layer 3: Inner Pulsing Rounded Rect */}
          <div style={{ position: 'absolute' }}>
            <AnimatedShape
              shape="rounded-rectangle"
              width={110}
              height={110}
              borderRadius={20}
              fill="rgba(14, 131, 69, 0.15)"
              stroke={Colors.accent.emerald}
              strokeWidth={2}
              delay={18}
              durationInFrames={20}
              animation="pop"
              springPreset="bouncy"
            />
          </div>

          {/* Layer 4: Directional Rotating Triangle Pointer */}
          <div style={{ position: 'absolute' }}>
            <AnimatedShape
              shape="triangle"
              width={40}
              height={40}
              fill={Colors.accent.amber}
              stroke={Colors.white}
              strokeWidth={1.5}
              delay={25}
              durationInFrames={40}
              animation={{ type: 'rotate', direction: 'clockwise', to: 720 }}
            />
          </div>

          {/* Layer 5: Center Flashing Beacon Star */}
          <div style={{ position: 'absolute' }}>
            <AnimatedShape
              shape="star"
              starPoints={5}
              width={24}
              height={24}
              fill={Colors.white}
              stroke={Colors.accent.cyan}
              strokeWidth={1}
              delay={32}
              durationInFrames={15}
              animation="bounce"
            />
          </div>

          {/* Overlay Diagnostics Label */}
          <div
            style={{
              position: 'absolute',
              bottom: Spacing.scale.md,
              left: Spacing.scale.md,
              fontFamily: Typography.fontFamily.mono,
              fontSize: 11,
              color: Colors.accent.cyan,
            }}
          >
            LIDAR SCANNER · ACTIVE TRACKING RETICLE
          </div>
        </div>
      </div>
    </div>
  );
};
