/**
 * SplitTransition Showcase
 * Interactive motion graphics playground component demonstrating SplitTransition capabilities:
 * - Split Configurations: 2 Vertical Panels, 2 Horizontal Panels, 4 Quadrants (2x2), Multiple Vertical & Horizontal Strips, Custom Grid
 * - Movement Behaviors: Outward, Inward, Opposite / Alternating, Directional (Left, Right, Up, Down)
 * - Timing Modes: Enter, Exit, Enter-Exit Envelope, Replace (Cross-Split)
 * - Sequencing: Simultaneous, Staggered Sequential (Start-to-End, End-to-Start, Center-Out, Edges-In)
 * - Multi-content compatibility: Typography, Mockups, Visual Cards
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Columns2,
  Rows2,
  Grid2X2,
  Layers,
  ArrowRightLeft,
  RotateCw,
  Smartphone,
  Type,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { SplitTransition } from '../../components/transitions/SplitTransition';
import { calculateSplitMetrics } from '../../components/transitions/splitTransitionStyle';
import type {
  SplitDirection,
  SplitMovementDirection,
  SplitStaggerOrder,
  SplitTransitionMode,
} from '../../components/transitions/types';
import type { EasingPresetName } from '../../utils/animation/easing';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup';

const SPLIT_CONFIG_OPTIONS: {
  id: string;
  label: string;
  direction: SplitDirection;
  panels: number;
  rows?: number;
  cols?: number;
  icon: React.FC<{ size?: number; color?: string }>;
}[] = [
  { id: 'vert-2', label: '2 Vertical Panels', direction: 'vertical', panels: 2, icon: Columns2 },
  { id: 'horiz-2', label: '2 Horizontal Panels', direction: 'horizontal', panels: 2, icon: Rows2 },
  { id: 'quadrants', label: '4 Quadrants (2x2)', direction: 'quadrants', panels: 4, icon: Grid2X2 },
  { id: 'vert-strips', label: '5 Vertical Strips', direction: 'vertical', panels: 5, icon: Columns2 },
  { id: 'horiz-strips', label: '4 Horizontal Strips', direction: 'horizontal', panels: 4, icon: Rows2 },
  { id: 'grid-3x3', label: '3x3 Grid (9 Panels)', direction: 'grid', panels: 9, rows: 3, cols: 3, icon: Grid2X2 },
];

const MOVEMENT_OPTIONS: {
  id: SplitMovementDirection;
  label: string;
  icon: React.FC<{ size?: number; color?: string }>;
}[] = [
  { id: 'outward', label: 'Outward (Parting)', icon: Maximize2 },
  { id: 'inward', label: 'Inward (Assembling)', icon: Minimize2 },
  { id: 'opposite', label: 'Opposite (Alternating)', icon: ArrowRightLeft },
  { id: 'left', label: 'Directional Left', icon: ArrowRightLeft },
  { id: 'right', label: 'Directional Right', icon: ArrowRightLeft },
];

const STAGGER_ORDERS: { id: SplitStaggerOrder; label: string }[] = [
  { id: 'start-to-end', label: 'Start → End' },
  { id: 'end-to-start', label: 'End → Start' },
  { id: 'center-out', label: 'Center → Out' },
  { id: 'edges-in', label: 'Edges → In' },
];

const EASING_PRESETS: EasingPresetName[] = ['easeOut', 'easeInOut', 'easeIn', 'linear'];

export const SplitTransitionShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split Configuration
  const [selectedConfig, setSelectedConfig] = useState<string>('vert-2');
  const [movement, setMovement] = useState<SplitMovementDirection>('outward');
  const [mode, setMode] = useState<SplitTransitionMode>('enter');

  // Stagger Dynamics
  const [staggerDelay, setStaggerDelay] = useState<number>(3);
  const [staggerOrder, setStaggerOrder] = useState<SplitStaggerOrder>('start-to-end');

  // Motion Dynamics
  const [duration, setDuration] = useState<number>(25);
  const [delay] = useState<number>(5);
  const [panelGap, setPanelGap] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(false);
  const [spring, setSpring] = useState<boolean>(false);
  const [reverse, setReverse] = useState<boolean>(false);
  const [easing, setEasing] = useState<EasingPresetName>('easeOut');

  // Content Selection
  const [contentType, setContentType] = useState<'typography' | 'mockup' | 'cards'>('typography');

  // Replay frame offset
  const [replayOffset, setReplayOffset] = useState<number>(0);

  const handleReplay = () => {
    setReplayOffset(currentFrame);
  };

  const effectiveFrame = Math.max(0, currentFrame - replayOffset);

  // Active configuration mapping
  const config =
    SPLIT_CONFIG_OPTIONS.find((c) => c.id === selectedConfig) || SPLIT_CONFIG_OPTIONS[0];

  // Live metrics calculation
  const metrics = calculateSplitMetrics({
    currentFrame: effectiveFrame,
    splitDirection: config.direction,
    panelCount: config.panels,
    rows: config.rows,
    cols: config.cols,
    mode,
    movementDirection: movement,
    staggerDelay,
    staggerOrder,
    duration,
    delay,
    panelGap,
    easing,
    fade,
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
            <Columns2 size={20} color={accentColor} />
          </div>
          <div>
            <div style={{ ...Typography.headline.h4, color: Colors.text.primary }}>
              SplitTransition Suite
            </div>
            <div style={{ ...Typography.caption.caption, color: Colors.text.tertiary }}>
              Independent Panel & Strip Partitions with Deterministic Motion Dynamics
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
            Frame: {effectiveFrame} / {duration + delay + (config.panels - 1) * staggerDelay} | Panels: {metrics.panels.length} | FPS: {fps}
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
          {/* Split Configuration */}
          <div>
            <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 8 }}>
              SPLIT CONFIGURATION
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {SPLIT_CONFIG_OPTIONS.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedConfig === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedConfig(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.2)' : Colors.dark.surface2,
                      border: `1px solid ${isSelected ? accentColor : Colors.border.subtle}`,
                      color: isSelected ? '#ffffff' : Colors.text.secondary,
                      fontSize: 11,
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

          {/* Movement Direction */}
          <div>
            <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 8 }}>
              MOVEMENT DIRECTION
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {MOVEMENT_OPTIONS.map((m) => {
                const Icon = m.icon;
                const isSelected = movement === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMovement(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 10px',
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.2)' : Colors.dark.surface2,
                      border: `1px solid ${isSelected ? accentColor : Colors.border.subtle}`,
                      color: isSelected ? '#ffffff' : Colors.text.secondary,
                      fontSize: 11,
                      fontWeight: isSelected ? 600 : 400,
                      cursor: 'pointer',
                    }}
                  >
                    <Icon size={13} color={isSelected ? accentColor : Colors.text.tertiary} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transition Mode */}
          <div>
            <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 8 }}>
              TRANSITION MODE
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { id: 'enter', label: 'Enter (Assemble)' },
                { id: 'exit', label: 'Exit (Disperse)' },
                { id: 'enter-exit', label: 'Enter-Exit Envelope' },
                { id: 'replace', label: 'Replace (Cross-Split)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id as SplitTransitionMode)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: mode === m.id ? 'rgba(6, 182, 212, 0.2)' : Colors.dark.surface2,
                    border: `1px solid ${mode === m.id ? accentColor : Colors.border.subtle}`,
                    color: mode === m.id ? '#ffffff' : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: mode === m.id ? 600 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stagger Sequence & Delay */}
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
              <span>STAGGER DELAY</span>
              <span>{staggerDelay}f {staggerDelay === 0 ? '(Simultaneous)' : '(Sequential)'}</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 2, 4, 6].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStaggerDelay(st)}
                  style={{
                    flex: 1,
                    padding: '5px 0',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: staggerDelay === st ? accentColor : Colors.dark.surface2,
                    border: `1px solid ${staggerDelay === st ? accentColor : Colors.border.subtle}`,
                    color: staggerDelay === st ? '#000000' : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {st === 0 ? '0f' : `${st}f`}
                </button>
              ))}
            </div>
          </div>

          {/* Stagger Order */}
          {staggerDelay > 0 && (
            <div>
              <div style={{ ...Typography.caption.eyebrow, color: Colors.text.secondary, marginBottom: 6 }}>
                STAGGER ORDER
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {STAGGER_ORDERS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setStaggerOrder(o.id)}
                    style={{
                      padding: '5px 8px',
                      borderRadius: Spacing.radius.xs,
                      backgroundColor: staggerOrder === o.id ? accentColor : Colors.dark.surface2,
                      border: `1px solid ${staggerOrder === o.id ? accentColor : Colors.border.subtle}`,
                      color: staggerOrder === o.id ? '#000000' : Colors.text.secondary,
                      fontSize: 10,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              onClick={() => setPanelGap(panelGap === 0 ? 6 : 0)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: panelGap > 0 ? 'rgba(6, 182, 212, 0.25)' : Colors.dark.surface2,
                border: `1px solid ${panelGap > 0 ? accentColor : Colors.border.subtle}`,
                color: panelGap > 0 ? '#ffffff' : Colors.text.secondary,
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Gap: {panelGap}px
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

            {/* The Actual SplitTransition Under Test */}
            <SplitTransition
              splitDirection={config.direction}
              panelCount={config.panels}
              rows={config.rows}
              cols={config.cols}
              mode={mode}
              movementDirection={movement}
              duration={duration}
              delay={delay}
              panelGap={panelGap}
              staggerDelay={staggerDelay}
              staggerOrder={staggerOrder}
              easing={easing}
              fade={fade}
              spring={spring ? 'snappy' : undefined}
              reverse={reverse}
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
                    OUTGOING LAYER
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
                    INCOMING LAYER
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>
                    Splitting Revealed
                  </div>
                </div>
              }
            >
              {/* Single Content Layer for Enter, Exit, Enter-Exit */}
              {contentType === 'typography' ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #09203f 0%, #537895 100%)',
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
                      color: '#a5f3fc',
                      letterSpacing: 3,
                      textTransform: 'uppercase',
                      marginBottom: 8,
                    }}
                  >
                    Architectural Layout
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
                    Split Transitions
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: '#e2e8f0',
                      maxWidth: 420,
                      marginTop: 12,
                      lineHeight: 1.5,
                    }}
                  >
                    Multi-panel coordinate partitioning with zero visual gaps and synchronized CSS insets.
                  </div>
                </div>
              ) : contentType === 'mockup' ? (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
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
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Columns2 size={24} color="#ffffff" />
                      <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>Device Mockup</div>
                      <div style={{ fontSize: 10, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4 }}>
                        Synchronized Splits
                      </div>
                    </div>
                  </SmartphoneMockup>
                </div>
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
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
                        border: '1px solid rgba(255, 255, 255, 0.15)',
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
                          backgroundColor: 'rgba(6, 182, 212, 0.25)',
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
                          Feature Block {card}
                        </div>
                        <div style={{ color: Colors.text.tertiary, fontSize: 11, marginTop: 4 }}>
                          Segmented Visuals
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SplitTransition>
          </div>

          {/* Telemetry Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
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
              <span style={{ color: Colors.text.tertiary }}>Panels: </span>
              <span style={{ color: accentColor, fontWeight: 700 }}>
                {metrics.panels.length}
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
              <span style={{ color: Colors.text.tertiary }}>Movement: </span>
              <span style={{ color: Colors.text.primary, fontWeight: 700 }}>
                {movement.toUpperCase()}
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
          {`<SplitTransition
  splitDirection="${config.direction}"${config.panels !== 2 ? `\n  panelCount={${config.panels}}` : ''}${config.rows ? `\n  rows={${config.rows}}` : ''}${config.cols ? `\n  cols={${config.cols}}` : ''}
  mode="${mode}"
  movementDirection="${movement}"
  duration={${duration}}${staggerDelay > 0 ? `\n  staggerDelay={${staggerDelay}}\n  staggerOrder="${staggerOrder}"` : ''}${panelGap > 0 ? `\n  panelGap={${panelGap}}` : ''}${fade ? '\n  fade' : ''}${spring ? '\n  spring="snappy"' : ''}${reverse ? '\n  reverse' : ''}
>
  <YourContent />
</SplitTransition>`}
        </pre>
      </div>
    </div>
  );
};
