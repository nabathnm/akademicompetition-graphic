/**
 * GlitchTransition Showcase
 *
 * Interactive motion graphics playground component demonstrating GlitchTransition:
 * - RGB channel separation (chromatic aberration)
 * - Horizontal slice displacement & tearing
 * - Vertical jitter & horizontal pixelated shaking
 * - Digital noise blocks & CRT scanlines
 * - Strobe flicker & brightness pops
 * - Modes: Glitch In, Glitch Out, Glitch Replace, Glitch Burst, Continuous Glitch
 * - Customizable intensity, frequency, slice count, pixel quantization, and seeds
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Zap,
  Radio,
  Tv,
  Activity,
  Sliders,
  Layers,
  RotateCw,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { GlitchTransition } from '../../components/transitions/GlitchTransition';
import { calculateGlitchMetrics } from '../../components/transitions/glitchTransitionStyle';
import type { GlitchTransitionMode } from '../../components/transitions/types';

interface DemoContentPreset {
  id: string;
  name: string;
  category: string;
}

const DEMO_PRESETS: DemoContentPreset[] = [
  { id: 'hud', name: 'Cyberpunk HUD', category: 'Interface' },
  { id: 'terminal', name: 'Matrix Terminal', category: 'Typography' },
  { id: 'badge', name: 'Security Breach', category: 'Graphic' },
  { id: 'replace-cut', name: 'Scene Cross-Cut', category: 'Dual Layer' },
];

export const GlitchTransitionShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // State
  const [mode, setMode] = useState<GlitchTransitionMode>('replace');
  const [contentPreset, setContentPreset] = useState<string>('hud');
  const [intensity, setIntensity] = useState<number>(1.2);
  const [frequency, setFrequency] = useState<number>(0.75);
  const [sliceCount, setSliceCount] = useState<number>(10);
  const [pixelSize, setPixelSize] = useState<number>(4);
  const [seed, setSeed] = useState<number | string>(2077);
  const [duration, setDuration] = useState<number>(35);
  const [reverse, setReverse] = useState<boolean>(false);

  // Toggles
  const [enableRgbSplit, setEnableRgbSplit] = useState<boolean>(true);
  const [enableSlices, setEnableSlices] = useState<boolean>(true);
  const [enableJitter, setEnableJitter] = useState<boolean>(true);
  const [enableNoise, setEnableNoise] = useState<boolean>(true);
  const [enableScanlines, setEnableScanlines] = useState<boolean>(true);
  const [enableFlicker, setEnableFlicker] = useState<boolean>(true);

  // Compute live metrics for telemetry
  const metrics = calculateGlitchMetrics({
    frame,
    mode,
    intensity,
    frequency,
    duration,
    sliceCount,
    pixelSize,
    seed,
    enableRgbSplit,
    enableSlices,
    enableJitter,
    enableNoise,
    enableScanlines,
    enableFlicker,
    reverse,
  });

  // Content layers
  const renderLayerA = () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0d14',
        border: `2px solid ${Colors.accent.cyan}60`,
        borderRadius: Spacing.radius.md,
        padding: Spacing.scale.lg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: `0 0 30px ${Colors.accent.cyan}25, inset 0 0 20px rgba(6, 182, 212, 0.1)`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
          <Radio size={16} color={Colors.accent.cyan} />
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
            TERMINAL NODE // ALPHA-01
          </span>
        </div>
        <span
          style={{
            fontSize: 10,
            fontFamily: Typography.fontFamily.mono,
            color: '#10b981',
            backgroundColor: '#064e3b40',
            padding: '2px 6px',
            borderRadius: 4,
            border: '1px solid #10b98160',
          }}
        >
          ENCRYPTED LINK
        </span>
      </div>

      <div style={{ margin: `${Spacing.scale.md}px 0` }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
          CYBERNETIC CORE OS
        </div>
        <div style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginTop: 4 }}>
          SYSTEM BUFFER: 0x7FFF98A2 // ADAPTIVE VECTOR BUFFER
        </div>
      </div>

      <div style={{ display: 'flex', gap: Spacing.scale.md, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 6, backgroundColor: Colors.dark.surface2, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '74%', height: '100%', backgroundColor: Colors.accent.cyan }} />
        </div>
        <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan }}>
          74.2% READY
        </span>
      </div>
    </div>
  );

  const renderLayerB = () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#160815',
        border: '2px solid #ec489980',
        borderRadius: Spacing.radius.md,
        padding: Spacing.scale.lg,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 0 30px rgba(236, 72, 153, 0.25), inset 0 0 20px rgba(236, 72, 153, 0.1)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
          <ShieldAlert size={16} color="#ec4899" />
          <span style={{ ...Typography.caption.eyebrow, color: '#ec4899' }}>
            OVERRIDE NODE // OMEGA-99
          </span>
        </div>
        <span
          style={{
            fontSize: 10,
            fontFamily: Typography.fontFamily.mono,
            color: '#ef4444',
            backgroundColor: '#7f1d1d40',
            padding: '2px 6px',
            borderRadius: 4,
            border: '1px solid #ef444460',
          }}
        >
          CRITICAL BREACH
        </span>
      </div>

      <div style={{ margin: `${Spacing.scale.md}px 0` }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>
          SIGNAL DETECTED
        </div>
        <div style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, color: '#f472b6', marginTop: 4 }}>
          PAYLOAD INFILTRATION COMPLETE // VECTOR DISPLACEMENT
        </div>
      </div>

      <div style={{ display: 'flex', gap: Spacing.scale.md, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 6, backgroundColor: Colors.dark.surface2, borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '98%', height: '100%', backgroundColor: '#ec4899' }} />
        </div>
        <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: '#ec4899' }}>
          98.9% SYNC
        </span>
      </div>
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: Colors.dark.surface1,
        borderRadius: Spacing.radius.lg,
        border: `1px solid ${Colors.border.default}`,
        padding: Spacing.scale.xl,
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.scale.xl,
      }}
    >
      {/* 1. Header & Live Telemetry Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: Spacing.scale.md }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm, marginBottom: 4 }}>
            <Zap size={20} color={Colors.accent.cyan} />
            <span style={{ ...Typography.headline.h3, color: Colors.text.primary }}>
              GlitchTransition
            </span>
            <span
              style={{
                fontSize: 11,
                fontFamily: Typography.fontFamily.mono,
                color: Colors.accent.cyan,
                backgroundColor: `${Colors.accent.cyan}18`,
                border: `1px solid ${Colors.accent.cyan}40`,
                padding: '2px 8px',
                borderRadius: Spacing.radius.xs,
              }}
            >
              PRNG SEED {seed}
            </span>
          </div>
          <p style={{ ...Typography.body.small, color: Colors.text.secondary, maxWidth: 640 }}>
            Deterministic digital glitch distortion supporting RGB channel separation, horizontal slice displacement,
            vertical jitter, digital noise blocks, and CRT scanlines without third-party dependencies.
          </p>
        </div>

        {/* Realtime Telemetry Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: Spacing.scale.md,
            backgroundColor: Colors.dark.surface2,
            padding: `${Spacing.scale.sm}px ${Spacing.scale.md}px`,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
            fontFamily: Typography.fontFamily.mono,
            fontSize: 11,
          }}
        >
          <div>
            <span style={{ color: Colors.text.tertiary }}>FRAME: </span>
            <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>{frame}</span>
            <span style={{ color: Colors.text.tertiary }}> | FPS: {fps}</span>
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: Colors.border.default }} />
          <div>
            <span style={{ color: Colors.text.tertiary }}>ENV: </span>
            <span style={{ color: '#ec4899', fontWeight: 700 }}>{metrics.envelope.toFixed(2)}</span>
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: Colors.border.default }} />
          <div>
            <span style={{ color: Colors.text.tertiary }}>RGB: </span>
            <span style={{ color: Colors.accent.emerald, fontWeight: 700 }}>
              {metrics.rgbOffsetX !== 0 ? `${metrics.rgbOffsetX}px` : 'OFF'}
            </span>
          </div>
          <div style={{ width: 1, height: 16, backgroundColor: Colors.border.default }} />
          <div>
            <span style={{ color: metrics.isGlitchFrame ? '#ef4444' : Colors.text.tertiary, fontWeight: 700 }}>
              {metrics.isGlitchFrame ? '● GLITCH ACTIVE' : '○ IDLE'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Canvas Live Preview */}
      <div
        style={{
          width: '100%',
          minHeight: 280,
          backgroundColor: '#05070a',
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: Spacing.scale.xl,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 70%), linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 32px 32px, 32px 32px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 540, height: 210, position: 'relative' }}>
          <GlitchTransition
            mode={mode}
            intensity={intensity}
            frequency={frequency}
            duration={duration}
            sliceCount={sliceCount}
            pixelSize={pixelSize}
            seed={seed}
            enableRgbSplit={enableRgbSplit}
            enableSlices={enableSlices}
            enableJitter={enableJitter}
            enableNoise={enableNoise}
            enableScanlines={enableScanlines}
            enableFlicker={enableFlicker}
            reverse={reverse}
            fromContent={renderLayerA()}
            toContent={renderLayerB()}
            style={{ width: '100%', height: '100%' }}
          >
            {contentPreset === 'replace-cut' || mode === 'replace'
              ? [renderLayerA(), renderLayerB()]
              : contentPreset === 'badge'
                ? renderLayerB()
                : renderLayerA()}
          </GlitchTransition>
        </div>
      </div>

      {/* 3. Controls Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: Spacing.scale.lg,
        }}
      >
        {/* Panel 1: Transition Mode */}
        <div
          style={{
            backgroundColor: Colors.dark.surface2,
            padding: Spacing.scale.md,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.sm }}>
            <Tv size={14} color={Colors.accent.cyan} />
            <span style={{ ...Typography.caption.eyebrow, color: Colors.text.primary }}>
              TRANSITION MODE
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {(['replace', 'in', 'out', 'burst', 'continuous'] as GlitchTransitionMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                style={{
                  padding: '6px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${mode === m ? Colors.accent.cyan : Colors.border.default}`,
                  backgroundColor: mode === m ? `${Colors.accent.cyan}25` : Colors.dark.surface1,
                  color: mode === m ? Colors.accent.cyan : Colors.text.secondary,
                  fontFamily: Typography.fontFamily.mono,
                  fontSize: 11,
                  fontWeight: mode === m ? 700 : 500,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <div style={{ marginTop: Spacing.scale.md }}>
            <div style={{ ...Typography.caption.eyebrow, color: Colors.text.tertiary, marginBottom: 6 }}>
              DEMO CONTENT PRESET
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
              {DEMO_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setContentPreset(p.id)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: Spacing.radius.xs,
                    border: `1px solid ${contentPreset === p.id ? '#ec4899' : Colors.border.default}`,
                    backgroundColor: contentPreset === p.id ? 'rgba(236, 72, 153, 0.15)' : Colors.dark.surface1,
                    color: contentPreset === p.id ? '#ec4899' : Colors.text.secondary,
                    fontFamily: Typography.fontFamily.mono,
                    fontSize: 10,
                    cursor: 'pointer',
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 2: Distortion Dynamics & Intensity */}
        <div
          style={{
            backgroundColor: Colors.dark.surface2,
            padding: Spacing.scale.md,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.sm }}>
            <Sliders size={14} color={Colors.accent.cyan} />
            <span style={{ ...Typography.caption.eyebrow, color: Colors.text.primary }}>
              DISTORTION DYNAMICS
            </span>
          </div>

          {/* Intensity selector */}
          <div style={{ marginBottom: Spacing.scale.sm }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: Typography.fontFamily.mono, marginBottom: 4 }}>
              <span style={{ color: Colors.text.secondary }}>Intensity:</span>
              <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>{intensity}x</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0.5, 1.0, 1.5, 2.0].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setIntensity(lvl)}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    borderRadius: Spacing.radius.xs,
                    border: `1px solid ${intensity === lvl ? Colors.accent.cyan : Colors.border.default}`,
                    backgroundColor: intensity === lvl ? Colors.accent.cyan : Colors.dark.surface1,
                    color: intensity === lvl ? '#000000' : Colors.text.secondary,
                    fontFamily: Typography.fontFamily.mono,
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {lvl}x
                </button>
              ))}
            </div>
          </div>

          {/* Frequency selector */}
          <div style={{ marginBottom: Spacing.scale.sm }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: Typography.fontFamily.mono, marginBottom: 4 }}>
              <span style={{ color: Colors.text.secondary }}>Glitch Frequency:</span>
              <span style={{ color: '#ec4899', fontWeight: 700 }}>{Math.round(frequency * 100)}%</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0.3, 0.6, 0.85, 1.0].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    borderRadius: Spacing.radius.xs,
                    border: `1px solid ${frequency === freq ? '#ec4899' : Colors.border.default}`,
                    backgroundColor: frequency === freq ? '#ec4899' : Colors.dark.surface1,
                    color: frequency === freq ? '#000000' : Colors.text.secondary,
                    fontFamily: Typography.fontFamily.mono,
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {freq === 1.0 ? 'MAX' : `${Math.round(freq * 100)}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Slices & Pixel Size */}
          <div style={{ display: 'flex', gap: Spacing.scale.sm }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginBottom: 4 }}>
                SLICES: {sliceCount}
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[6, 10, 16].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSliceCount(s)}
                    style={{
                      flex: 1,
                      padding: '3px 4px',
                      borderRadius: Spacing.radius.xs,
                      border: `1px solid ${sliceCount === s ? Colors.accent.emerald : Colors.border.default}`,
                      backgroundColor: sliceCount === s ? Colors.dark.surface3 : Colors.dark.surface1,
                      color: sliceCount === s ? Colors.accent.emerald : Colors.text.secondary,
                      fontSize: 10,
                      fontFamily: Typography.fontFamily.mono,
                      cursor: 'pointer',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginBottom: 4 }}>
                PIXEL STEPS: {pixelSize}px
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 4, 8].map((ps) => (
                  <button
                    key={ps}
                    type="button"
                    onClick={() => setPixelSize(ps)}
                    style={{
                      flex: 1,
                      padding: '3px 4px',
                      borderRadius: Spacing.radius.xs,
                      border: `1px solid ${pixelSize === ps ? Colors.accent.emerald : Colors.border.default}`,
                      backgroundColor: pixelSize === ps ? Colors.dark.surface3 : Colors.dark.surface1,
                      color: pixelSize === ps ? Colors.accent.emerald : Colors.text.secondary,
                      fontSize: 10,
                      fontFamily: Typography.fontFamily.mono,
                      cursor: 'pointer',
                    }}
                  >
                    {ps === 1 ? '1px' : `${ps}px`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Individual Effect Toggles */}
        <div
          style={{
            backgroundColor: Colors.dark.surface2,
            padding: Spacing.scale.md,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.sm }}>
            <Activity size={14} color={Colors.accent.cyan} />
            <span style={{ ...Typography.caption.eyebrow, color: Colors.text.primary }}>
              EFFECT TOGGLES
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {[
              { label: 'RGB Chromatic', state: enableRgbSplit, setter: setEnableRgbSplit },
              { label: 'Horizontal Slices', state: enableSlices, setter: setEnableSlices },
              { label: 'Vertical Jitter', state: enableJitter, setter: setEnableJitter },
              { label: 'Noise Blocks', state: enableNoise, setter: setEnableNoise },
              { label: 'CRT Scanlines', state: enableScanlines, setter: setEnableScanlines },
              { label: 'Strobe Flicker', state: enableFlicker, setter: setEnableFlicker },
            ].map((toggle) => (
              <button
                key={toggle.label}
                type="button"
                onClick={() => toggle.setter(!toggle.state)}
                style={{
                  padding: '6px 8px',
                  borderRadius: Spacing.radius.xs,
                  border: `1px solid ${toggle.state ? Colors.accent.emerald : Colors.border.default}`,
                  backgroundColor: toggle.state ? 'rgba(16, 185, 129, 0.15)' : Colors.dark.surface1,
                  color: toggle.state ? Colors.accent.emerald : Colors.text.tertiary,
                  fontFamily: Typography.fontFamily.mono,
                  fontSize: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <span>{toggle.label}</span>
                <span style={{ fontWeight: 700 }}>{toggle.state ? 'ON' : 'OFF'}</span>
              </button>
            ))}
          </div>

          {/* Seed selector */}
          <div style={{ marginTop: Spacing.scale.md }}>
            <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary, marginBottom: 4 }}>
              DETERMINISTIC SEED
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[42, 1337, 2077, 9999].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSeed(s)}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    borderRadius: Spacing.radius.xs,
                    border: `1px solid ${seed === s ? Colors.accent.cyan : Colors.border.default}`,
                    backgroundColor: seed === s ? Colors.dark.surface3 : Colors.dark.surface1,
                    color: seed === s ? Colors.accent.cyan : Colors.text.secondary,
                    fontFamily: Typography.fontFamily.mono,
                    fontSize: 10,
                    cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 4: Duration & Reverse */}
        <div
          style={{
            backgroundColor: Colors.dark.surface2,
            padding: Spacing.scale.md,
            borderRadius: Spacing.radius.sm,
            border: `1px solid ${Colors.border.default}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.sm }}>
              <Layers size={14} color={Colors.accent.cyan} />
              <span style={{ ...Typography.caption.eyebrow, color: Colors.text.primary }}>
                TIMING & ENVELOPE
              </span>
            </div>

            <div style={{ marginBottom: Spacing.scale.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: Typography.fontFamily.mono, marginBottom: 4 }}>
                <span style={{ color: Colors.text.secondary }}>Duration:</span>
                <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>{duration} frames</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[20, 30, 45, 60].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    style={{
                      flex: 1,
                      padding: '4px 6px',
                      borderRadius: Spacing.radius.xs,
                      border: `1px solid ${duration === d ? Colors.accent.cyan : Colors.border.default}`,
                      backgroundColor: duration === d ? Colors.accent.cyan : Colors.dark.surface1,
                      color: duration === d ? '#000000' : Colors.text.secondary,
                      fontFamily: Typography.fontFamily.mono,
                      fontSize: 10,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {d}f
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setReverse(!reverse)}
              style={{
                width: '100%',
                marginTop: Spacing.scale.xs,
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                border: `1px solid ${reverse ? Colors.accent.emerald : Colors.border.default}`,
                backgroundColor: reverse ? 'rgba(16, 185, 129, 0.15)' : Colors.dark.surface1,
                color: reverse ? Colors.accent.emerald : Colors.text.secondary,
                fontFamily: Typography.fontFamily.mono,
                fontSize: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                cursor: 'pointer',
              }}
            >
              <RotateCw size={12} />
              <span>REVERSE TIMELINE: {reverse ? 'ENABLED' : 'DISABLED'}</span>
            </button>
          </div>

          <div
            style={{
              padding: Spacing.scale.xs,
              backgroundColor: Colors.dark.surface1,
              borderRadius: Spacing.radius.xs,
              fontFamily: Typography.fontFamily.mono,
              fontSize: 10,
              color: Colors.text.tertiary,
              lineHeight: 1.4,
              marginTop: Spacing.scale.sm,
            }}
          >
            Phase: <strong style={{ color: Colors.text.primary }}>{metrics.phase}</strong> | Progress:{' '}
            <strong style={{ color: Colors.text.primary }}>{Math.round(metrics.progress * 100)}%</strong> | Slices:{' '}
            <strong style={{ color: Colors.text.primary }}>{metrics.slices.length}</strong>
          </div>
        </div>
      </div>

      {/* 4. Generated Remotion Code Snippet */}
      <div
        style={{
          backgroundColor: Colors.dark.surface2,
          padding: Spacing.scale.md,
          borderRadius: Spacing.radius.sm,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, marginBottom: Spacing.scale.xs }}>
          <Sparkles size={14} color={Colors.accent.cyan} />
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
            REMOTION CODE IMPLEMENTATION
          </span>
        </div>
        <pre
          style={{
            margin: 0,
            padding: Spacing.scale.sm,
            backgroundColor: '#05070a',
            borderRadius: Spacing.radius.xs,
            border: `1px solid ${Colors.border.default}`,
            fontFamily: Typography.fontFamily.mono,
            fontSize: 11,
            color: '#a5f3fc',
            overflowX: 'auto',
            lineHeight: 1.5,
          }}
        >
          {`<GlitchTransition
  mode="${mode}"
  intensity={${intensity}}
  frequency={${frequency}}
  duration={${duration}}
  sliceCount={${sliceCount}}
  pixelSize={${pixelSize}}
  seed={${typeof seed === 'string' ? `"${seed}"` : seed}}
  enableRgbSplit={${enableRgbSplit}}
  enableSlices={${enableSlices}}
  enableJitter={${enableJitter}}
  enableNoise={${enableNoise}}
  enableScanlines={${enableScanlines}}
  enableFlicker={${enableFlicker}}${reverse ? '\n  reverse={true}' : ''}
>
  <YourSceneContent />
</GlitchTransition>`}
        </pre>
      </div>
    </div>
  );
};
