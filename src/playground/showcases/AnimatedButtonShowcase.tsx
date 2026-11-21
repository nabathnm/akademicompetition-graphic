/**
 * AnimatedButtonShowcase Component
 * Interactive showcase and diagnostic harness for the AnimatedButton component.
 * Demonstrates all 6 visual variants (primary, secondary, outline, ghost, text, icon-only),
 * 8 interaction states, physics-based press and spring release, rotating spinner, and feedback states.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  ArrowRight,
  Sparkles,
  Download,
  CreditCard,
  Send,
  Zap,
} from 'lucide-react';
import { AnimatedButton } from '../../components/ui/AnimatedButton';
import {
  AnimatedButtonVariant,
  AnimatedButtonState,
  AnimatedButtonSize,
} from '../../components/ui/types';
import { SpringPresetName } from '../../styles/motion';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frame';

interface VariantMeta {
  variant: AnimatedButtonVariant;
  label: string;
  desc: string;
}

const ALL_VARIANTS: VariantMeta[] = [
  { variant: 'primary', label: '1. Primary', desc: 'High-contrast brand solid pill with elevation glow' },
  { variant: 'secondary', label: '2. Secondary', desc: 'Muted dark surface with subtle border contrast' },
  { variant: 'outline', label: '3. Outline', desc: 'Crisp transparent container with high-contrast boundary rule' },
  { variant: 'ghost', label: '4. Ghost', desc: 'Clean transparent button that highlights on press' },
  { variant: 'text', label: '5. Text Only', desc: 'Typographic action link without bounding frame' },
  { variant: 'icon-only', label: '6. Icon Only', desc: 'Square/circular action trigger for compact toolbars' },
];

export const AnimatedButtonShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Interactive controls
  const [selectedVariant, setSelectedVariant] = useState<AnimatedButtonVariant>('primary');
  const [selectedSize, setSelectedSize] = useState<AnimatedButtonSize>('medium');
  const [forcedState, setForcedState] = useState<AnimatedButtonState | 'auto'>('auto');
  const [springPreset, setSpringPreset] = useState<SpringPresetName>('snappy');
  const [buttonLabel, setButtonLabel] = useState<string>('Request Premium Ride');
  const [scaleOnPress, setScaleOnPress] = useState<number>(0.93);

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
      {/* SECTION 1: Telemetry Banner */}
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
          <span style={{ color: Colors.accent.brandLight, fontWeight: 700 }}>● ANIMATED BUTTON SUITE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>6 VARIANTS · 8 INTERACTION STATES · SPRING PRESS FEEDBACK</span>
        </div>
        <div style={{ display: 'flex', gap: Spacing.scale.md }}>
          <span>FRAME: <strong style={{ color: Colors.accent.cyan }}>{currentFrame} / {durationInFrames}</strong></span>
          <span>TIMECODE: <strong style={{ color: Colors.accent.amber }}>{formatTimecode(currentFrame, fps)}</strong></span>
        </div>
      </div>

      {/* SECTION 2: Interactive Playground Sandbox */}
      <div
        style={{
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.lg,
          padding: Spacing.scale.lg,
          display: 'flex',
          flexDirection: 'column',
          gap: Spacing.scale.md,
        }}
      >
        <div>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.brandLight }}>
            INTERACTIVE CTA LAB
          </span>
          <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
            Realistic Press Feedback & Kinetic Physics
          </h3>
        </div>

        {/* Control Toolbar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: Spacing.scale.md,
            padding: Spacing.scale.md,
            backgroundColor: Colors.dark.surface2,
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.default}`,
            alignItems: 'center',
          }}
        >
          {/* Variant Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              VARIANT
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {ALL_VARIANTS.map((v) => (
                <button
                  key={v.variant}
                  onClick={() => setSelectedVariant(v.variant)}
                  style={{
                    backgroundColor: selectedVariant === v.variant ? Colors.accent.brand : Colors.dark.surface3,
                    color: selectedVariant === v.variant ? '#FFF' : Colors.text.secondary,
                    border: `1px solid ${selectedVariant === v.variant ? Colors.accent.brandLight : Colors.border.default}`,
                    borderRadius: Spacing.radius.sm,
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {v.label.split('. ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SIZE
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['small', 'medium', 'large'] as AnimatedButtonSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  style={{
                    backgroundColor: selectedSize === s ? Colors.accent.amber : Colors.dark.surface3,
                    color: selectedSize === s ? '#000' : Colors.text.secondary,
                    border: `1px solid ${selectedSize === s ? Colors.accent.amber : Colors.border.default}`,
                    borderRadius: Spacing.radius.sm,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* State Mode Override */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              STATE MODE
            </label>
            <select
              value={forcedState}
              onChange={(e) => setForcedState(e.target.value as AnimatedButtonState | 'auto')}
              style={{
                backgroundColor: Colors.dark.surface3,
                color: Colors.text.primary,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: Spacing.radius.sm,
                padding: '6px 10px',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              <option value="auto">Auto (Timeline: Press 10f / Release 18f)</option>
              <option value="idle">Forced: Idle</option>
              <option value="hover">Forced: Hover</option>
              <option value="pressed">Forced: Pressed</option>
              <option value="released">Forced: Released</option>
              <option value="loading">Forced: Loading</option>
              <option value="success">Forced: Success</option>
              <option value="error">Forced: Error</option>
              <option value="disabled">Forced: Disabled</option>
            </select>
          </div>

          {/* Spring Preset */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SPRING PHYSICS
            </label>
            <select
              value={springPreset}
              onChange={(e) => setSpringPreset(e.target.value as SpringPresetName)}
              style={{
                backgroundColor: Colors.dark.surface3,
                color: Colors.text.primary,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: Spacing.radius.sm,
                padding: '6px 8px',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {(['snappy', 'gentle', 'bouncy', 'stiff', 'slow'] as SpringPresetName[]).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Scale Compression */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              PRESS SCALE ({scaleOnPress})
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[0.96, 0.93, 0.88].map((sc) => (
                <button
                  key={sc}
                  onClick={() => setScaleOnPress(sc)}
                  style={{
                    backgroundColor: scaleOnPress === sc ? Colors.accent.emerald : Colors.dark.surface3,
                    color: scaleOnPress === sc ? '#000' : Colors.text.secondary,
                    border: `1px solid ${scaleOnPress === sc ? Colors.accent.emerald : Colors.border.default}`,
                    borderRadius: Spacing.radius.sm,
                    padding: '6px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {sc}
                </button>
              ))}
            </div>
          </div>

          {/* Label Presets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              LABEL PRESET
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {['Request Premium Ride', 'Confirm Booking', 'Authorize'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setButtonLabel(preset)}
                  style={{
                    backgroundColor: buttonLabel === preset ? Colors.accent.electricViolet : Colors.dark.surface3,
                    color: buttonLabel === preset ? '#FFF' : Colors.text.secondary,
                    border: `1px solid ${Colors.border.default}`,
                    borderRadius: Spacing.radius.sm,
                    padding: '6px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {preset.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Interactive Preview Stage */}
        <div
          style={{
            minHeight: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.dark.bgPrimary,
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.default}`,
            padding: Spacing.scale.xl,
            position: 'relative',
          }}
        >
          <AnimatedButton
            label={buttonLabel}
            variant={selectedVariant}
            size={selectedSize}
            state={forcedState === 'auto' ? undefined : forcedState}
            startFrame={0}
            pressFrame={10}
            releaseFrame={18}
            scaleOnPress={scaleOnPress}
            springPreset={springPreset}
            leadingIcon={selectedVariant === 'icon-only' ? Zap : Sparkles}
            trailingIcon={selectedVariant === 'icon-only' ? undefined : ArrowRight}
            badge="FAST"
            loadingLabel="Processing Booking..."
            successLabel="Ride Confirmed!"
            errorLabel="Payment Failed"
          />
        </div>
      </div>

      {/* SECTION 3: 6 Visual Variants Matrix */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.scale.md }}>
          <div>
            <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.brandLight }}>
              VISUAL VARIANT ARCHITECTURE
            </span>
            <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
              6 Production Button Variants
            </h3>
          </div>
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            Timeline: Press 12f · Release 20f
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: Spacing.scale.md,
          }}
        >
          {ALL_VARIANTS.map((v) => (
            <div
              key={v.variant}
              style={{
                backgroundColor: Colors.dark.surface1,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: Spacing.radius.md,
                padding: Spacing.scale.lg,
                display: 'flex',
                flexDirection: 'column',
                gap: Spacing.scale.sm,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: Colors.accent.brandLight }}>
                  {v.label}
                </span>
                <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                  VARIANT: {v.variant}
                </span>
              </div>
              <p style={{ fontSize: 12, color: Colors.text.secondary, margin: 0 }}>
                {v.desc}
              </p>

              <div
                style={{
                  minHeight: 64,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: Colors.dark.bgPrimary,
                  borderRadius: Spacing.radius.sm,
                  padding: Spacing.scale.md,
                  border: `1px solid ${Colors.border.subtle}`,
                  marginTop: Spacing.scale.xs,
                }}
              >
                <AnimatedButton
                  label={v.variant === 'icon-only' ? undefined : 'Confirm Ride'}
                  variant={v.variant}
                  size="medium"
                  startFrame={0}
                  pressFrame={12}
                  releaseFrame={20}
                  icon={v.variant === 'icon-only' ? Send : undefined}
                  leadingIcon={v.variant !== 'icon-only' ? CreditCard : undefined}
                  trailingIcon={v.variant !== 'icon-only' && v.variant !== 'text' ? ArrowRight : undefined}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Interaction Lifecycle & Feedback Showcase */}
      <div
        style={{
          backgroundColor: Colors.dark.surface1,
          border: `1px solid ${Colors.border.default}`,
          borderRadius: Spacing.radius.lg,
          padding: Spacing.scale.lg,
          display: 'flex',
          flexDirection: 'column',
          gap: Spacing.scale.lg,
        }}
      >
        <div>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.amber }}>
            INTERACTION LIFECYCLES & CONFIRMATION
          </span>
          <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
            Simulate Full Press, Loading & Validation Workflows
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: Spacing.scale.md }}>
          {/* Case 1: Loading State with Spinner */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
            }}
          >
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan }}>
              CASE 1: ASYNC LOADING STATE (FRAME 15)
            </span>
            <div>
              <AnimatedButton
                label="Process Payment"
                loadingLabel="Authorizing Transaction..."
                variant="primary"
                startFrame={0}
                loadingStartFrame={15}
                leadingIcon={Download}
              />
            </div>
          </div>

          {/* Case 2: Success Confirmation Feedback */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
            }}
          >
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.emerald }}>
              CASE 2: SUCCESS STATE & CHECKMARK (FRAME 24)
            </span>
            <div>
              <AnimatedButton
                label="Confirm Order"
                successLabel="Booking Confirmed!"
                variant="primary"
                startFrame={0}
                pressFrame={8}
                releaseFrame={16}
                successFrame={24}
              />
            </div>
          </div>

          {/* Case 3: Error Feedback with Vibration Shake */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
              display: 'flex',
              flexDirection: 'column',
              gap: Spacing.scale.sm,
            }}
          >
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.crimson }}>
              CASE 3: ERROR STATE & SHAKE VIBRATION (FRAME 20)
            </span>
            <div>
              <AnimatedButton
                label="Connect Vehicle"
                errorLabel="Connection Refused"
                variant="secondary"
                startFrame={0}
                pressFrame={6}
                releaseFrame={12}
                errorFrame={20}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
