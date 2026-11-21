/**
 * AnimatedCheckbox Showcase
 * Interactive development and evaluation harness for the AnimatedCheckbox component.
 * Demonstrates checked/unchecked transitions, indeterminate state, disabled/error states,
 * 6 visual presentation variants, 8 animation variants, 3 sizes, and sequential multi-checkbox checklists.
 * Layer 1 / Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame } from 'remotion';
import {
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Car,
  UserCheck,
  Share2,
  Mic,
  KeyRound,
} from 'lucide-react';
import { AnimatedCheckbox } from '../../components/ui/AnimatedCheckbox.tsx';
import type {
  AnimatedCheckboxVisualVariant,
  AnimatedCheckboxAnimationVariant,
  AnimatedCheckboxSize,
  AnimatedCheckboxState,
} from '../../components/ui/types.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

const ALL_VISUAL_VARIANTS: Array<{ id: AnimatedCheckboxVisualVariant; label: string }> = [
  { id: 'default', label: 'Default (Rounded Rect)' },
  { id: 'rounded', label: 'Rounded (Circular)' },
  { id: 'square', label: 'Square (Sharp)' },
  { id: 'filled', label: 'Filled' },
  { id: 'outlined', label: 'Outlined' },
  { id: 'minimal', label: 'Minimal' },
];

const ALL_ANIMATION_VARIANTS: Array<{ id: AnimatedCheckboxAnimationVariant; label: string }> = [
  { id: 'combined', label: 'Combined (Draw + Fill + Pop)' },
  { id: 'check-draw', label: 'Check-Draw (Progressive SVG)' },
  { id: 'pop', label: 'Pop (Spring Overshoot)' },
  { id: 'scale', label: 'Scale Feedback' },
  { id: 'fill', label: 'Color Fill' },
  { id: 'border', label: 'Border Transition' },
  { id: 'fade', label: 'Fade In' },
  { id: 'bounce', label: 'Bounce Physics' },
];

const ALL_SIZES: Array<{ id: AnimatedCheckboxSize; label: string }> = [
  { id: 'small', label: 'Small (18px)' },
  { id: 'medium', label: 'Medium (24px)' },
  { id: 'large', label: 'Large (32px)' },
];

export const AnimatedCheckboxShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();

  // Sandbox interactive controls state
  const [initialChecked, setInitialChecked] = useState<boolean>(false);
  const [targetChecked, setTargetChecked] = useState<boolean>(true);
  const [checkFrame, setCheckFrame] = useState<number>(18);
  const [durationInFrames, setDurationInFrames] = useState<number>(12);
  const [selectedVisual, setSelectedVisual] = useState<AnimatedCheckboxVisualVariant>('default');
  const [selectedAnimation, setSelectedAnimation] = useState<AnimatedCheckboxAnimationVariant>('combined');
  const [selectedSize, setSelectedSize] = useState<AnimatedCheckboxSize>('medium');
  const [stateOverride, setStateOverride] = useState<'normal' | AnimatedCheckboxState>('normal');
  const [checkedColor, setCheckedColor] = useState<string>(Colors.accent.emerald);
  const [labelText, setLabelText] = useState<string>('Driver Verification Code');
  const [descText, setDescText] = useState<string>('Confirm 4-digit PIN before opening car doors');
  const [showLabel, setShowLabel] = useState<boolean>(true);

  // Compute live state for telemetry
  const isAfterCheck = currentFrame >= checkFrame;
  const liveChecked = isAfterCheck ? targetChecked : initialChecked;

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
          <span style={{ color: Colors.text.secondary }}>Check At:</span>
          <span style={{ color: Colors.accent.amber, fontWeight: 700 }}>{checkFrame}f</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>State:</span>
          <span
            style={{
              color: stateOverride === 'error'
                ? Colors.accent.crimson
                : liveChecked
                  ? Colors.accent.emerald
                  : Colors.text.muted,
              fontWeight: 700,
            }}
          >
            {stateOverride !== 'normal' ? stateOverride.toUpperCase() : liveChecked ? 'CHECKED' : 'UNCHECKED'}
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

          {/* Direction Controls */}
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
                UNCHECKED → CHECKED
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
                CHECKED → UNCHECKED
              </button>
            </div>
          </div>

          {/* Frame & Duration Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
                CHECK AT (FRAME)
              </label>
              <input
                type="number"
                min={0}
                max={120}
                value={checkFrame}
                onChange={(e) => setCheckFrame(Number(e.target.value) || 0)}
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
                  {v.label.split(' ')[0]}
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
              onChange={(e) => setSelectedAnimation(e.target.value as AnimatedCheckboxAnimationVariant)}
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

          {/* State Override */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              STATE OVERRIDE
            </label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {(['normal', 'indeterminate', 'disabled', 'error'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStateOverride(st)}
                  style={{
                    padding: '4px 8px',
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

          {/* Selection Colors */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              CHECKED COLOR
            </label>
            <div style={{ display: 'flex', gap: 4 }}>
              {['#0E8345', '#276EF1', '#7B2CBF', '#00D1FF', '#FFC043'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCheckedColor(c)}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    backgroundColor: c,
                    border: `2px solid ${checkedColor === c ? Colors.white : 'transparent'}`,
                    cursor: 'pointer',
                  }}
                />
              ))}
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
            <AnimatedCheckbox
              defaultChecked={initialChecked}
              checked={targetChecked}
              checkFrame={checkFrame}
              durationInFrames={durationInFrames}
              visualVariant={selectedVisual}
              animationVariant={selectedAnimation}
              size={selectedSize}
              state={stateOverride === 'normal' ? undefined : stateOverride}
              checkedColor={checkedColor}
              label={labelText}
              description={descText}
              showLabel={showLabel}
              leadingIcon={ShieldCheck}
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
            {isAfterCheck ? `Selection Settled at Frame ${checkFrame}` : `Awaiting Trigger at Frame ${checkFrame}`}
          </div>
        </div>
      </div>

      {/* SECTION 3: All 6 Visual Presentation Variants */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            Visual Presentation Variants
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Six distinct boundary styles: rounded rect, circular pill, sharp square, filled surface, high-contrast outline, and minimal tint.
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
                <AnimatedCheckbox
                  visualVariant={v.id}
                  defaultChecked={idx % 2 === 0}
                  checkFrame={15 + idx * 8}
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

      {/* SECTION 4: Animation Variants Matrix */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            Animation Variants & SVG Checkmark Drawing
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Deterministic SVG stroke-dashoffset drawing, spring pop overshoots, color fills, and scale feedback.
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
            { anim: 'check-draw' as const, title: 'Check-Draw', desc: 'Progressive SVG stroke-dashoffset path trace' },
            { anim: 'pop' as const, title: 'Spring Pop', desc: 'Physical bounce with spring overshoot scaling' },
            { anim: 'scale' as const, title: 'Scale Feedback', desc: 'Smooth directional expansion during selection' },
            { anim: 'fill' as const, title: 'Color Fill', desc: 'Solid background color interpolation' },
            { anim: 'border' as const, title: 'Border Transition', desc: 'Border width and tint adjustment' },
            { anim: 'combined' as const, title: 'Combined Master', desc: 'Stroke draw, fill blend, and spring pop' },
          ].map((item, idx) => (
            <div
              key={item.anim}
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
                  animationVariant="{item.anim}"
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
                <AnimatedCheckbox
                  animationVariant={item.anim}
                  defaultChecked={false}
                  checkFrame={14 + idx * 8}
                  durationInFrames={12}
                  size="medium"
                  label={item.title}
                  description={item.desc}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Sequential Mobility Trip Safety Checklist Workflow */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.scale.md }}>
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            Choreographed Trip Safety Checklist Workflow
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Real-world mobility onboarding checklist demonstrating staggered sequential selections, indeterminate partial states, and disabled features.
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
              id: 'seatbelt',
              icon: CheckCircle2,
              title: 'Seatbelt Fastened & Verified',
              desc: 'Mandatory passenger safety requirement',
              defaultChecked: false,
              checkFrame: 10,
              checkedColor: Colors.accent.emerald,
            },
            {
              id: 'plate',
              icon: Car,
              title: 'License Plate Matched: 8XYZ421',
              desc: 'Confirm vehicle make and license plate match app',
              defaultChecked: false,
              checkFrame: 22,
              checkedColor: Colors.accent.cyan,
            },
            {
              id: 'driver',
              icon: UserCheck,
              title: 'Driver Identity Confirmed',
              desc: 'Driver face matches profile photo in record',
              defaultChecked: false,
              checkFrame: 34,
              checkedColor: Colors.accent.brand,
            },
            {
              id: 'share',
              icon: Share2,
              title: 'Live Trip Status Shared',
              desc: 'Trusted emergency contacts updated with GPS link',
              defaultChecked: false,
              checkFrame: 46,
              checkedColor: Colors.accent.electricViolet,
            },
            {
              id: 'audio',
              icon: Mic,
              title: 'In-Cabin Audio Safety Recording',
              desc: 'Partially authorized by local jurisdiction regulation',
              defaultChecked: false,
              state: 'indeterminate' as AnimatedCheckboxState,
            },
            {
              id: 'keyless',
              icon: KeyRound,
              title: 'Keyless NFC Vehicle Unlock',
              desc: 'Unavailable for standard passenger tier vehicles',
              defaultChecked: false,
              state: 'disabled' as AnimatedCheckboxState,
            },
          ].map((item, idx) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: `${Spacing.scale.md}px ${Spacing.scale.lg}px`,
                borderBottom: idx < 5 ? `1px solid ${Colors.border.subtle}` : 'none',
                backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
              }}
            >
              <AnimatedCheckbox
                defaultChecked={item.defaultChecked}
                checkFrame={item.checkFrame}
                durationInFrames={12}
                state={item.state}
                checkedColor={item.checkedColor}
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
                  ? 'RESTRICTED'
                  : item.state === 'indeterminate'
                    ? 'PARTIAL'
                    : currentFrame >= (item.checkFrame ?? 0)
                      ? 'VERIFIED'
                      : 'PENDING'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
