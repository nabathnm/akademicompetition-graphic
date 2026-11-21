/**
 * AnimatedInputShowcase Component
 * Interactive showcase and diagnostic harness for the AnimatedInput UI component.
 * Demonstrates all 5 visual variants (outlined, filled, minimal, underline, rounded),
 * 7 interaction states, frame-driven typing, cursor blinking, deletion, feedback states,
 * and input scale adaptability.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Search, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { AnimatedInput } from '../../components/ui/AnimatedInput';
import {
  AnimatedInputVariant,
  AnimatedInputState,
  AnimatedInputSize,
} from '../../components/ui/types';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frame';

interface VariantMeta {
  variant: AnimatedInputVariant;
  label: string;
  desc: string;
}

const ALL_VARIANTS: VariantMeta[] = [
  { variant: 'outlined', label: '1. Outlined', desc: 'Modern high-contrast border with neon glow focus ring' },
  { variant: 'filled', label: '2. Filled', desc: 'Solid elevated dark surface with subtle depth' },
  { variant: 'minimal', label: '3. Minimal', desc: 'Subtle boundary-free editorial baseline' },
  { variant: 'underline', label: '4. Underline', desc: 'Horizontal baseline rule reveal without container borders' },
  { variant: 'rounded', label: '5. Rounded (Pill)', desc: 'Full pill-radius container for search and quick entry' },
];

export const AnimatedInputShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Interactive controls
  const [selectedVariant, setSelectedVariant] = useState<AnimatedInputVariant>('outlined');
  const [selectedSize, setSelectedSize] = useState<AnimatedInputSize>('md');
  const [forcedState, setForcedState] = useState<AnimatedInputState | 'auto'>('auto');
  const [typingSpeed, setTypingSpeed] = useState<number>(2);
  const [inputValue, setInputValue] = useState<string>('san francisco, ca');
  const [placeholder, setPlaceholder] = useState<string>('Where to?');

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
          <span style={{ color: Colors.accent.cyan, fontWeight: 700 }}>● ANIMATED INPUT SUITE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>5 VISUAL VARIANTS · 7 INTERACTION STATES · REALISTIC TYPING</span>
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
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
            INTERACTIVE INPUT HARNESS
          </span>
          <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
            Simulate Realistic User Typing & Input Focus Cycles
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
                    backgroundColor: selectedVariant === v.variant ? Colors.accent.cyan : Colors.dark.surface3,
                    color: selectedVariant === v.variant ? '#000' : Colors.text.secondary,
                    border: `1px solid ${selectedVariant === v.variant ? Colors.accent.cyan : Colors.border.default}`,
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
              {(['sm', 'md', 'lg'] as AnimatedInputSize[]).map((s) => (
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
              onChange={(e) => setForcedState(e.target.value as AnimatedInputState | 'auto')}
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
              <option value="auto">Auto (Timeline Driven)</option>
              <option value="idle">Forced: Idle</option>
              <option value="focus">Forced: Focus</option>
              <option value="typing">Forced: Typing</option>
              <option value="filled">Forced: Filled</option>
              <option value="submitted">Forced: Submitted</option>
              <option value="error">Forced: Error</option>
              <option value="disabled">Forced: Disabled</option>
            </select>
          </div>

          {/* Typing Speed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SPEED ({typingSpeed}f/char)
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[1, 2, 3, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setTypingSpeed(spd)}
                  style={{
                    backgroundColor: typingSpeed === spd ? Colors.accent.emerald : Colors.dark.surface3,
                    color: typingSpeed === spd ? '#000' : Colors.text.secondary,
                    border: `1px solid ${typingSpeed === spd ? Colors.accent.emerald : Colors.border.default}`,
                    borderRadius: Spacing.radius.sm,
                    padding: '6px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {spd}f
                </button>
              ))}
            </div>
          </div>

          {/* Value Preset */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              INPUT CONTENT
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { label: 'Destination', text: 'san francisco, ca', ph: 'Where to?' },
                { label: 'Email', text: 'alex.rivera@mobility.io', ph: 'Enter your email' },
                { label: 'Promo', text: 'UBERPREMIUM2026', ph: 'Promo code' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setInputValue(preset.text);
                    setPlaceholder(preset.ph);
                  }}
                  style={{
                    backgroundColor: inputValue === preset.text ? Colors.accent.electricViolet : Colors.dark.surface3,
                    color: inputValue === preset.text ? '#FFF' : Colors.text.secondary,
                    border: `1px solid ${inputValue === preset.text ? Colors.accent.electricViolet : Colors.border.default}`,
                    borderRadius: Spacing.radius.sm,
                    padding: '6px 10px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Interactive Preview Stage */}
        <div
          style={{
            minHeight: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.dark.bgPrimary,
            borderRadius: Spacing.radius.md,
            border: `1px solid ${Colors.border.default}`,
            padding: Spacing.scale.xl,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '100%', maxWidth: 460 }}>
            <AnimatedInput
              value={inputValue}
              placeholder={placeholder}
              label="DESTINATION SELECTOR"
              helperText={
                forcedState === 'error'
                  ? 'Location not found. Please verify your address.'
                  : forcedState === 'submitted'
                  ? 'Route calculated. Driver en route.'
                  : 'Enter pickup address or point of interest.'
              }
              startFrame={0}
              focusFrame={8}
              typingStartFrame={14}
              typingSpeed={typingSpeed}
              variant={selectedVariant}
              size={selectedSize}
              state={forcedState === 'auto' ? undefined : forcedState}
              showLeadingIcon={true}
              leadingIcon={Search}
              showTrailingIcon={true}
              trailingIcon={ArrowRight}
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: 5 Visual Variants Matrix */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.scale.md }}>
          <div>
            <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
              VISUAL VARIANT ARCHITECTURE
            </span>
            <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
              5 Built-in Architectural Styles
            </h3>
          </div>
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            Timeline: Focus 6f · Typing 12f
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
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
                <span style={{ fontSize: 13, fontWeight: 700, color: Colors.accent.cyan }}>
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
                  backgroundColor: Colors.dark.bgPrimary,
                  borderRadius: Spacing.radius.sm,
                  padding: Spacing.scale.md,
                  border: `1px solid ${Colors.border.subtle}`,
                  marginTop: Spacing.scale.xs,
                }}
              >
                <AnimatedInput
                  value="Downtown Financial District"
                  placeholder="Enter location..."
                  variant={v.variant}
                  size="md"
                  startFrame={0}
                  focusFrame={6}
                  typingStartFrame={12}
                  typingSpeed={2}
                  showLeadingIcon={true}
                  leadingIcon={Search}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Interaction States & Feedback Showcase */}
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
            INTERACTION STATES & FEEDBACK
          </span>
          <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 2 }}>
            Simulate Form Validation, Deletion & Confirmation
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: Spacing.scale.md }}>
          {/* Case 1: Submitted / Success Confirmation */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.emerald, display: 'block', marginBottom: 8 }}>
              CASE 1: SUBMITTED CONFIRMATION (FRAME 30)
            </span>
            <AnimatedInput
              value="payment_method_verified"
              placeholder="Card number"
              label="CARD REGISTRATION"
              helperText="Encrypted payment profile verified."
              startFrame={0}
              focusFrame={4}
              typingStartFrame={10}
              submittedFrame={30}
              showLeadingIcon={true}
              leadingIcon={Sparkles}
            />
          </div>

          {/* Case 2: Error Indicator & Shake Vibration */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.crimson, display: 'block', marginBottom: 8 }}>
              CASE 2: VALIDATION ERROR & SHAKE (FRAME 24)
            </span>
            <AnimatedInput
              value="invalid-corporate-token"
              placeholder="API Access Key"
              label="AUTHORIZATION TOKEN"
              helperText="Invalid corporate token. Access restricted."
              startFrame={0}
              focusFrame={4}
              typingStartFrame={10}
              errorFrame={24}
              showLeadingIcon={true}
              leadingIcon={Lock}
            />
          </div>

          {/* Case 3: Typing with Backspace Text Deletion */}
          <div
            style={{
              padding: Spacing.scale.lg,
              backgroundColor: Colors.dark.bgPrimary,
              borderRadius: Spacing.radius.md,
              border: `1px solid ${Colors.border.default}`,
            }}
          >
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.amber, display: 'block', marginBottom: 8 }}>
              CASE 3: FORWARD TYPING FOLLOWED BY DELETION (FRAME 36)
            </span>
            <AnimatedInput
              value="wrong query entered"
              placeholder="Search database..."
              label="AUTO-CORRECTION DEMO"
              helperText="Simulates user correcting typographical input."
              startFrame={0}
              focusFrame={4}
              typingStartFrame={10}
              deleteStartFrame={36}
              typingSpeed={2}
              showLeadingIcon={true}
              leadingIcon={Mail}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
