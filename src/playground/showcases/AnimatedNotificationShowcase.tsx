/**
 * AnimatedNotificationShowcase Component
 * Interactive showcase and diagnostic harness for the AnimatedNotification component.
 * Demonstrates all 6 semantic types (info, success, warning, error, message, custom),
 * 5 visual variants (toast, banner, floating, compact, card), 7 relative positions,
 * entrance & exit animations, progress bar synchronization, and sequential messaging flows.
 * Layer 2 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { AnimatedNotification } from '../../components/ui/AnimatedNotification';
import {
  AnimatedNotificationType,
  AnimatedNotificationVariant,
  AnimatedNotificationPosition,
  AnimatedNotificationEntrance,
  AnimatedNotificationExit,
} from '../../components/ui/types';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { formatTimecode } from '../../utils/timing/frame';

const ALL_TYPES: { id: AnimatedNotificationType; label: string; desc: string }[] = [
  { id: 'info', label: 'Info', desc: 'Electric cyan accent for neutral system updates' },
  { id: 'success', label: 'Success', desc: 'Emerald green accent for confirmed interactions' },
  { id: 'warning', label: 'Warning', desc: 'Amber accent for cautions and schedule delays' },
  { id: 'error', label: 'Error', desc: 'Crimson accent with subtle vibration shake' },
  { id: 'message', label: 'Message', desc: 'Brand blue accent for driver & user chat' },
  { id: 'custom', label: 'Custom', desc: 'Fully customizable accent color and icons' },
];

const ALL_VARIANTS: { id: AnimatedNotificationVariant; label: string; desc: string }[] = [
  { id: 'toast', label: 'Toast', desc: 'Floating rounded pill with drop shadow' },
  { id: 'banner', label: 'Banner', desc: 'Full-width banner with left accent rule' },
  { id: 'floating', label: 'Floating', desc: 'Elevated floating card with deep shadow' },
  { id: 'compact', label: 'Compact', desc: 'Single-line compact alert tag' },
  { id: 'card', label: 'Card', desc: 'Structured notification card with actions' },
];

const ALL_POSITIONS: AnimatedNotificationPosition[] = [
  'top-right',
  'top',
  'top-left',
  'center',
  'bottom-right',
  'bottom',
  'bottom-left',
];

export const AnimatedNotificationShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Interactive controls
  const [selectedType, setSelectedType] = useState<AnimatedNotificationType>('success');
  const [selectedVariant, setSelectedVariant] = useState<AnimatedNotificationVariant>('card');
  const [selectedPosition, setSelectedPosition] = useState<AnimatedNotificationPosition>('top-right');
  const [entranceStyle, setEntranceStyle] = useState<AnimatedNotificationEntrance>('slide-down');
  const [exitStyle, setExitStyle] = useState<AnimatedNotificationExit>('fade-out');
  const [titleText, setTitleText] = useState<string>('Driver En Route');
  const [descText, setDescText] = useState<string>('Your Uber Black is arriving at Terminal 2.');
  const [displayDur, setDisplayDur] = useState<number>(60);
  const [showProgressToggle, setShowProgressToggle] = useState<boolean>(true);

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
          <span style={{ color: Colors.accent.brandLight, fontWeight: 700 }}>● ANIMATED NOTIFICATION SUITE</span>
          <span style={{ color: Colors.text.tertiary }}>|</span>
          <span style={{ color: Colors.text.secondary }}>
            TYPE: <strong style={{ color: Colors.accent.cyan, textTransform: 'uppercase' }}>{selectedType}</strong> ·
            VARIANT: <strong style={{ color: Colors.accent.amber, textTransform: 'uppercase' }}>{selectedVariant}</strong> ·
            POS: <strong style={{ color: Colors.accent.emerald }}>{selectedPosition}</strong>
          </span>
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
          gap: Spacing.scale.lg,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.scale.sm }}>
          <div>
            <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
              Interactive Notification Sandbox
            </h3>
            <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
              Frame-accurate positioning, synchronized progress bars, and directional entrance/exit choreographies.
            </p>
          </div>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: Spacing.radius.xs,
              backgroundColor: Colors.dark.surface2,
              fontFamily: Typography.fontFamily.mono,
              fontSize: 11,
              color: Colors.accent.emerald,
              border: `1px solid ${Colors.border.subtle}`,
            }}
          >
            ● RELATIVE POSITIONING
          </span>
        </div>

        {/* Controls Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: Spacing.scale.md,
            padding: Spacing.scale.md,
            backgroundColor: Colors.dark.surface2,
            borderRadius: Spacing.radius.md,
          }}
        >
          {/* Notification Title Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              TITLE
            </label>
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.text.primary,
                fontSize: 13,
                fontFamily: Typography.fontFamily.sans,
              }}
            />
          </div>

          {/* Notification Description Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              DESCRIPTION
            </label>
            <input
              type="text"
              value={descText}
              onChange={(e) => setDescText(e.target.value)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.text.primary,
                fontSize: 13,
                fontFamily: Typography.fontFamily.sans,
              }}
            />
          </div>

          {/* Semantic Type Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SEMANTIC TYPE
            </label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {ALL_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedType === t.id ? Colors.accent.brand : Colors.dark.surface3,
                    border: `1px solid ${selectedType === t.id ? Colors.accent.brand : Colors.border.default}`,
                    color: selectedType === t.id ? '#FFF' : Colors.text.secondary,
                    fontSize: 11,
                    cursor: 'pointer',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Variant Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              VISUAL VARIANT
            </label>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {ALL_VARIANTS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v.id)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: selectedVariant === v.id ? Colors.accent.cyan : Colors.dark.surface3,
                    border: `1px solid ${selectedVariant === v.id ? Colors.accent.cyan : Colors.border.default}`,
                    color: selectedVariant === v.id ? '#000' : Colors.text.secondary,
                    fontSize: 11,
                    cursor: 'pointer',
                    fontWeight: selectedVariant === v.id ? 700 : 400,
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Position Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              POSITION PRESET
            </label>
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value as AnimatedNotificationPosition)}
              style={{
                padding: '6px 10px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: Colors.dark.surface3,
                border: `1px solid ${Colors.border.default}`,
                color: Colors.text.primary,
                fontSize: 12,
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              {ALL_POSITIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Entrance & Exit Styles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              ENTRANCE / EXIT
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              <select
                value={entranceStyle}
                onChange={(e) => setEntranceStyle(e.target.value as AnimatedNotificationEntrance)}
                style={{
                  padding: '4px 6px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: Colors.dark.surface3,
                  border: `1px solid ${Colors.border.default}`,
                  color: Colors.text.primary,
                  fontSize: 11,
                }}
              >
                {(['slide-down', 'fade-in', 'slide-up', 'slide-left', 'slide-right', 'scale-in', 'pop-in', 'expand'] as AnimatedNotificationEntrance[]).map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>

              <select
                value={exitStyle}
                onChange={(e) => setExitStyle(e.target.value as AnimatedNotificationExit)}
                style={{
                  padding: '4px 6px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: Colors.dark.surface3,
                  border: `1px solid ${Colors.border.default}`,
                  color: Colors.text.primary,
                  fontSize: 11,
                }}
              >
                {(['fade-out', 'slide-out', 'scale-out', 'collapse'] as AnimatedNotificationExit[]).map((ex) => (
                  <option key={ex} value={ex}>
                    {ex}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Display Duration & Progress Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              DURATION & PROGRESS
            </label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="number"
                min={20}
                max={150}
                value={displayDur}
                onChange={(e) => setDisplayDur(Number(e.target.value) || 60)}
                style={{
                  width: 60,
                  padding: '4px 6px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: Colors.dark.surface3,
                  border: `1px solid ${Colors.border.default}`,
                  color: Colors.text.primary,
                  fontSize: 11,
                }}
              />
              <button
                type="button"
                onClick={() => setShowProgressToggle(!showProgressToggle)}
                style={{
                  padding: '4px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: showProgressToggle ? Colors.accent.emerald : Colors.dark.surface3,
                  border: `1px solid ${showProgressToggle ? Colors.accent.emerald : Colors.border.default}`,
                  color: showProgressToggle ? '#000' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {showProgressToggle ? 'Progress ON' : 'Progress OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Interactive Sandbox Canvas with Relative Boundary */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 320,
            backgroundColor: Colors.black,
            borderRadius: Spacing.radius.md,
            border: `1px dashed ${Colors.border.strong}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: Typography.fontFamily.mono,
              fontSize: 11,
              color: Colors.text.tertiary,
              pointerEvents: 'none',
              textAlign: 'center',
            }}
          >
            CANVAS VIEWPORT BOUNDS (100% × 320px)
            <div style={{ fontSize: 10, marginTop: 4, color: Colors.text.muted }}>
              Notification placed relative to container
            </div>
          </div>

          <AnimatedNotification
            type={selectedType}
            variant={selectedVariant}
            position={selectedPosition}
            title={titleText}
            description={descText}
            timestamp="Just now"
            actionLabel="View Details"
            startFrame={0}
            durationInFrames={12}
            displayDuration={displayDur}
            entranceVariant={entranceStyle}
            exitVariant={exitStyle}
            showProgress={showProgressToggle}
          />
        </div>
      </div>

      {/* SECTION 3: All 6 Notification Types Matrix */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: Spacing.scale.md,
        }}
      >
        <div>
          <h3 style={{ ...Typography.headline.h3, margin: 0, color: Colors.text.primary }}>
            Semantic Notification Types
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Standard mobility design tokens mapped to info, confirmation, warning, alert, and driver communication events.
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
            { type: 'info' as const, title: 'Trip Update', desc: 'Route adjusted to avoid construction on 4th St.', icon: Info },
            { type: 'success' as const, title: 'Drop-off Complete', desc: 'Thank you for riding with Uber Black.', icon: CheckCircle2 },
            { type: 'warning' as const, title: 'Flight Delayed', desc: 'SFO flight UA 421 is now delayed by 25 mins.', icon: AlertTriangle },
            { type: 'error' as const, title: 'Payment Failed', desc: 'Please update your card ending in 4242.', icon: AlertCircle },
            { type: 'message' as const, title: 'Driver Message', desc: '“I am parked outside by the blue pillar.”', icon: MessageSquare },
            { type: 'custom' as const, title: 'Uber One Reward', desc: '5% cashback applied to your mobility wallet.', icon: Sparkles },
          ].map((item, idx) => (
            <div
              key={item.type}
              style={{
                position: 'relative',
                height: 110,
                backgroundColor: Colors.dark.surface1,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: Spacing.radius.md,
                overflow: 'hidden',
              }}
            >
              <AnimatedNotification
                type={item.type}
                variant="card"
                position="center"
                title={item.title}
                description={item.desc}
                icon={item.icon}
                startFrame={idx * 4}
                displayDuration={999}
                entranceVariant="slide-down"
                showProgress={false}
                showCloseButton={false}
                width="92%"
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: Sequential Notifications Flow */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: Spacing.scale.md,
        }}
      >
        <div>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.brandLight }}>
            TEMPORAL CHOREOGRAPHY
          </span>
          <h3 style={{ ...Typography.headline.h3, margin: '4px 0 0 0', color: Colors.text.primary }}>
            Sequential Ride Lifecycle Notifications
          </h3>
          <p style={{ ...Typography.body.small, margin: '4px 0 0 0', color: Colors.text.secondary }}>
            Three notifications scheduled across distinct frame milestones simulating full ride progression.
          </p>
        </div>

        <div
          style={{
            position: 'relative',
            height: 220,
            backgroundColor: Colors.black,
            border: `1px solid ${Colors.border.default}`,
            borderRadius: Spacing.radius.lg,
            overflow: 'hidden',
          }}
        >
          {/* Notification 1: 0 - 35f */}
          <AnimatedNotification
            type="info"
            variant="toast"
            position="top-right"
            title="Driver Assigned"
            description="Marcus (Toyota Camry) is 4 min away."
            startFrame={0}
            displayDuration={35}
            entranceVariant="slide-down"
            exitVariant="fade-out"
          />

          {/* Notification 2: 40 - 75f */}
          <AnimatedNotification
            type="message"
            variant="floating"
            position="top-right"
            title="Marcus"
            description="“I am waiting at Passenger Pickup B.”"
            startFrame={40}
            displayDuration={35}
            entranceVariant="slide-left"
            exitVariant="slide-out"
            actionLabel="Reply"
          />

          {/* Notification 3: 80 - 120f */}
          <AnimatedNotification
            type="success"
            variant="card"
            position="top-right"
            title="Trip Started"
            description="Heading to San Francisco Airport (Terminal 2)."
            timestamp="Just now"
            startFrame={80}
            displayDuration={40}
            entranceVariant="pop-in"
            exitVariant="fade-out"
          />
        </div>
      </div>
    </div>
  );
};
