/**
 * AnimatedPath Showcase
 * Interactive development and evaluation harness for the AnimatedPath component.
 * Demonstrates custom vector paths, curved Bezier trajectories, closed shapes,
 * forward and reverse stroke drawing, fill reveal sequencing, and motion-along-path kinetics.
 * Layer 1 / Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame } from 'remotion';
import { Sliders, Compass, TrendingUp, ShieldCheck } from 'lucide-react';
import { AnimatedPath } from '../../components/graphics/AnimatedPath.tsx';
import type {
  PathAnimation,
  PathFillRevealTiming,
} from '../../components/graphics/types.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

interface PathPreset {
  id: string;
  label: string;
  d: string;
  defaultFill?: string;
}

const PRESET_PATHS: PathPreset[] = [
  {
    id: 's-curve',
    label: 'Bézier S-Curve Route',
    d: 'M 20 120 C 80 20, 160 20, 220 120 S 360 220, 420 120',
  },
  {
    id: 'sine-wave',
    label: 'Sine Wave Harmonic',
    d: 'M 20 90 Q 70 20 120 90 T 220 90 T 320 90 T 420 90',
  },
  {
    id: 'heart-shape',
    label: 'Closed Heart Symbol',
    d: 'M 140 60 C 140 30 110 10 80 10 C 40 10 10 50 10 90 C 10 150 140 230 140 230 C 140 230 270 150 270 90 C 270 50 240 10 200 10 C 170 10 140 30 140 60 Z',
    defaultFill: 'rgba(235, 87, 87, 0.2)',
  },
  {
    id: 'star-poly',
    label: 'Closed Star Polygon',
    d: 'M 100 10 L 124 64 L 182 69 L 138 107 L 151 165 L 100 135 L 49 165 L 62 107 L 18 69 L 76 64 Z',
    defaultFill: 'rgba(245, 166, 35, 0.25)',
  },
  {
    id: 'shield-badge',
    label: 'Security Shield Badge',
    d: 'M 100 15 L 180 45 C 180 110, 140 160, 100 185 C 60 160, 20 110, 20 45 Z',
    defaultFill: 'rgba(5, 150, 105, 0.2)',
  },
  {
    id: 'infinity-loop',
    label: 'Infinity Circuit',
    d: 'M 150 80 C 100 20 20 20 20 80 C 20 140 100 140 150 80 C 200 20 280 20 280 80 C 280 140 200 140 150 80 Z',
  },
];

const ALL_ANIMATIONS: Array<{ id: PathAnimation; label: string }> = [
  { id: 'draw-in', label: 'Draw In' },
  { id: 'reverse-draw', label: 'Reverse Draw' },
  { id: 'draw-out', label: 'Draw Out' },
  { id: 'progressive-reveal', label: 'Progressive' },
  { id: 'fill-reveal', label: 'Fill Reveal' },
  { id: 'motion-along-path', label: 'Motion Along Path' },
  { id: 'none', label: 'None (Static)' },
];

export const AnimatedPathShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();

  // Sandbox interactive controls state
  const [selectedPreset, setSelectedPreset] = useState<PathPreset>(PRESET_PATHS[0]);
  const [selectedAnimation, setSelectedAnimation] = useState<PathAnimation>('draw-in');
  const [fillMode, setFillMode] = useState<'none' | 'tint' | 'accent'>('none');
  const [fillTiming, setFillTiming] = useState<PathFillRevealTiming>('after-draw');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [strokeColor, setStrokeColor] = useState<string>(Colors.accent.cyan);
  const [showFollower, setShowFollower] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [delay, setDelay] = useState<number>(5);
  const [duration, setDuration] = useState<number>(30);

  const activeFill =
    fillMode === 'none'
      ? 'none'
      : fillMode === 'tint'
      ? 'rgba(39, 110, 241, 0.2)'
      : selectedPreset.defaultFill ?? 'rgba(5, 150, 105, 0.25)';

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
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>● VECTOR PATH ENGINE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>
            ACTIVE PRESET: <strong style={{ color: Colors.accent.cyan }}>{selectedPreset.label}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.md }}>
          <span>
            ANIMATION: <strong style={{ color: Colors.accent.amber }}>{selectedAnimation}</strong>
          </span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span>
            FRAME: <strong style={{ color: Colors.accent.emerald }}>{currentFrame}</strong>
          </span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span>
            FOLLOWER: <strong style={{ color: showFollower ? Colors.accent.emerald : Colors.text.tertiary }}>{showFollower ? 'ACTIVE' : 'OFF'}</strong>
          </span>
        </div>
      </div>

      {/* SECTION 2: Interactive Parameter Sandbox */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: Spacing.scale.lg,
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.lg,
          padding: Spacing.scale.lg,
        }}
      >
        {/* Live Canvas Viewport */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 380,
            backgroundColor: '#0a0d14',
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.subtle}`,
            overflow: 'hidden',
            padding: Spacing.scale.xl,
          }}
        >
          {/* Subtle Grid Matrix Background */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              pointerEvents: 'none',
            }}
          />

          <AnimatedPath
            d={selectedPreset.d}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={activeFill}
            fillRevealTiming={fillTiming}
            fillDelay={delay + duration}
            fillDurationInFrames={15}
            animation={selectedAnimation}
            delay={delay}
            durationInFrames={duration}
            showFollower={showFollower}
            autoRotateFollower={autoRotate}
            followerSize={7}
            followerColor={strokeColor}
          />

          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: 16,
              right: 16,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: Typography.fontFamily.mono,
              fontSize: 11,
              color: Colors.text.tertiary,
            }}
          >
            <span>TIMING: Delay {delay}f → Duration {duration}f</span>
            <span>FILL TIMING: {fillTiming.toUpperCase()}</span>
          </div>
        </div>

        {/* Configuration Controls Sidebar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: Spacing.scale.md,
            backgroundColor: Colors.dark.surface2,
            padding: Spacing.scale.md,
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.subtle}`,
            fontSize: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, fontWeight: 700, color: Colors.text.primary }}>
            <Sliders size={14} color={Colors.accent.cyan} />
            <span>PATH PARAMETER SANDBOX</span>
          </div>

          {/* Path Preset Selector */}
          <div>
            <label style={{ display: 'block', marginBottom: 4, color: Colors.text.secondary }}>
              Vector Geometry Preset:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
              {PRESET_PATHS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPreset(preset)}
                  style={{
                    padding: '5px 8px',
                    fontSize: 10,
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedPreset.id === preset.id ? Colors.accent.cyan : Colors.dark.surface3,
                    border: `1px solid ${selectedPreset.id === preset.id ? Colors.accent.cyan : Colors.border.default}`,
                    color: selectedPreset.id === preset.id ? '#000000' : Colors.text.secondary,
                    fontWeight: selectedPreset.id === preset.id ? 700 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Animation Variant Selector */}
          <div>
            <label style={{ display: 'block', marginBottom: 4, color: Colors.text.secondary }}>
              Animation Variant:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
              {ALL_ANIMATIONS.map((anim) => (
                <button
                  key={anim.id}
                  type="button"
                  onClick={() => setSelectedAnimation(anim.id)}
                  style={{
                    padding: '5px 8px',
                    fontSize: 10,
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedAnimation === anim.id ? Colors.accent.brand : Colors.dark.surface3,
                    border: `1px solid ${selectedAnimation === anim.id ? Colors.accent.brand : Colors.border.default}`,
                    color: selectedAnimation === anim.id ? '#ffffff' : Colors.text.secondary,
                    fontWeight: selectedAnimation === anim.id ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {anim.label}
                </button>
              ))}
            </div>
          </div>

          {/* Fill Mode & Fill Reveal Timing */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.scale.sm }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4, color: Colors.text.secondary }}>
                Fill Surface:
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['none', 'tint', 'accent'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFillMode(m)}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      fontSize: 10,
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: fillMode === m ? Colors.accent.emerald : Colors.dark.surface3,
                      border: `1px solid ${fillMode === m ? Colors.accent.emerald : Colors.border.default}`,
                      color: fillMode === m ? '#000000' : Colors.text.secondary,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 4, color: Colors.text.secondary }}>
                Fill Timing:
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['after-draw', 'with-draw'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFillTiming(t)}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      fontSize: 10,
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: fillTiming === t ? Colors.accent.amber : Colors.dark.surface3,
                      border: `1px solid ${fillTiming === t ? Colors.accent.amber : Colors.border.default}`,
                      color: fillTiming === t ? '#000000' : Colors.text.secondary,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {t === 'after-draw' ? 'After' : 'With'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stroke Width Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: Colors.text.secondary, marginBottom: 4 }}>
              <span>Stroke Width:</span>
              <span style={{ color: Colors.accent.cyan, fontFamily: Typography.fontFamily.mono }}>{strokeWidth}px</span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              step={1}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              style={{ width: '100%', accentColor: Colors.accent.cyan }}
            />
          </div>

          {/* Delay & Duration Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.scale.sm }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: Colors.text.secondary, marginBottom: 2 }}>
                <span>Delay:</span>
                <span style={{ color: Colors.accent.cyan, fontFamily: Typography.fontFamily.mono }}>{delay}f</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                step={1}
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                style={{ width: '100%', accentColor: Colors.accent.cyan }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: Colors.text.secondary, marginBottom: 2 }}>
                <span>Duration:</span>
                <span style={{ color: Colors.accent.cyan, fontFamily: Typography.fontFamily.mono }}>{duration}f</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                style={{ width: '100%', accentColor: Colors.accent.cyan }}
              />
            </div>
          </div>

          {/* Stroke Palette */}
          <div>
            <label style={{ display: 'block', marginBottom: 4, color: Colors.text.secondary }}>
              Stroke Color Accent:
            </label>
            <div style={{ display: 'flex', gap: Spacing.scale.xs }}>
              {[
                Colors.accent.cyan,
                Colors.accent.brand,
                Colors.accent.emerald,
                Colors.accent.amber,
                Colors.accent.crimson,
                '#ffffff',
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setStrokeColor(color)}
                  style={{
                    flex: 1,
                    height: 22,
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: color,
                    border: strokeColor === color ? '2px solid #ffffff' : '1px solid transparent',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>


          {/* Follower Controls */}
          <div style={{ display: 'flex', gap: Spacing.scale.md, alignItems: 'center', paddingTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={showFollower}
                onChange={(e) => setShowFollower(e.target.checked)}
                style={{ accentColor: Colors.accent.emerald }}
              />
              <span>Show Follower</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={autoRotate}
                disabled={!showFollower}
                onChange={(e) => setAutoRotate(e.target.checked)}
                style={{ accentColor: Colors.accent.emerald }}
              />
              <span>Auto-Rotate Tangent</span>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 3: Animation Capabilities Matrix */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
          ANIMATION VARIANT SUITE (FRAME-ACCURATE KINETICS)
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: Spacing.scale.md,
          }}
        >
          {/* Card 1: Draw In */}
          <div
            style={{
              padding: Spacing.scale.md,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: Spacing.scale.sm,
              minHeight: 180,
            }}
          >
            <AnimatedPath
              d="M 20 80 Q 90 10 160 80 T 300 80"
              stroke={Colors.accent.brand}
              strokeWidth={3}
              animation="draw-in"
              delay={0}
              durationInFrames={25}
              showFollower={true}
              followerSize={5}
            />
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: 12, color: Colors.text.primary, display: 'block' }}>Path Draw In</strong>
              <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                Forward stroke dashoffset (100% → 0%)
              </span>
            </div>
          </div>

          {/* Card 2: Reverse Draw */}
          <div
            style={{
              padding: Spacing.scale.md,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: Spacing.scale.sm,
              minHeight: 180,
            }}
          >
            <AnimatedPath
              d="M 20 80 Q 90 10 160 80 T 300 80"
              stroke={Colors.accent.amber}
              strokeWidth={3}
              animation="reverse-draw"
              delay={0}
              durationInFrames={25}
              showFollower={true}
              followerSize={5}
            />
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: 12, color: Colors.text.primary, display: 'block' }}>Reverse Draw</strong>
              <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                Backwards stroke drawing (-100% → 0%)
              </span>
            </div>
          </div>

          {/* Card 3: Fill Reveal (After-Draw) */}
          <div
            style={{
              padding: Spacing.scale.md,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: Spacing.scale.sm,
              minHeight: 180,
            }}
          >
            <AnimatedPath
              d="M 80 15 L 140 40 C 140 90, 110 130, 80 150 C 50 130, 20 90, 20 40 Z"
              stroke={Colors.accent.emerald}
              strokeWidth={2.5}
              fill="rgba(5, 150, 105, 0.3)"
              fillRevealTiming="after-draw"
              fillDurationInFrames={12}
              animation="draw-in"
              delay={0}
              durationInFrames={18}
            />
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: 12, color: Colors.text.primary, display: 'block' }}>Sequenced Fill Reveal</strong>
              <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                Stroke outline draws first, then floods fill
              </span>
            </div>
          </div>

          {/* Card 4: Motion Along Path */}
          <div
            style={{
              padding: Spacing.scale.md,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: Spacing.scale.sm,
              minHeight: 180,
            }}
          >
            <AnimatedPath
              d="M 20 80 C 70 10, 150 150, 200 80 S 330 10, 360 80"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={2}
              animation="none"
              showFollower={true}
              follower={{
                enabled: true,
                size: 7,
                color: Colors.accent.cyan,
                delay: 0,
                duration: 40,
                loop: true,
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: 12, color: Colors.text.primary, display: 'block' }}>Motion Along Path</strong>
              <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                Looping follower beacon along cubic spline
              </span>
            </div>
          </div>

          {/* Card 5: Draw Out (Retract) */}
          <div
            style={{
              padding: Spacing.scale.md,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: Spacing.scale.sm,
              minHeight: 180,
            }}
          >
            <AnimatedPath
              d="M 20 80 Q 90 10 160 80 T 300 80"
              stroke={Colors.accent.crimson}
              strokeWidth={3}
              animation="draw-out"
              delay={5}
              durationInFrames={25}
            />
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: 12, color: Colors.text.primary, display: 'block' }}>Path Draw Out</strong>
              <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                Stroke retracts progressively to disappearance
              </span>
            </div>
          </div>

          {/* Card 6: Stroke Width Expansion */}
          <div
            style={{
              padding: Spacing.scale.md,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: Spacing.scale.sm,
              minHeight: 180,
            }}
          >
            <AnimatedPath
              d="M 20 80 Q 90 10 160 80 T 300 80"
              stroke={Colors.accent.electricViolet}
              strokeWidth={6}
              animation="stroke-width"
              from={1}
              to={7}
              delay={0}
              durationInFrames={25}
            />
            <div style={{ textAlign: 'center' }}>
              <strong style={{ fontSize: 12, color: Colors.text.primary, display: 'block' }}>Stroke Width Expansion</strong>
              <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                Dynamic stroke thickness expansion (1px → 7px)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: Commercial UI Compositions */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald, marginBottom: Spacing.scale.sm }}>
          COMMERCIAL PRODUCT COMPOSITIONS
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: Spacing.scale.lg,
          }}
        >
          {/* Composition A: GPS Route Navigation */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.md,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <Compass size={16} color={Colors.accent.cyan} />
              <strong style={{ fontSize: 13, color: Colors.text.primary }}>Fleet Navigation Route</strong>
            </div>
            <div
              style={{
                position: 'relative',
                height: 150,
                backgroundColor: '#0c101a',
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <AnimatedPath
                d="M 30 110 C 90 20, 170 140, 240 50 S 330 110, 390 40"
                stroke={Colors.accent.cyan}
                strokeWidth={3}
                animation="draw-in"
                delay={0}
                durationInFrames={30}
                showFollower={true}
                follower={{
                  enabled: true,
                  size: 6,
                  color: Colors.accent.cyan,
                  stroke: '#ffffff',
                  strokeWidth: 2,
                  autoRotate: true,
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
              <span>Route ID: #SFO-8842</span>
              <span style={{ color: Colors.accent.emerald, fontWeight: 700 }}>● EN ROUTE</span>
            </div>
          </div>

          {/* Composition B: Stock Trend Curve */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.md,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <TrendingUp size={16} color={Colors.accent.emerald} />
              <strong style={{ fontSize: 13, color: Colors.text.primary }}>Financial Growth Trajectory</strong>
            </div>
            <div
              style={{
                position: 'relative',
                height: 150,
                backgroundColor: '#0c101a',
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <AnimatedPath
                d="M 20 130 Q 80 120 130 90 T 240 70 T 340 30"
                stroke={Colors.accent.emerald}
                strokeWidth={3.5}
                animation="draw-in"
                delay={0}
                durationInFrames={28}
                showFollower={true}
                followerSize={6}
                followerColor={Colors.accent.emerald}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
              <span>Annual Return: +48.6%</span>
              <span style={{ color: Colors.accent.emerald, fontWeight: 700 }}>ALL-TIME HIGH</span>
            </div>
          </div>

          {/* Composition C: Brand Security Shield */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.md,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <ShieldCheck size={16} color={Colors.accent.brand} />
              <strong style={{ fontSize: 13, color: Colors.text.primary }}>Verified Security Shield</strong>
            </div>
            <div
              style={{
                position: 'relative',
                height: 150,
                backgroundColor: '#0c101a',
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <AnimatedPath
                d="M 100 15 L 180 45 C 180 110, 140 160, 100 185 C 60 160, 20 110, 20 45 Z"
                stroke={Colors.accent.brand}
                strokeWidth={3}
                fill="rgba(39, 110, 241, 0.25)"
                fillRevealTiming="after-draw"
                fillDurationInFrames={12}
                animation="draw-in"
                delay={0}
                durationInFrames={22}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
              <span>AES-256 Encrypted</span>
              <span style={{ color: Colors.accent.brand, fontWeight: 700 }}>● CERTIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
