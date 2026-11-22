/**
 * MorphTransition Showcase
 * Interactive motion graphics playground component demonstrating MorphTransition capabilities:
 * - Geometric Transformations: Circle → Rectangle, Rectangle → Rounded Rectangle, Circle → Star, Triangle → Diamond
 * - Icon-like Morphing: Heart → Cloud, Check → Cross, Play → Arrow
 * - Color Interpolation: Continuous RGB/RGBA fill and stroke blending
 * - Kinematics: Coordinated rotational spinning and scale breathing
 * - Motion Controls: Easing presets, Spring physics, Duration, and Reverse
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Sparkles,
  RotateCw,
  Layers,
  Circle,
  Square,
  Heart,
  Play,
  Check,
} from 'lucide-react';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { MorphTransition } from '../../components/transitions/MorphTransition';
import { calculateMorphMetrics } from '../../components/transitions/morphTransitionStyle';
import type { EasingPresetName } from '../../utils/animation/easing';

const MORPH_PAIRS: {
  id: string;
  label: string;
  fromPath: string;
  toPath: string;
  fromFill: string;
  toFill: string;
  icon: React.FC<{ size?: number; color?: string }>;
}[] = [
  {
    id: 'circle-rect',
    label: 'Circle → Rectangle',
    fromPath: 'circle',
    toPath: 'rectangle',
    fromFill: '#06b6d4',
    toFill: '#3b82f6',
    icon: Circle,
  },
  {
    id: 'rect-rounded',
    label: 'Rectangle → Rounded Box',
    fromPath: 'rectangle',
    toPath: 'rounded-rectangle',
    fromFill: '#3b82f6',
    toFill: '#8b5cf6',
    icon: Square,
  },
  {
    id: 'circle-star',
    label: 'Circle → 5-Point Star',
    fromPath: 'circle',
    toPath: 'star',
    fromFill: '#06b6d4',
    toFill: '#ec4899',
    icon: Sparkles,
  },
  {
    id: 'triangle-diamond',
    label: 'Triangle → Diamond',
    fromPath: 'triangle',
    toPath: 'diamond',
    fromFill: '#10b981',
    toFill: '#f59e0b',
    icon: Layers,
  },
  {
    id: 'heart-cloud',
    label: 'Heart → Cloud',
    fromPath: 'heart',
    toPath: 'cloud',
    fromFill: '#ef4444',
    toFill: '#38bdf8',
    icon: Heart,
  },
  {
    id: 'check-cross',
    label: 'Checkmark → Cross',
    fromPath: 'check',
    toPath: 'cross',
    fromFill: '#10b981',
    toFill: '#ef4444',
    icon: Check,
  },
  {
    id: 'play-arrow',
    label: 'Play → Arrow',
    fromPath: 'play',
    toPath: 'arrow',
    fromFill: '#8b5cf6',
    toFill: '#06b6d4',
    icon: Play,
  },
];

const EASING_PRESETS: EasingPresetName[] = ['easeInOut', 'easeOut', 'easeIn', 'linear'];

export const MorphTransitionShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Morph Selection
  const [selectedPairId, setSelectedPairId] = useState<string>('circle-star');

  // Motion Dynamics
  const [duration, setDuration] = useState<number>(30);
  const [delay] = useState<number>(5);
  const [rotation, setRotation] = useState<number>(180);
  const [scaleMorph, setScaleMorph] = useState<boolean>(true);
  const [stroke, setStroke] = useState<boolean>(true);
  const [spring, setSpring] = useState<boolean>(false);
  const [reverse, setReverse] = useState<boolean>(false);
  const [easing, setEasing] = useState<EasingPresetName>('easeInOut');

  // Replay frame offset
  const [replayOffset, setReplayOffset] = useState<number>(0);

  const handleReplay = () => {
    setReplayOffset(currentFrame);
  };

  const effectiveFrame = Math.max(0, currentFrame - replayOffset);

  // Active configuration mapping
  const activePair = MORPH_PAIRS.find((p) => p.id === selectedPairId) || MORPH_PAIRS[0];

  // Live metrics calculation
  const metrics = calculateMorphMetrics({
    currentFrame: effectiveFrame,
    fromPath: activePair.fromPath,
    toPath: activePair.toPath,
    duration,
    delay,
    easing,
    fromFill: activePair.fromFill,
    toFill: activePair.toFill,
    fromStroke: stroke ? '#ffffff' : 'transparent',
    toStroke: stroke ? '#ffffff' : 'transparent',
    fromStrokeWidth: stroke ? 2 : 0,
    toStrokeWidth: stroke ? 4 : 0,
    initialRotation: 0,
    finalRotation: rotation,
    initialScale: scaleMorph ? 0.85 : 1.0,
    finalScale: scaleMorph ? 1.15 : 1.0,
    spring: spring ? 'snappy' : undefined,
    reverse,
  });

  const accentColor = Colors.accent.cyan;

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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: Spacing.radius.sm,
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              border: `1px solid ${accentColor}`,
            }}
          >
            <Sparkles size={20} color={accentColor} />
          </div>
          <div>
            <div style={{ ...Typography.headline.h4, color: Colors.text.primary }}>
              MorphTransition Suite
            </div>
            <div style={{ ...Typography.caption.caption, color: Colors.text.tertiary }}>
              Deterministic 2D SVG Path Morphing & Continuous Color Interpolation
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm }}>
          <div
            style={{
              padding: '4px 10px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: Colors.dark.surface2,
              border: `1px solid ${Colors.border.subtle}`,
              fontFamily: Typography.fontFamily.mono,
              fontSize: 11,
              color: Colors.text.secondary,
            }}
          >
            Frame: {effectiveFrame} / {duration + delay} | FPS: {fps}
          </div>
          <button
            type="button"
            onClick={handleReplay}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: Spacing.radius.sm,
              backgroundColor: accentColor,
              border: 'none',
              color: '#000000',
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            <RotateCw size={13} />
            Replay Transition
          </button>
        </div>
      </div>

      {/* 2. Control Matrix & Live Canvas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 380px) 1fr',
          gap: Spacing.scale.lg,
        }}
      >
        {/* Controls Panel */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: Spacing.scale.md,
            backgroundColor: Colors.dark.surface1,
            padding: Spacing.scale.lg,
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          {/* Morph Pair Selection */}
          <div>
            <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 8 }}>
              MORPH GEOMETRY PAIR
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {MORPH_PAIRS.map((pair) => {
                const Icon = pair.icon;
                const isSelected = selectedPairId === pair.id;
                return (
                  <button
                    key={pair.id}
                    type="button"
                    onClick={() => setSelectedPairId(pair.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.2)' : Colors.dark.surface2,
                      border: `1px solid ${isSelected ? accentColor : Colors.border.subtle}`,
                      color: isSelected ? '#ffffff' : Colors.text.secondary,
                      fontSize: 12,
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon size={14} color={isSelected ? accentColor : Colors.text.tertiary} />
                      <span>{pair.label}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: pair.fromFill,
                        }}
                      />
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: pair.toFill,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rotation Control */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                ...Typography.caption.eyebrow,
                color: Colors.text.secondary,
                marginBottom: 6,
              }}
            >
              <span>ROTATION DELTA</span>
              <span>{rotation}°</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 90, 180, 360].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setRotation(deg)}
                  style={{
                    flex: 1,
                    padding: '5px 0',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: rotation === deg ? accentColor : Colors.dark.surface2,
                    border: `1px solid ${rotation === deg ? accentColor : Colors.border.subtle}`,
                    color: rotation === deg ? '#000000' : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>

          {/* Easing Curve */}
          <div>
            <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 6 }}>
              EASING CURVE
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {EASING_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setEasing(preset)}
                  style={{
                    flex: 1,
                    padding: '5px 0',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: easing === preset ? accentColor : Colors.dark.surface2,
                    border: `1px solid ${easing === preset ? accentColor : Colors.border.subtle}`,
                    color: easing === preset ? '#000000' : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamics Toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => setScaleMorph(!scaleMorph)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: scaleMorph ? 'rgba(6, 182, 212, 0.25)' : Colors.dark.surface2,
                border: `1px solid ${scaleMorph ? accentColor : Colors.border.subtle}`,
                color: scaleMorph ? '#ffffff' : Colors.text.secondary,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Scale: {scaleMorph ? '0.85 → 1.15' : 'Static'}
            </button>
            <button
              type="button"
              onClick={() => setStroke(!stroke)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: stroke ? 'rgba(6, 182, 212, 0.25)' : Colors.dark.surface2,
                border: `1px solid ${stroke ? accentColor : Colors.border.subtle}`,
                color: stroke ? '#ffffff' : Colors.text.secondary,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Stroke: {stroke ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setSpring(!spring)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: spring ? 'rgba(6, 182, 212, 0.25)' : Colors.dark.surface2,
                border: `1px solid ${spring ? accentColor : Colors.border.subtle}`,
                color: spring ? '#ffffff' : Colors.text.secondary,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Spring: {spring ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setReverse(!reverse)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: reverse ? 'rgba(6, 182, 212, 0.25)' : Colors.dark.surface2,
                border: `1px solid ${reverse ? accentColor : Colors.border.subtle}`,
                color: reverse ? '#ffffff' : Colors.text.secondary,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reverse: {reverse ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => setDuration(duration === 30 ? 45 : 30)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface2,
                border: `1px solid ${Colors.border.subtle}`,
                color: Colors.text.secondary,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                gridColumn: 'span 2',
              }}
            >
              Duration: {duration}f
            </button>
          </div>
        </div>

        {/* Live Preview Canvas & Telemetry */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 440,
              backgroundColor: '#070a0f',
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Background grid */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage:
                  'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                pointerEvents: 'none',
              }}
            />

            {/* The Actual MorphTransition Under Test */}
            <MorphTransition
              fromPath={activePair.fromPath}
              toPath={activePair.toPath}
              duration={duration}
              delay={delay}
              easing={easing}
              fromFill={activePair.fromFill}
              toFill={activePair.toFill}
              fromStroke={stroke ? '#ffffff' : 'transparent'}
              toStroke={stroke ? '#ffffff' : 'transparent'}
              fromStrokeWidth={stroke ? 2 : 0}
              toStrokeWidth={stroke ? 4 : 0}
              initialRotation={0}
              finalRotation={rotation}
              initialScale={scaleMorph ? 0.85 : 1.0}
              finalScale={scaleMorph ? 1.15 : 1.0}
              spring={spring ? 'snappy' : undefined}
              reverse={reverse}
              width={260}
              height={260}
            />

            {/* Morphing label */}
            <div
              style={{
                marginTop: Spacing.scale.md,
                fontFamily: Typography.fontFamily.mono,
                fontSize: 12,
                color: Colors.text.secondary,
                zIndex: 1,
              }}
            >
              {activePair.fromPath.toUpperCase()} ➔ {activePair.toPath.toUpperCase()}
            </div>
          </div>

          {/* Telemetry Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: Spacing.scale.sm,
              backgroundColor: Colors.dark.surface1,
              padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
              borderRadius: Spacing.radius.sm,
              border: `1px solid ${Colors.border.default}`,
              fontFamily: Typography.fontFamily.mono,
              fontSize: 11,
            }}
          >
            <div>
              <span style={{ color: Colors.text.tertiary }}>Progress: </span>
              <span style={{ color: accentColor, fontWeight: 700 }}>
                {(metrics.progress * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span style={{ color: Colors.text.tertiary }}>Fill: </span>
              <span style={{ color: Colors.text.primary, fontWeight: 700, fontSize: 10 }}>
                {metrics.fill}
              </span>
            </div>
            <div>
              <span style={{ color: Colors.text.tertiary }}>Rotation: </span>
              <span style={{ color: Colors.text.primary, fontWeight: 700 }}>
                {metrics.rotation.toFixed(0)}°
              </span>
            </div>
            <div>
              <span style={{ color: Colors.text.tertiary }}>Scale: </span>
              <span style={{ color: Colors.text.primary, fontWeight: 700 }}>
                {metrics.scale.toFixed(2)}x
              </span>
            </div>
            <div>
              <span style={{ color: Colors.text.tertiary }}>Phase: </span>
              <span style={{ color: '#eab308', fontWeight: 700 }}>
                {metrics.phase.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Code Generation Snippet */}
      <div
        style={{
          padding: Spacing.scale.md,
          backgroundColor: Colors.dark.surface1,
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 8 }}>
          GENERATED COMPONENT CODE
        </div>
        <pre
          style={{
            margin: 0,
            padding: Spacing.scale.md,
            backgroundColor: '#0a0d14',
            borderRadius: Spacing.radius.xs,
            fontFamily: Typography.fontFamily.mono,
            fontSize: 12,
            color: '#a5f3fc',
            overflowX: 'auto',
          }}
        >
          {`<MorphTransition
  fromPath="${activePair.fromPath}"
  toPath="${activePair.toPath}"
  fromFill="${activePair.fromFill}"
  toFill="${activePair.toFill}"
  duration={${duration}}${rotation > 0 ? `\n  finalRotation={${rotation}}` : ''}${scaleMorph ? `\n  initialScale={0.85}\n  finalScale={1.15}` : ''}${stroke ? `\n  fromStroke="#ffffff"\n  toStroke="#ffffff"\n  fromStrokeWidth={2}\n  toStrokeWidth={4}` : ''}${spring ? '\n  spring="snappy"' : ''}${reverse ? '\n  reverse' : ''}
/>`}
        </pre>
      </div>
    </div>
  );
};
