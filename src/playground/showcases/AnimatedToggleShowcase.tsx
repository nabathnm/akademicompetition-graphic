/**
 * AnimatedToggle Showcase
 * Interactive development and evaluation harness for the AnimatedToggle component.
 * Demonstrates OFF/ON transitions, 5 visual variants, 7 animation variants, 3 sizes,
 * spring overshoot presets, and sequential mobility settings choreographies.
 * Layer 1 / Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame } from 'remotion';
import {
  Volume2,
  Thermometer,
  Zap,
  Shield,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { AnimatedToggle } from '../../components/ui/AnimatedToggle.tsx';
import type {
  AnimatedToggleVisualVariant,
  AnimatedToggleAnimationVariant,
  AnimatedToggleSize,
  AnimatedToggleState,
} from '../../components/ui/types.ts';
import type { SpringPresetName } from '../../styles/motion.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

const ALL_VISUAL_VARIANTS: Array<{ id: AnimatedToggleVisualVariant; label: string }> = [
  { id: 'default', label: 'Default' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'outlined', label: 'Outlined' },
  { id: 'filled', label: 'Filled' },
  { id: 'labeled', label: 'Labeled (Internal)' },
];

const ALL_ANIMATION_VARIANTS: Array<{ id: AnimatedToggleAnimationVariant; label: string }> = [
  { id: 'combined', label: 'Combined (Spring + Scale)' },
  { id: 'spring', label: 'Spring Overshoot' },
  { id: 'scale', label: 'Scale Squash & Stretch' },
  { id: 'slide', label: 'Smooth Slide' },
  { id: 'elastic', label: 'Elastic Wobble' },
  { id: 'color-transition', label: 'Color Transition' },
  { id: 'fade', label: 'Label Fade' },
];

const ALL_SIZES: Array<{ id: AnimatedToggleSize; label: string }> = [
  { id: 'small', label: 'Small (36×20)' },
  { id: 'medium', label: 'Medium (48×26)' },
  { id: 'large', label: 'Large (64×34)' },
];

const ALL_SPRINGS: Array<{ id: SpringPresetName; label: string }> = [
  { id: 'snappy', label: 'Snappy' },
  { id: 'bouncy', label: 'Bouncy' },
  { id: 'smooth', label: 'Smooth' },
  { id: 'gentle', label: 'Gentle' },
  { id: 'stiff', label: 'Stiff' },
];

export const AnimatedToggleShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();

  // Sandbox interactive controls state
  const [initialChecked, setInitialChecked] = useState<boolean>(false);
  const [targetChecked, setTargetChecked] = useState<boolean>(true);
  const [toggleFrame, setToggleFrame] = useState<number>(18);
  const [durationInFrames, setDurationInFrames] = useState<number>(12);
  const [selectedVisual, setSelectedVisual] = useState<AnimatedToggleVisualVariant>('default');
  const [selectedAnimation, setSelectedAnimation] = useState<AnimatedToggleAnimationVariant>('combined');
  const [selectedSize, setSelectedSize] = useState<AnimatedToggleSize>('medium');
  const [selectedSpring, setSelectedSpring] = useState<SpringPresetName>('snappy');
  const [stateOverride, setStateOverride] = useState<'normal' | AnimatedToggleState>('normal');
  const [onColor, setOnColor] = useState<string>(Colors.accent.emerald);
  const [offColor, setOffColor] = useState<string>(Colors.dark.surface3);
  const [labelText, setLabelText] = useState<string>('Quiet Ride Preferred');
  const [descText, setDescText] = useState<string>('Driver keeps conversation to a minimum');
  const [showLabel, setShowLabel] = useState<boolean>(true);

  // Compute live state for telemetry
  const isAfterToggle = currentFrame >= toggleFrame;
  const liveChecked = isAfterToggle ? targetChecked : initialChecked;

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
          <span style={{ color: Colors.accent.emerald, fontWeight: 700 }}>● LIVE ENGINE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Frame:</span>
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>{currentFrame}</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>Toggle At:</span>
          <span style={{ color: Colors.accent.amber, fontWeight: 700 }}>{toggleFrame}f</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>State:</span>
          <span style={{ color: liveChecked ? Colors.accent.emerald : Colors.text.muted, fontWeight: 700 }}>
            {stateOverride !== 'normal' ? stateOverride.toUpperCase() : liveChecked ? 'ON' : 'OFF'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.sm }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: Colors.dark.surface2,
              color: Colors.accent.cyan,
              fontSize: 11,
            }}
          >
            Variant: {selectedVisual}
          </span>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: Colors.dark.surface2,
              color: Colors.accent.brand,
              fontSize: 11,
            }}
          >
            Animation: {selectedAnimation}
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
            <Sliders size={16} color={Colors.accent.emerald} />
            <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.emerald }}>
              INTERACTIVE CONFIGURATION
            </span>
          </div>

          {/* Initial & Target Checked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              TRANSITION DIRECTION
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={() => {
                  setInitialChecked(false);
                  setTargetChecked(true);
                }}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: !initialChecked && targetChecked ? Colors.accent.emerald : Colors.dark.surface3,
                  border: `1px solid ${!initialChecked && targetChecked ? Colors.accent.emerald : Colors.border.default}`,
                  color: !initialChecked && targetChecked ? '#000' : Colors.text.secondary,
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                OFF → ON
              </button>
              <button
                type="button"
                onClick={() => {
                  setInitialChecked(true);
                  setTargetChecked(false);
                }}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: initialChecked && !targetChecked ? Colors.accent.amber : Colors.dark.surface3,
                  border: `1px solid ${initialChecked && !targetChecked ? Colors.accent.amber : Colors.border.default}`,
                  color: initialChecked && !targetChecked ? '#000' : Colors.text.secondary,
                  fontWeight: 700,
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                ON → OFF
              </button>
            </div>
          </div>

          {/* Toggle Frame & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                TOGGLE AT (FRAME)
              </label>
              <input
                type="number"
                min={0}
                max={120}
                value={toggleFrame}
                onChange={(e) => setToggleFrame(Number(e.target.value) || 0)}
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
                min={4}
                max={40}
                value={durationInFrames}
                onChange={(e) => setDurationInFrames(Number(e.target.value) || 12)}
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

          {/* Visual Variant Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              VISUAL VARIANT
            </label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {ALL_VISUAL_VARIANTS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVisual(v.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedVisual === v.id ? Colors.accent.cyan : Colors.dark.surface3,
                    border: `1px solid ${selectedVisual === v.id ? Colors.accent.cyan : Colors.border.default}`,
                    color: selectedVisual === v.id ? '#000' : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: selectedVisual === v.id ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Animation Variant Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              ANIMATION VARIANT
            </label>
            <select
              value={selectedAnimation}
              onChange={(e) => setSelectedAnimation(e.target.value as AnimatedToggleAnimationVariant)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.text.primary,
                fontSize: 12,
              }}
            >
              {ALL_ANIMATION_VARIANTS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          {/* Size Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SIZE PRESET
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {ALL_SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSize(s.id)}
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedSize === s.id ? Colors.accent.brand : Colors.dark.surface3,
                    border: `1px solid ${selectedSize === s.id ? Colors.accent.brand : Colors.border.default}`,
                    color: selectedSize === s.id ? '#FFF' : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: selectedSize === s.id ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {s.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Spring Preset */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SPRING PRESET (FOR SPRING/COMBINED)
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

          {/* State Override */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              STATE OVERRIDE
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['normal', 'disabled', 'loading'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStateOverride(st)}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: stateOverride === st ? Colors.accent.emerald : Colors.dark.surface3,
                    border: `1px solid ${stateOverride === st ? Colors.accent.emerald : Colors.border.default}`,
                    color: stateOverride === st ? '#000' : Colors.text.secondary,
                    fontSize: 10,
                    fontWeight: stateOverride === st ? 700 : 400,
                    cursor: 'pointer',
                  }}
                >
                  {st.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Label & Description Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                EXTERNAL LABEL
              </label>
              <button
                type="button"
                onClick={() => setShowLabel(!showLabel)}
                style={{
                  padding: '2px 6px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: showLabel ? Colors.accent.cyan : Colors.dark.surface3,
                  color: showLabel ? '#000' : Colors.text.tertiary,
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {showLabel ? 'Visible' : 'Hidden'}
              </button>
            </div>
            <input
              type="text"
              value={labelText}
              onChange={(e) => setLabelText(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.text.primary,
                fontSize: 12,
              }}
            />
            <input
              type="text"
              value={descText}
              onChange={(e) => setDescText(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.text.secondary,
                fontSize: 11,
              }}
            />
          </div>

          {/* Colors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                ON COLOR
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {['#0E8345', '#276EF1', '#7B2CBF', '#00D1FF'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setOnColor(c)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      backgroundColor: c,
                      border: `2px solid ${onColor === c ? Colors.white : 'transparent'}`,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                OFF COLOR
              </label>
              <div style={{ display: 'flex', gap: 4 }}>
                {['#2E2E33', '#1A1A1D', '#3F3F46', '#52525B'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setOffColor(c)}
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 4,
                      backgroundColor: c,
                      border: `2px solid ${offColor === c ? Colors.white : 'transparent'}`,
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
          }}
        >
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
            LIVE STAGE CANVAS
          </div>

          <div
            style={{
              padding: `${Spacing.scale.lg}px ${Spacing.scale.xl}px`,
              backgroundColor: Colors.dark.surface2,
              borderRadius: Spacing.radius.lg,
              border: `1px solid ${Colors.border.default}`,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
            }}
          >
            <AnimatedToggle
              defaultChecked={initialChecked}
              checked={targetChecked}
              toggleFrame={toggleFrame}
              durationInFrames={durationInFrames}
              visualVariant={selectedVisual}
              animationVariant={selectedAnimation}
              size={selectedSize}
              springPreset={selectedSpring}
              state={stateOverride === 'normal' ? undefined : stateOverride}
              onColor={onColor}
              offColor={offColor}
              label={labelText}
              description={descText}
              showLabel={showLabel}
              leadingIcon={Volume2}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: Spacing.scale.md,
              fontFamily: Typography.fontFamily.mono,
              fontSize: 11,
              color: Colors.text.muted,
            }}
          >
            {isAfterToggle ? `Transition Settled at Frame ${toggleFrame}` : `Awaiting Trigger at Frame ${toggleFrame}`}
          </div>
        </div>
      </div>

      {/* SECTION 3: All 5 Visual Presentation Variants */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            Visual Presentation Variants
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Five distinct structural presentations from standard mobile toggles to minimal sliders and internal track-labeled states.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {ALL_VISUAL_VARIANTS.map((v, idx) => (
            <div
              key={v.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: Spacing.scale.md,
                backgroundColor: Colors.dark.surface1,
                borderRadius: Spacing.radius.md,
                border: `1px solid ${Colors.border.default}`,
                minHeight: 110,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.cyan }}>
                  {v.label}
                </span>
                <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.muted }}>
                  variant="{v.id}"
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0' }}>
                <AnimatedToggle
                  visualVariant={v.id}
                  defaultChecked={idx % 2 === 0}
                  toggleFrame={15 + idx * 8}
                  durationInFrames={12}
                  size="medium"
                  label={v.label}
                  description={`Variant ${idx + 1}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Sizes and Spring Overshoot Behaviors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            Size Presets & Physical Spring Kinetics
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Proportional track and thumb dimensions alongside overshoot dynamics with spring physics.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {[
            { size: 'small' as const, spring: 'snappy' as const, title: 'Small · Snappy Spring', desc: 'Compact 36×20 pill with rapid settle' },
            { size: 'medium' as const, spring: 'bouncy' as const, title: 'Medium · Bouncy Spring', desc: 'Standard 48×26 pill with visible overshoot' },
            { size: 'large' as const, spring: 'smooth' as const, title: 'Large · Smooth Spring', desc: 'Prominent 64×34 hero toggle with gradual curve' },
          ].map((item, idx) => (
            <div
              key={item.size}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: Spacing.scale.md,
                backgroundColor: Colors.dark.surface1,
                borderRadius: Spacing.radius.md,
                border: `1px solid ${Colors.border.default}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: Colors.accent.emerald }}>
                  {item.title}
                </span>
                <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.muted }}>
                  {item.size.toUpperCase()}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
                <AnimatedToggle
                  size={item.size}
                  springPreset={item.spring}
                  animationVariant="combined"
                  defaultChecked={false}
                  toggleFrame={12 + idx * 10}
                  durationInFrames={14}
                  label={item.title.split('·')[0].trim()}
                  description={item.desc}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Sequential Mobility Settings Workflow */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            Choreographed Mobility Preferences Workflow
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Real-world product settings menu demonstrating staggered activations, loading spinners, and disabled permissions.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: Colors.dark.surface1,
            borderRadius: Spacing.radius.lg,
            border: `1px solid ${Colors.border.default}`,
            overflow: 'hidden',
          }}
        >
          {[
            {
              id: 'quiet',
              icon: Volume2,
              title: 'Quiet Ride Mode',
              desc: 'Driver will avoid conversation and keep radio silent',
              defaultChecked: false,
              toggleFrame: 10,
              onColor: Colors.accent.emerald,
            },
            {
              id: 'climate',
              icon: Thermometer,
              title: 'Cabin Temperature Pre-Set',
              desc: 'Condition climate control to 70°F before pickup',
              defaultChecked: false,
              toggleFrame: 24,
              onColor: Colors.accent.cyan,
            },
            {
              id: 'priority',
              icon: Zap,
              title: 'Priority Driver Dispatch',
              desc: 'Request closest premium electric vehicle',
              defaultChecked: true,
              toggleFrame: 38,
              state: (currentFrame >= 38 && currentFrame < 68 ? 'loading' : undefined) as AnimatedToggleState | undefined,
              onColor: Colors.accent.brand,
            },
            {
              id: 'security',
              icon: Shield,
              title: 'PIN Verification Code',
              desc: 'Confirm 4-digit code before entering vehicle',
              defaultChecked: true,
              toggleFrame: 999,
              onColor: Colors.accent.emerald,
            },
            {
              id: 'heated',
              icon: Sparkles,
              title: 'Heated Rear Seats (Comfort Tier)',
              desc: 'Feature unavailable for standard vehicles',
              defaultChecked: false,
              state: 'disabled' as AnimatedToggleState,
            },
          ].map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: `${Spacing.scale.md}px ${Spacing.scale.lg}px`,
                borderBottom: idx < 4 ? `1px solid ${Colors.border.subtle}` : 'none',
                backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
              }}
            >
              <AnimatedToggle
                defaultChecked={item.defaultChecked}
                toggleFrame={item.toggleFrame}
                durationInFrames={12}
                state={item.state}
                onColor={item.onColor}
                size="medium"
                leadingIcon={item.icon}
                label={item.title}
                description={item.desc}
                labelPosition="right"
              />

              <span
                style={{
                  fontSize: 10,
                  fontFamily: Typography.fontFamily.mono,
                  color: Colors.text.muted,
                  marginLeft: Spacing.scale.md,
                  flexShrink: 0,
                }}
              >
                {item.state === 'disabled'
                  ? 'OFFLINE'
                  : item.state === 'loading'
                    ? 'CONNECTING'
                    : currentFrame >= (item.toggleFrame ?? 0)
                      ? 'SYNCED'
                      : 'STANDBY'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
