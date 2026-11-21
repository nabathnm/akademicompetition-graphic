/**
 * MaskTransition Showcase
 * Interactive motion graphics playground component demonstrating MaskTransition capabilities:
 * - 6 Mask Types: Circle, Rectangle, Rounded Rectangle, Ellipse, Polygon (Star, Triangle, Diamond, Hexagon, Pentagon), and SVG Path Presets (Heart, Star, Badge, Cloud, Flower)
 * - Modes: Reveal (Expand), Hide (Contract), Reveal-Hide (Envelope), Replace (Cross-Mask)
 * - 9 Origin Anchor Points: Center, Top, Bottom, Left, Right, Top-Left, Top-Right, Bottom-Left, Bottom-Right
 * - Modifiers: Dynamic Rotation, Combined Opacity Fade, Reverse progression, Spring physics
 * - Multi-content compatibility: Typography, Mockup, Visual Cards
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Circle,
  Square,
  Sparkles,
  Heart,
  RotateCw,
  Compass,
  Layers,
  Smartphone,
  Type,
} from 'lucide-react';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { MaskTransition } from '../../components/transitions/MaskTransition';
import { calculateMaskMetrics } from '../../components/transitions/maskTransitionStyle';
import type {
  MaskPolygonShape,
  MaskTransitionMode,
  MaskType,
} from '../../components/transitions/types';
import type { EasingPresetName } from '../../utils/animation/easing';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup';

const MASK_TYPE_OPTIONS: {
  id: MaskType;
  label: string;
  icon: React.FC<{ size?: number; color?: string }>;
}[] = [
  { id: 'circle', label: 'Circle (Iris)', icon: Circle },
  { id: 'rectangle', label: 'Rectangle', icon: Square },
  { id: 'rounded-rectangle', label: 'Rounded Box', icon: Square },
  { id: 'ellipse', label: 'Ellipse', icon: Circle },
  { id: 'polygon', label: 'Polygon / Star', icon: Sparkles },
  { id: 'path', label: 'SVG Path', icon: Heart },
];

const ORIGIN_OPTIONS = [
  { id: 'center', label: 'Center' },
  { id: 'top-left', label: 'Top Left' },
  { id: 'top', label: 'Top' },
  { id: 'top-right', label: 'Top Right' },
  { id: 'left', label: 'Left' },
  { id: 'right', label: 'Right' },
  { id: 'bottom-left', label: 'Bottom Left' },
  { id: 'bottom', label: 'Bottom' },
  { id: 'bottom-right', label: 'Bottom Right' },
];

const POLYGON_SHAPES: { id: MaskPolygonShape; label: string }[] = [
  { id: 'star', label: '5-Point Star' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'hexagon', label: 'Hexagon' },
  { id: 'pentagon', label: 'Pentagon' },
];

const PATH_PRESETS = [
  { id: 'heart', label: 'Heart' },
  { id: 'star', label: 'Star Seal' },
  { id: 'badge', label: 'Badge' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'flower', label: 'Flower' },
];

const EASING_PRESETS: EasingPresetName[] = ['easeInOut', 'easeOut', 'easeIn', 'linear'];

export const MaskTransitionShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mask Type & Shape
  const [maskType, setMaskType] = useState<MaskType>('circle');
  const [shape, setShape] = useState<MaskPolygonShape>('star');
  const [pathPreset, setPathPreset] = useState<string>('heart');

  // Mode and Origin
  const [mode, setMode] = useState<MaskTransitionMode>('reveal');
  const [origin, setOrigin] = useState<string>('center');

  // Motion Dynamics
  const [duration, setDuration] = useState<number>(25);
  const [delay] = useState<number>(5);
  const [rotation, setRotation] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(false);
  const [spring, setSpring] = useState<boolean>(false);
  const [reverse, setReverse] = useState<boolean>(false);
  const [easing, setEasing] = useState<EasingPresetName>('easeInOut');

  // Content Selection
  const [contentType, setContentType] = useState<'typography' | 'mockup' | 'cards'>('typography');

  // Replay frame offset
  const [replayOffset, setReplayOffset] = useState<number>(0);

  const handleReplay = () => {
    setReplayOffset(currentFrame);
  };

  const effectiveFrame = Math.max(0, currentFrame - replayOffset);

  // Live metrics calculation
  const metrics = calculateMaskMetrics({
    currentFrame: effectiveFrame,
    maskType,
    mode,
    duration,
    delay,
    easing,
    origin,
    shape,
    pathData: pathPreset,
    rotation,
    fade,
    spring: spring ? 'snappy' : undefined,
    reverse,
    clipId: 'showcase-mask-preview',
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
            <Compass size={20} color={accentColor} />
          </div>
          <div>
            <div style={{ ...Typography.headline.h4, color: Colors.text.primary }}>
              MaskTransition Suite
            </div>
            <div style={{ ...Typography.caption.caption, color: Colors.text.tertiary }}>
              Normalized Geometric & SVG Path Masks (clipPathUnits: objectBoundingBox)
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
          {/* Mask Type Selector */}
          <div>
            <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 8 }}>
              MASK GEOMETRY TYPE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {MASK_TYPE_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = maskType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMaskType(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
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
                    <Icon size={14} color={isSelected ? accentColor : Colors.text.tertiary} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Polygon Sub-Shape Selector */}
          {maskType === 'polygon' && (
            <div>
              <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 6 }}>
                POLYGON SHAPE
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {POLYGON_SHAPES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setShape(p.id)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: shape === p.id ? accentColor : Colors.dark.surface2,
                      border: `1px solid ${shape === p.id ? accentColor : Colors.border.subtle}`,
                      color: shape === p.id ? '#000000' : Colors.text.secondary,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SVG Path Preset Selector */}
          {maskType === 'path' && (
            <div>
              <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 6 }}>
                SVG PATH PRESET
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {PATH_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPathPreset(p.id)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: pathPreset === p.id ? accentColor : Colors.dark.surface2,
                      border: `1px solid ${pathPreset === p.id ? accentColor : Colors.border.subtle}`,
                      color: pathPreset === p.id ? '#000000' : Colors.text.secondary,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transition Mode */}
          <div>
            <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 8 }}>
              TRANSITION MODE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { id: 'reveal', label: 'Reveal (Expand)' },
                { id: 'hide', label: 'Hide (Contract)' },
                { id: 'reveal-hide', label: 'Reveal-Hide' },
                { id: 'replace', label: 'Replace (Cross)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as MaskTransitionMode)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: mode === m.id ? 'rgba(6, 182, 212, 0.2)' : Colors.dark.surface2,
                    border: `1px solid ${mode === m.id ? accentColor : Colors.border.subtle}`,
                    color: mode === m.id ? '#ffffff' : Colors.text.secondary,
                    fontSize: 12,
                    fontWeight: mode === m.id ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Origin Anchor Points */}
          <div>
            <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 8 }}>
              MASK EXPANSION ORIGIN
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {ORIGIN_OPTIONS.map((orig) => (
                <button
                  key={orig.id}
                  type="button"
                  onClick={() => setOrigin(orig.id)}
                  style={{
                    padding: '6px 4px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: origin === orig.id ? accentColor : Colors.dark.surface2,
                    border: `1px solid ${origin === orig.id ? accentColor : Colors.border.subtle}`,
                    color: origin === orig.id ? '#000000' : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {orig.label}
                </button>
              ))}
            </div>
          </div>

          {/* Easing Preset */}
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
              <span>ROTATION</span>
              <span>{rotation}°</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 45, 90, 180, 360].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setRotation(deg)}
                  style={{
                    flex: 1,
                    padding: '4px 0',
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

          {/* Dynamics Toggles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => setFade(!fade)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: fade ? 'rgba(6, 182, 212, 0.25)' : Colors.dark.surface2,
                border: `1px solid ${fade ? accentColor : Colors.border.subtle}`,
                color: fade ? '#ffffff' : Colors.text.secondary,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Fade: {fade ? 'ON' : 'OFF'}
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
              onClick={() => setDuration(duration === 25 ? 40 : 25)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface2,
                border: `1px solid ${Colors.border.subtle}`,
                color: Colors.text.secondary,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Duration: {duration}f
            </button>
          </div>

          {/* Content Switcher */}
          <div>
            <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 6 }}>
              DEMO CONTENT
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
              {[
                { id: 'typography', label: 'Typography', icon: Type },
                { id: 'mockup', label: 'Mockup', icon: Smartphone },
                { id: 'cards', label: 'Cards', icon: Layers },
              ].map((c) => {
                const Icon = c.icon;
                const isSelected = contentType === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setContentType(c.id as 'typography' | 'mockup' | 'cards')}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      padding: '8px 4px',
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.2)' : Colors.dark.surface2,
                      border: `1px solid ${isSelected ? accentColor : Colors.border.subtle}`,
                      color: isSelected ? '#ffffff' : Colors.text.secondary,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Icon size={14} color={isSelected ? accentColor : Colors.text.tertiary} />
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
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

            {/* The Actual MaskTransition Under Test */}
            <MaskTransition
              maskType={maskType}
              mode={mode}
              duration={duration}
              delay={delay}
              easing={easing}
              origin={origin}
              shape={shape}
              pathData={pathPreset}
              rotation={rotation}
              fade={fade}
              spring={spring ? 'snappy' : undefined}
              reverse={reverse}
              clipId="showcase-mask-preview"
              fromContent={
                /* Outgoing layer for Replace mode */
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#1e1b4b',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: Spacing.scale.xl,
                    color: '#ffffff',
                  }}
                >
                  <div style={{ fontSize: 13, color: '#a5b4fc', letterSpacing: 2, fontWeight: 700 }}>
                    OUTGOING SCENE 01
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>
                    Editorial Layout
                  </div>
                </div>
              }
              toContent={
                /* Incoming layer for Replace mode */
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#064e3b',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: Spacing.scale.xl,
                    color: '#ffffff',
                  }}
                >
                  <div style={{ fontSize: 13, color: '#6ee7b7', letterSpacing: 2, fontWeight: 700 }}>
                    INCOMING SCENE 02
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>
                    Dynamic Reveal
                  </div>
                </div>
              }
            >
              {/* Single Content Layer for Reveal, Hide, Reveal-Hide */}
              {contentType === 'typography' ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0c4a6e 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: Spacing.scale.xxl,
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: accentColor,
                      letterSpacing: 3,
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    Geometric Precision
                  </div>
                  <div
                    style={{
                      fontSize: 38,
                      fontWeight: 900,
                      color: '#ffffff',
                      lineHeight: 1.1,
                      letterSpacing: -1,
                    }}
                  >
                    Dynamic Masking
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: Colors.text.secondary,
                      maxWidth: 420,
                      marginTop: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    SVG objectBoundingBox clipping boundary expanding smoothly with zero distortion.
                  </div>
                </div>
              ) : contentType === 'mockup' ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, #182234 0%, #0a0e17 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SmartphoneMockup width={220} model="flagship">
                    <div
                      style={{
                        padding: 16,
                        height: '100%',
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Sparkles size={24} color={accentColor} />
                      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>App Screen</div>
                      <div style={{ fontSize: 10, color: Colors.text.tertiary, marginTop: 4 }}>
                        Nested Masking
                      </div>
                    </div>
                  </SmartphoneMockup>
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #31104b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    padding: 24,
                  }}
                >
                  {[1, 2, 3].map((card) => (
                    <div
                      key={card}
                      style={{
                        flex: 1,
                        height: 220,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 12,
                        padding: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          backgroundColor: 'rgba(6, 182, 212, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: accentColor,
                          fontWeight: 700,
                        }}
                      >
                        0{card}
                      </div>
                      <div>
                        <div style={{ color: '#ffffff', fontWeight: 700, fontSize: 14 }}>
                          Card Feature {card}
                        </div>
                        <div style={{ color: Colors.text.tertiary, fontSize: 11, marginTop: 4 }}>
                          Modular Motion UI
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </MaskTransition>
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
              <span style={{ color: Colors.text.tertiary }}>Scale: </span>
              <span style={{ color: accentColor, fontWeight: 700 }}>
                {metrics.scale.toFixed(2)}
              </span>
            </div>
            <div>
              <span style={{ color: Colors.text.tertiary }}>Opacity: </span>
              <span style={{ color: Colors.text.primary, fontWeight: 700 }}>
                {metrics.opacity.toFixed(2)}
              </span>
            </div>
            <div>
              <span style={{ color: Colors.text.tertiary }}>Progress: </span>
              <span style={{ color: Colors.text.primary, fontWeight: 700 }}>
                {(metrics.progress * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <span style={{ color: Colors.text.tertiary }}>Phase: </span>
              <span style={{ color: '#eab308', fontWeight: 700 }}>
                {metrics.phase.toUpperCase()}
              </span>
            </div>
            <div>
              <span style={{ color: Colors.text.tertiary }}>Shape: </span>
              <span style={{ color: Colors.text.primary, fontWeight: 700 }}>
                {maskType === 'polygon' ? shape : maskType === 'path' ? pathPreset : maskType}
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
          {`<MaskTransition
  maskType="${maskType}"
  mode="${mode}"
  origin="${origin}"
  duration={${duration}}${shape !== 'star' && maskType === 'polygon' ? `\n  shape="${shape}"` : ''}${pathPreset !== 'heart' && maskType === 'path' ? `\n  pathData="${pathPreset}"` : ''}${rotation !== 0 ? `\n  rotation={${rotation}}` : ''}${fade ? '\n  fade' : ''}${spring ? '\n  spring="snappy"' : ''}${reverse ? '\n  reverse' : ''}
>
  <YourContent />
</MaskTransition>`}
        </pre>
      </div>
    </div>
  );
};
