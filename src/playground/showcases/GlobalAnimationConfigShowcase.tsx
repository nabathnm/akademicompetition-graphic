/**
 * GlobalAnimationConfig Showcase
 * Interactive motion graphics playground demonstrating:
 * - Centralized animation configuration defaults
 * - Dynamic global speed multipliers (0.5x to 3.0x)
 * - Custom transition durations and stagger cascades
 * - 4-tier precedence system with component-level overrides
 * - Reduced-motion / static-preview accessibility mode
 *
 * Layer 1 / Layer 4 of the Motion Graphics Framework.
 */

import React, { useMemo, useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  CheckCircle,
  Eye,
  EyeOff,
  FastForward,
  Gauge,
  Layers,
  Play,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import {
  AnimationConfigProvider,
  useAnimationConfig,
} from '../../config/animation/AnimationConfigContext.tsx';
import type { GlobalAnimationConfig } from '../../config/animation/animationConfigTypes.ts';
import { resolveEasing, type EasingPresetName } from '../../utils/animation/easing.ts';
import { formatTimecode } from '../../utils/timing/frame.ts';

export type AnimationConfigPreset =
  | 'default-config'
  | 'high-speed'
  | 'cinematic-slow'
  | 'custom-transitions'
  | 'component-override'
  | 'reduced-motion';

export const GlobalAnimationConfigShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const compDuration = videoConfig?.durationInFrames ?? 180;
  const fps = videoConfig?.fps ?? 30;

  // Preset state
  const [preset, setPreset] = useState<AnimationConfigPreset>('default-config');

  // Interactive controls
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [defaultDuration, setDefaultDuration] = useState<number>(18);
  const [transitionDuration, setTransitionDuration] = useState<number>(15);
  const [staggerInterval, setStaggerInterval] = useState<number>(6);
  const [defaultEasing, setDefaultEasing] = useState<EasingPresetName>('easeOutCubic');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [hasComponentOverride, setHasComponentOverride] = useState<boolean>(false);

  // Apply preset configs
  const applyPreset = (newPreset: AnimationConfigPreset) => {
    setPreset(newPreset);
    switch (newPreset) {
      case 'default-config':
        setSpeedMultiplier(1.0);
        setDefaultDuration(18);
        setTransitionDuration(15);
        setStaggerInterval(6);
        setDefaultEasing('easeOutCubic');
        setReducedMotion(false);
        setHasComponentOverride(false);
        break;

      case 'high-speed':
        setSpeedMultiplier(2.0);
        setDefaultDuration(18);
        setTransitionDuration(10);
        setStaggerInterval(3);
        setDefaultEasing('easeOutExpo');
        setReducedMotion(false);
        setHasComponentOverride(false);
        break;

      case 'cinematic-slow':
        setSpeedMultiplier(0.5);
        setDefaultDuration(24);
        setTransitionDuration(30);
        setStaggerInterval(10);
        setDefaultEasing('easeInOutCubic');
        setReducedMotion(false);
        setHasComponentOverride(false);
        break;

      case 'custom-transitions':
        setSpeedMultiplier(1.0);
        setDefaultDuration(14);
        setTransitionDuration(35); // Long dramatic transition
        setStaggerInterval(5);
        setDefaultEasing('easeOutCubic');
        setReducedMotion(false);
        setHasComponentOverride(false);
        break;

      case 'component-override':
        setSpeedMultiplier(1.0);
        setDefaultDuration(20);
        setTransitionDuration(15);
        setStaggerInterval(6);
        setDefaultEasing('linear');
        setReducedMotion(false);
        setHasComponentOverride(true); // Component explicitly forces 8f duration
        break;

      case 'reduced-motion':
        setSpeedMultiplier(1.0);
        setDefaultDuration(18);
        setTransitionDuration(15);
        setStaggerInterval(6);
        setDefaultEasing('easeOutCubic');
        setReducedMotion(true);
        setHasComponentOverride(false);
        break;
    }
  };

  // Active composition-level config
  const compositionConfig: GlobalAnimationConfig = useMemo(() => {
    return {
      speedMultiplier,
      defaultDuration,
      defaultTransitionDuration: transitionDuration,
      defaultStaggerInterval: staggerInterval,
      defaultEasing,
      reducedMotion,
    };
  }, [speedMultiplier, defaultDuration, transitionDuration, staggerInterval, defaultEasing, reducedMotion]);

  return (
    <AnimationConfigProvider value={compositionConfig}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#090D16',
          color: '#F8FAFC',
          fontFamily: Typography.fontFamily.sans,
          padding: '32px 40px',
          boxSizing: 'border-box',
        }}
      >
        {/* 1. Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div
              style={{
                padding: 6,
                borderRadius: 8,
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: '#3B82F6',
              }}
            >
              <Sliders size={20} />
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
              GlobalAnimationConfig Control Center
            </h1>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 12,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                color: '#3B82F6',
                letterSpacing: '0.05em',
              }}
            >
              LAYER 1 / LAYER 4 CONFIG
            </span>
          </div>
          <p style={{ margin: 0, color: Colors.text.tertiary, fontSize: 14 }}>
            Centralized animation controller standardizing durations, easings, speed multipliers,
            and reduced-motion modes with predictable 4-tier precedence.
          </p>
        </div>

        {/* 2. Preset Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {(
            [
              { id: 'default-config', label: 'Framework Defaults (18f, 1.0x)', icon: Play },
              { id: 'high-speed', label: 'High Speed (2.0x Fast Pacing)', icon: FastForward },
              { id: 'cinematic-slow', label: 'Cinematic Slow (0.5x Luxury)', icon: Gauge },
              { id: 'custom-transitions', label: 'Long Scene Transitions (35f)', icon: Layers },
              { id: 'component-override', label: 'Component Override Precedence', icon: Zap },
              { id: 'reduced-motion', label: 'Reduced Motion (Instant Preview)', icon: EyeOff },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isSelected = preset === item.id;
            return (
              <button
                key={item.id}
                onClick={() => applyPreset(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 500,
                  backgroundColor: isSelected ? '#3B82F6' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#FFFFFF' : '#CBD5E1',
                  border: isSelected ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* 3. Controls Panel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: 16,
            marginBottom: 24,
            padding: 16,
            backgroundColor: '#0F172A',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Speed Multiplier */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
              SPEED MULTIPLIER ({speedMultiplier}x)
            </label>
            <select
              value={speedMultiplier}
              onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 6,
                backgroundColor: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: 13,
              }}
            >
              <option value={0.5}>0.5x (Half Speed / Slow)</option>
              <option value={0.75}>0.75x</option>
              <option value={1.0}>1.0x (Standard)</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2.0}>2.0x (Double Speed / Snappy)</option>
              <option value={3.0}>3.0x (Hyper Speed)</option>
            </select>
          </div>

          {/* Default Duration */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
              DEFAULT DURATION ({defaultDuration}f)
            </label>
            <input
              type="range"
              min={5}
              max={45}
              value={defaultDuration}
              onChange={(e) => setDefaultDuration(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#3B82F6' }}
            />
          </div>

          {/* Transition Duration */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
              TRANSITION DURATION ({transitionDuration}f)
            </label>
            <input
              type="range"
              min={5}
              max={45}
              value={transitionDuration}
              onChange={(e) => setTransitionDuration(Number(e.target.value))}
              style={{ width: '100%', accentColor: Colors.accent.emerald }}
            />
          </div>

          {/* Stagger Interval */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
              STAGGER INTERVAL ({staggerInterval}f)
            </label>
            <input
              type="range"
              min={1}
              max={15}
              value={staggerInterval}
              onChange={(e) => setStaggerInterval(Number(e.target.value))}
              style={{ width: '100%', accentColor: Colors.accent.electricViolet }}
            />
          </div>

          {/* Default Easing */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
              DEFAULT EASING
            </label>
            <select
              value={defaultEasing}
              onChange={(e) => setDefaultEasing(e.target.value as EasingPresetName)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 6,
                backgroundColor: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: 13,
              }}
            >
              <option value="easeOutCubic">easeOutCubic</option>
              <option value="easeInOutCubic">easeInOutCubic</option>
              <option value="easeOutExpo">easeOutExpo</option>
              <option value="linear">linear</option>
              <option value="standard">standard (Brand)</option>
              <option value="emphasized">emphasized (Brand)</option>
            </select>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                style={{ accentColor: '#EF4444' }}
              />
              <span style={{ color: reducedMotion ? '#EF4444' : '#CBD5E1' }}>
                Reduced Motion Mode
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12 }}>
              <input
                type="checkbox"
                checked={hasComponentOverride}
                onChange={(e) => setHasComponentOverride(e.target.checked)}
                style={{ accentColor: Colors.accent.cyan }}
              />
              <span style={{ color: hasComponentOverride ? Colors.accent.cyan : '#CBD5E1' }}>
                Force Component Override (8f)
              </span>
            </label>
          </div>
        </div>

        {/* 4. Live Visual Stage & Precedence Telemetry */}
        <AnimatedStage
          frame={frame}
          fps={fps}
          compDuration={compDuration}
          hasComponentOverride={hasComponentOverride}
        />

        {/* 5. Precedence Architecture Table */}
        <div
          style={{
            padding: 20,
            backgroundColor: '#0F172A',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: 13,
            lineHeight: 1.6,
            color: Colors.text.tertiary,
          }}
        >
          <div style={{ color: '#F8FAFC', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="#3B82F6" />
            GlobalAnimationConfig Precedence Hierarchy:
          </div>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            <li>
              <strong>Tier 1 — Component-Level Overrides:</strong> Explicit props passed directly to a component (e.g. <code>&lt;AnimatedCard duration=&#123;8&#125; /&gt;</code>) take absolute precedence and are never overwritten by global defaults.
            </li>
            <li>
              <strong>Tier 2 — Scene-Level Configuration:</strong> Context provided by a scene wrapper (e.g. <code>&lt;SceneContainer /&gt;</code>) overrides composition-level settings for its child branch.
            </li>
            <li>
              <strong>Tier 3 — Composition-Level Configuration:</strong> Provided via <code>&lt;AdvertisementComposition animation=&#123;...&#125;&gt;</code> or <code>&lt;AnimationConfigProvider&gt;</code>.
            </li>
            <li>
              <strong>Tier 4 — Framework Defaults:</strong> Built-in <code>MOTION</code> design tokens calibrated at 18 frames duration and <code>easeOutCubic</code>.
            </li>
          </ol>
        </div>
      </div>
    </AnimationConfigProvider>
  );
};

interface AnimatedStageProps {
  frame: number;
  fps: number;
  compDuration: number;
  hasComponentOverride: boolean;
}

const AnimatedStage: React.FC<AnimatedStageProps> = ({
  frame,
  fps,
  compDuration,
  hasComponentOverride,
}) => {
  const { getDuration, getTransitionDuration, getStagger, getEasing, isReducedMotion } =
    useAnimationConfig();

  // Calculate effective durations via the hook
  const effectiveCardDuration = hasComponentOverride
    ? getDuration(8) // Explicit component override (8f)
    : getDuration(); // Inherited default duration

  const effectiveTransitionDuration = getTransitionDuration();
  const effectiveStagger = getStagger();
  const effectiveEasingName = getEasing();

  // Animation start frame
  const animStart = 20;

  // Card entrance progress
  const cardProgress = useMemo(() => {
    if (isReducedMotion) return 1.0;
    if (frame < animStart) return 0.0;
    if (effectiveCardDuration === 0) return 1.0;
    const progress = Math.min(1.0, (frame - animStart) / effectiveCardDuration);
    const easeFn = resolveEasing(effectiveEasingName);
    return easeFn ? easeFn(progress) : progress;
  }, [frame, animStart, effectiveCardDuration, effectiveEasingName, isReducedMotion]);

  // Staggered list items
  const items = ['Expressive Brand Typography', 'Dynamic Sound Synchronization', 'Strict Deterministic Timing'];

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#05070E',
        borderRadius: 16,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 24,
        boxSizing: 'border-box',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
        marginBottom: 24,
      }}
    >
      {/* Telemetry Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 6,
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              color: '#3B82F6',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            PLAYHEAD: {formatTimecode(frame, fps)} ({frame}f / {compDuration}f)
          </div>
          <div
            style={{
              fontSize: 12,
              color: isReducedMotion ? '#EF4444' : Colors.accent.emerald,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              padding: '4px 10px',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {isReducedMotion ? <EyeOff size={14} /> : <Eye size={14} />}
            Mode: <strong>{isReducedMotion ? 'Reduced Motion (Instant)' : 'Animated Flow'}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: Colors.text.tertiary }}>
          <span>Effective Card Duration: <strong style={{ color: '#3B82F6' }}>{effectiveCardDuration}f</strong></span>
          <span>Transition Duration: <strong style={{ color: Colors.accent.emerald }}>{effectiveTransitionDuration}f</strong></span>
          <span>Stagger: <strong style={{ color: Colors.accent.electricViolet }}>{effectiveStagger}f</strong></span>
        </div>
      </div>

      {/* Visual Animation Preview Area */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 220,
          backgroundColor: '#0F172A',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Sample Animated Card Component */}
        <div
          style={{
            width: 440,
            padding: 24,
            backgroundColor: '#1E293B',
            borderRadius: 12,
            border: hasComponentOverride
              ? '2px solid #06B6D4'
              : '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.5)',
            opacity: cardProgress,
            transform: `translateY(${(1 - cardProgress) * 30}px) scale(${0.92 + cardProgress * 0.08})`,
            transition: isReducedMotion ? 'none' : 'none', // Strictly driven by Remotion frame
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#F8FAFC' }}>
              Motion Graphics Card
            </div>
            {hasComponentOverride ? (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  backgroundColor: 'rgba(6, 182, 212, 0.2)',
                  color: '#06B6D4',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                OVERRIDE (8f)
              </span>
            ) : (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  color: '#3B82F6',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                INHERITED ({effectiveCardDuration}f)
              </span>
            )}
          </div>

          {/* Staggered items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((text, idx) => {
              const itemStart = animStart + (idx + 1) * effectiveStagger;
              let itemProgress = 1.0;
              if (!isReducedMotion) {
                if (frame < itemStart) itemProgress = 0.0;
                else if (effectiveCardDuration === 0) itemProgress = 1.0;
                else {
                  const p = Math.min(1.0, (frame - itemStart) / Math.max(1, Math.round(effectiveCardDuration * 0.8)));
                  const easeFn = resolveEasing(effectiveEasingName);
                  itemProgress = easeFn ? easeFn(p) : p;
                }
              }

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    color: '#E2E8F0',
                    opacity: itemProgress,
                    transform: `translateX(${(1 - itemProgress) * 15}px)`,
                  }}
                >
                  <CheckCircle size={14} color={Colors.accent.emerald} />
                  {text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
