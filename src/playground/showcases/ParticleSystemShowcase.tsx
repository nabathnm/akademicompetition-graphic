/**
 * ParticleSystem Showcase
 * Interactive development and evaluation harness for the ParticleSystem component.
 * Demonstrates deterministic seeded generation, diverse geometric particle shapes,
 * spatial topologies, procedural motion modes (float, rise, fall, burst, vortex), and commercial UI backdrops.
 * Layer 1 / Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame } from 'remotion';
import { Sliders, Sparkles, Award, ShieldCheck, RefreshCw } from 'lucide-react';
import { ParticleSystem } from '../../components/graphics/ParticleSystem.tsx';
import type {
  ParticleDistribution,
  ParticleMotionMode,
  ParticleShape,
} from '../../components/graphics/types.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

interface ParticlePreset {
  id: string;
  label: string;
  particleCount: number;
  shape: ParticleShape | ParticleShape[];
  distribution: ParticleDistribution;
  motionMode: ParticleMotionMode;
  color: string[];
  size: [number, number];
  speed: [number, number];
  seed: string | number;
}

const PRESET_SYSTEMS: ParticlePreset[] = [
  {
    id: 'cyber-ambient',
    label: 'Cyber Ambient Orbs',
    particleCount: 35,
    shape: ['circle', 'ring'],
    distribution: 'random',
    motionMode: 'float',
    color: [Colors.accent.cyan, Colors.accent.brand, '#ffffff'],
    size: [3, 8],
    speed: [0.6, 1.4],
    seed: 'cyber-orbs-101',
  },
  {
    id: 'golden-sparkles',
    label: 'Golden Sparkles',
    particleCount: 40,
    shape: ['star', 'cross'],
    distribution: 'random',
    motionMode: 'rise',
    color: [Colors.accent.amber, '#FFE27A', '#FFFFFF'],
    size: [4, 10],
    speed: [0.8, 1.8],
    seed: 'golden-glitter-88',
  },
  {
    id: 'celebration-burst',
    label: 'Celebration Burst',
    particleCount: 50,
    shape: ['square', 'triangle', 'star', 'circle'],
    distribution: 'circular',
    motionMode: 'burst',
    color: [Colors.accent.emerald, Colors.accent.amber, Colors.accent.cyan, Colors.accent.crimson],
    size: [4, 9],
    speed: [1.2, 2.5],
    seed: 'celebration-burst-7',
  },
  {
    id: 'falling-snow',
    label: 'Winter Flakes',
    particleCount: 45,
    shape: ['circle', 'cross'],
    distribution: 'random',
    motionMode: 'fall',
    color: ['#ffffff', '#E0F2FE', '#BAE6FD'],
    size: [2, 6],
    speed: [0.7, 1.6],
    seed: 'snowfall-drift-42',
  },
  {
    id: 'orbital-vortex',
    label: 'Orbital Vortex',
    particleCount: 40,
    shape: ['circle', 'star'],
    distribution: 'radial',
    motionMode: 'vortex',
    color: [Colors.accent.electricViolet, Colors.accent.cyan, '#ffffff'],
    size: [3, 7],
    speed: [1.0, 2.0],
    seed: 'vortex-core-99',
  },
  {
    id: 'dense-field',
    label: 'Dense Nebula Field',
    particleCount: 100,
    shape: 'circle',
    distribution: 'random',
    motionMode: 'float',
    color: [Colors.accent.cyan, Colors.accent.brand, Colors.accent.emerald],
    size: [2, 5],
    speed: [0.4, 1.0],
    seed: 'nebula-dense-500',
  },
];

const ALL_SHAPES: Array<{ id: ParticleShape; label: string }> = [
  { id: 'circle', label: 'Circle' },
  { id: 'square', label: 'Square' },
  { id: 'ring', label: 'Ring' },
  { id: 'star', label: 'Star' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'cross', label: 'Cross' },
];

const ALL_MODES: Array<{ id: ParticleMotionMode; label: string }> = [
  { id: 'float', label: 'Float' },
  { id: 'rise', label: 'Rise' },
  { id: 'fall', label: 'Fall' },
  { id: 'drift', label: 'Drift' },
  { id: 'burst', label: 'Burst' },
  { id: 'vortex', label: 'Vortex' },
  { id: 'none', label: 'Static' },
];

export const ParticleSystemShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();

  // Sandbox interactive controls state
  const [selectedPreset, setSelectedPreset] = useState<ParticlePreset>(PRESET_SYSTEMS[0]);
  const [particleCount, setParticleCount] = useState<number>(selectedPreset.particleCount);
  const [selectedShape, setSelectedShape] = useState<ParticleShape | 'mixed'>('circle');
  const [selectedMode, setSelectedMode] = useState<ParticleMotionMode>(selectedPreset.motionMode);
  const [seedIndex, setSeedIndex] = useState<number>(42);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [wobble, setWobble] = useState<boolean>(true);
  const [fadeInOut, setFadeInOut] = useState<boolean>(true);

  const activeShape = selectedShape === 'mixed' ? ['circle', 'ring', 'star', 'cross'] as ParticleShape[] : selectedShape;

  const handlePresetSelect = (preset: ParticlePreset) => {
    setSelectedPreset(preset);
    setParticleCount(preset.particleCount);
    setSelectedMode(preset.motionMode);
    setSelectedShape(Array.isArray(preset.shape) ? 'mixed' : preset.shape);
  };

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
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>● DETERMINISTIC PARTICLE ENGINE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>
            PRESET: <strong style={{ color: Colors.accent.cyan }}>{selectedPreset.label}</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.md }}>
          <span>
            SEED: <strong style={{ color: Colors.accent.amber }}>#{seedIndex}</strong>
          </span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span>
            COUNT: <strong style={{ color: Colors.accent.emerald }}>{particleCount}</strong>
          </span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span>
            FRAME: <strong style={{ color: Colors.accent.brand }}>{currentFrame}</strong>
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
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 380,
            backgroundColor: '#070a12',
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.subtle}`,
            overflow: 'hidden',
          }}
        >
          {/* Subtle Depth Radial Glow Backdrop */}
          <div
            style={{
              position: 'absolute',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 209, 255, 0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <ParticleSystem
            seed={seedIndex}
            particleCount={particleCount}
            shape={activeShape}
            distribution={selectedPreset.distribution}
            motionMode={selectedMode}
            color={selectedPreset.color}
            size={selectedPreset.size}
            speed={[selectedPreset.speed[0] * speedMultiplier, selectedPreset.speed[1] * speedMultiplier]}
            wobble={wobble}
            fadeInOut={fadeInOut}
            bounds={{ width: 560, height: 380 }}
            durationInFrames={60}
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
            <span>DETERMINISM: 100% (SEED #{seedIndex})</span>
            <span>TOPOLOGY: {selectedPreset.distribution.toUpperCase()}</span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs, fontWeight: 700, color: Colors.text.primary }}>
              <Sliders size={14} color={Colors.accent.cyan} />
              <span>PARTICLE SANDBOX CONTROLS</span>
            </div>
            <button
              type="button"
              onClick={() => setSeedIndex((s) => s + 1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.accent.cyan,
                fontSize: 10,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={10} />
              <span>New Seed</span>
            </button>
          </div>

          {/* Preset Selector */}
          <div>
            <label style={{ display: 'block', marginBottom: 4, color: Colors.text.secondary }}>
              Simulation Preset:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4 }}>
              {PRESET_SYSTEMS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
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

          {/* Particle Count Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: Colors.text.secondary, marginBottom: 4 }}>
              <span>Particle Count:</span>
              <span style={{ color: Colors.accent.emerald, fontFamily: Typography.fontFamily.mono }}>{particleCount}</span>
            </div>
            <input
              type="range"
              min={10}
              max={120}
              step={5}
              value={particleCount}
              onChange={(e) => setParticleCount(Number(e.target.value))}
              style={{ width: '100%', accentColor: Colors.accent.emerald }}
            />
          </div>

          {/* Motion Mode Selector */}
          <div>
            <label style={{ display: 'block', marginBottom: 4, color: Colors.text.secondary }}>
              Motion Simulation Mode:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
              {ALL_MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMode(m.id)}
                  style={{
                    padding: '4px 6px',
                    fontSize: 10,
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedMode === m.id ? Colors.accent.brand : Colors.dark.surface3,
                    border: `1px solid ${selectedMode === m.id ? Colors.accent.brand : Colors.border.default}`,
                    color: selectedMode === m.id ? '#ffffff' : Colors.text.secondary,
                    fontWeight: selectedMode === m.id ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Particle Shape Selector */}
          <div>
            <label style={{ display: 'block', marginBottom: 4, color: Colors.text.secondary }}>
              Particle Geometry Shape:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {ALL_SHAPES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedShape(s.id)}
                  style={{
                    padding: '4px 6px',
                    fontSize: 10,
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedShape === s.id ? Colors.accent.amber : Colors.dark.surface3,
                    border: `1px solid ${selectedShape === s.id ? Colors.accent.amber : Colors.border.default}`,
                    color: selectedShape === s.id ? '#000000' : Colors.text.secondary,
                    fontWeight: selectedShape === s.id ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speed Multiplier Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: Colors.text.secondary, marginBottom: 4 }}>
              <span>Speed Factor:</span>
              <span style={{ color: Colors.accent.cyan, fontFamily: Typography.fontFamily.mono }}>{speedMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={2.5}
              step={0.1}
              value={speedMultiplier}
              onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
              style={{ width: '100%', accentColor: Colors.accent.cyan }}
            />
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', gap: Spacing.scale.md, alignItems: 'center', paddingTop: 4 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={wobble}
                onChange={(e) => setWobble(e.target.checked)}
                style={{ accentColor: Colors.accent.emerald }}
              />
              <span>Harmonic Wobble</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: Colors.text.secondary }}>
              <input
                type="checkbox"
                checked={fadeInOut}
                onChange={(e) => setFadeInOut(e.target.checked)}
                style={{ accentColor: Colors.accent.emerald }}
              />
              <span>Lifecycle Fade</span>
            </label>
          </div>
        </div>
      </div>

      {/* SECTION 3: Animation Capabilities Matrix */}
      <div>
        <div style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan, marginBottom: Spacing.scale.sm }}>
          PROCEDURAL KINETICS SUITE (DETERMINISTIC SIMULATIONS)
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: Spacing.scale.md,
          }}
        >
          {/* Card 1: Sparse Floating Orbs */}
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
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <ParticleSystem
              seed="floating-orbs-1"
              particleCount={20}
              shape="circle"
              motionMode="float"
              color={[Colors.accent.cyan, Colors.accent.brand]}
              bounds={{ width: 280, height: 120 }}
            />
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <strong style={{ fontSize: 12, color: Colors.text.primary, display: 'block' }}>Sparse Floating Orbs</strong>
              <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                Gentle ambient drift with harmonic sway
              </span>
            </div>
          </div>

          {/* Card 2: Rising Golden Embers */}
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
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <ParticleSystem
              seed="rising-embers-2"
              particleCount={25}
              shape={['star', 'circle']}
              motionMode="rise"
              color={[Colors.accent.amber, '#FFE27A']}
              bounds={{ width: 280, height: 120 }}
            />
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <strong style={{ fontSize: 12, color: Colors.text.primary, display: 'block' }}>Rising Golden Embers</strong>
              <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                Upward thermal floating with organic sway
              </span>
            </div>
          </div>

          {/* Card 3: Falling Flakes */}
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
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <ParticleSystem
              seed="falling-flakes-3"
              particleCount={25}
              shape={['cross', 'circle']}
              motionMode="fall"
              color={['#ffffff', '#BAE6FD']}
              bounds={{ width: 280, height: 120 }}
            />
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <strong style={{ fontSize: 12, color: Colors.text.primary, display: 'block' }}>Falling Flakes</strong>
              <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                Downward snow & dust precipitation
              </span>
            </div>
          </div>

          {/* Card 4: Radial Burst */}
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
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <ParticleSystem
              seed="firework-burst-4"
              particleCount={30}
              shape={['star', 'square']}
              motionMode="burst"
              color={[Colors.accent.emerald, Colors.accent.amber, Colors.accent.cyan]}
              bounds={{ width: 280, height: 120 }}
            />
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <strong style={{ fontSize: 12, color: Colors.text.primary, display: 'block' }}>Radial Celebration Burst</strong>
              <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                Outward expansion with velocity damping
              </span>
            </div>
          </div>

          {/* Card 5: Orbital Vortex */}
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
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <ParticleSystem
              seed="vortex-core-5"
              particleCount={30}
              shape="ring"
              motionMode="vortex"
              color={[Colors.accent.electricViolet, Colors.accent.cyan]}
              bounds={{ width: 280, height: 120 }}
            />
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <strong style={{ fontSize: 12, color: Colors.text.primary, display: 'block' }}>Orbital Spiral Vortex</strong>
              <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                Angular spiraling around center axis
              </span>
            </div>
          </div>

          {/* Card 6: Directional Drift */}
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
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <ParticleSystem
              seed="directional-drift-6"
              particleCount={25}
              shape={['triangle', 'circle']}
              motionMode="drift"
              direction="drift"
              color={[Colors.accent.brand, Colors.accent.cyan]}
              bounds={{ width: 280, height: 120 }}
            />
            <div style={{ textAlign: 'center', zIndex: 1 }}>
              <strong style={{ fontSize: 12, color: Colors.text.primary, display: 'block' }}>Directional Wind Drift</strong>
              <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                Linear motion vector with atmospheric flutter
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
          {/* Composition A: Premium Metallic Card */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.md,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <Sparkles size={16} color={Colors.accent.amber} />
              <strong style={{ fontSize: 13, color: Colors.text.primary }}>VIP Card Ambient Atmosphere</strong>
            </div>

            <div
              style={{
                position: 'relative',
                height: 150,
                backgroundColor: '#0a0d14',
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <ParticleSystem
                seed="vip-card-ambient"
                particleCount={25}
                shape={['star', 'circle']}
                motionMode="float"
                color={[Colors.accent.amber, '#ffffff']}
                size={[2, 6]}
                bounds={{ width: 340, height: 150 }}
              />

              {/* Elevated Card Floating in Center */}
              <div
                style={{
                  position: 'relative',
                  width: 180,
                  height: 100,
                  borderRadius: Spacing.radius.sm,
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  border: `1px solid ${Colors.accent.amber}`,
                  padding: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: Colors.accent.amber, letterSpacing: 1 }}>UBER BLACK</span>
                  <Sparkles size={12} color={Colors.accent.amber} />
                </div>
                <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
                  •••• 8842
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
              <span>Ambient Depth Effect</span>
              <span style={{ color: Colors.accent.amber, fontWeight: 700 }}>● ACTIVE PARTICLES</span>
            </div>
          </div>

          {/* Composition B: Achievement Celebration */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.md,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <Award size={16} color={Colors.accent.emerald} />
              <strong style={{ fontSize: 13, color: Colors.text.primary }}>Achievement Celebration</strong>
            </div>

            <div
              style={{
                position: 'relative',
                height: 150,
                backgroundColor: '#0a0d14',
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <ParticleSystem
                seed="achievement-burst"
                particleCount={35}
                shape={['square', 'star', 'circle']}
                motionMode="burst"
                color={[Colors.accent.emerald, Colors.accent.amber, Colors.accent.cyan]}
                bounds={{ width: 340, height: 150 }}
              />

              {/* Center Medal Badge */}
              <div
                style={{
                  position: 'relative',
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  backgroundColor: Colors.accent.emerald,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(14, 131, 69, 0.4)',
                }}
              >
                <Award size={28} color="#ffffff" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
              <span>100 Rides Milestone</span>
              <span style={{ color: Colors.accent.emerald, fontWeight: 700 }}>● UNLOCKED</span>
            </div>
          </div>

          {/* Composition C: Shield Protective Field */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.surface1,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.md,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.md,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <ShieldCheck size={16} color={Colors.accent.cyan} />
              <strong style={{ fontSize: 13, color: Colors.text.primary }}>Protective Aura Field</strong>
            </div>

            <div
              style={{
                position: 'relative',
                height: 150,
                backgroundColor: '#0a0d14',
                borderRadius: Spacing.radius.sm,
                border: `1px solid ${Colors.border.subtle}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <ParticleSystem
                seed="shield-vortex-field"
                particleCount={30}
                shape={['ring', 'circle']}
                motionMode="vortex"
                color={[Colors.accent.cyan, Colors.accent.brand]}
                bounds={{ width: 340, height: 150 }}
              />

              {/* Security Shield Icon */}
              <div
                style={{
                  position: 'relative',
                  width: 50,
                  height: 50,
                  borderRadius: Spacing.radius.sm,
                  backgroundColor: 'rgba(0, 209, 255, 0.15)',
                  border: `1px solid ${Colors.accent.cyan}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={26} color={Colors.accent.cyan} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
              <span>Real-Time Defense Orbit</span>
              <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>● SECURE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
