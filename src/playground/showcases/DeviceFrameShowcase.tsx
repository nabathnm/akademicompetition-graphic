/**
 * DeviceFrame Showcase
 * Interactive development and evaluation harness for the DeviceFrame component.
 * Demonstrates concentric screen geometry, multi-layered 2D depth shadows, hardware buttons,
 * notch cutouts (dynamic-island, punch-hole, notch, speaker), diagonal glass glare, and entrance kinetics.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Smartphone,
  Tablet,
  Monitor,
  Watch,
  Layers,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { DeviceFrame } from '../../components/mockups/DeviceFrame.tsx';
import type {
  DeviceFrameAnimation,
  DeviceNotchType,
  DeviceShadowPreset,
  DeviceSlideDirection,
} from '../../components/mockups/types.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

type DevicePresetKey = 'phone' | 'tablet' | 'desktop' | 'watch';

interface DevicePresetConfig {
  id: DevicePresetKey;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
  width: number;
  height: number;
  frameThickness: number;
  borderRadius: number;
  notch: DeviceNotchType;
  buttons: boolean;
  statusBar: boolean;
  homeBar: boolean;
  frameColor: string;
}

const DEVICE_PRESETS: Record<DevicePresetKey, DevicePresetConfig> = {
  phone: {
    id: 'phone',
    label: 'Smartphone (Pro)',
    icon: Smartphone,
    width: 320,
    height: 640,
    frameThickness: 12,
    borderRadius: 40,
    notch: 'dynamic-island',
    buttons: true,
    statusBar: true,
    homeBar: true,
    frameColor: '#1a1f2c',
  },
  tablet: {
    id: 'tablet',
    label: 'Tablet Display',
    icon: Tablet,
    width: 520,
    height: 380,
    frameThickness: 14,
    borderRadius: 26,
    notch: 'punch-hole',
    buttons: true,
    statusBar: true,
    homeBar: true,
    frameColor: '#171c26',
  },
  desktop: {
    id: 'desktop',
    label: 'Desktop Viewport',
    icon: Monitor,
    width: 540,
    height: 340,
    frameThickness: 10,
    borderRadius: 16,
    notch: 'none',
    buttons: false,
    statusBar: false,
    homeBar: false,
    frameColor: '#202633',
  },
  watch: {
    id: 'watch',
    label: 'Smart Watch',
    icon: Watch,
    width: 200,
    height: 240,
    frameThickness: 12,
    borderRadius: 36,
    notch: 'none',
    buttons: true,
    statusBar: false,
    homeBar: false,
    frameColor: '#181e28',
  },
};

export const DeviceFrameShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Selected preset form-factor
  const [activePreset, setActivePreset] = useState<DevicePresetKey>('phone');
  const preset = DEVICE_PRESETS[activePreset];

  // Interactive controls state
  const [animation, setAnimation] = useState<DeviceFrameAnimation>('spring');
  const [shadow, setShadow] = useState<DeviceShadowPreset>('medium');
  const [slideDir, setSlideDir] = useState<DeviceSlideDirection>('up');
  const [notch, setNotch] = useState<DeviceNotchType>(preset.notch);
  const [glare, setGlare] = useState(true);
  const [buttons, setButtons] = useState(preset.buttons);
  const [statusBar, setStatusBar] = useState(preset.statusBar);
  const [homeBar, setHomeBar] = useState(preset.homeBar);
  const [activeDemo, setActiveDemo] = useState<'rideshare' | 'analytics' | 'media'>('rideshare');
  const [replayOffset, setReplayOffset] = useState(0);

  // Switch preset helper
  const handleSelectPreset = (key: DevicePresetKey) => {
    setActivePreset(key);
    const p = DEVICE_PRESETS[key];
    setNotch(p.notch);
    setButtons(p.buttons);
    setStatusBar(p.statusBar);
    setHomeBar(p.homeBar);
  };

  // Replay animation by offsetting start frame
  const handleReplay = () => {
    setReplayOffset(currentFrame);
  };

  // Adjusted relative frame for loop or live preview
  const effectiveFrame = Math.max(0, currentFrame - replayOffset);

  // Concentric inner radius
  const concentricScreenRadius = Math.max(0, preset.borderRadius - preset.frameThickness);

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
      {/* 1. Diagnostic Telemetry Header */}
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
              width: 36,
              height: 36,
              borderRadius: Spacing.radius.sm,
              backgroundColor: 'rgba(39, 110, 241, 0.15)',
              border: `1px solid ${Colors.accent.brand}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.accent.brandLight,
            }}
          >
            <Layers size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
                LAYER 2 / LAYER 3 · MOCKUPS FOUNDATION
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontFamily: Typography.fontFamily.mono,
                  padding: '1px 6px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: Colors.accent.emerald,
                  border: `1px solid ${Colors.accent.emerald}40`,
                }}
              >
                ● READY
              </span>
            </div>
            <h3 style={{ ...Typography.headline.h4, color: Colors.text.primary, margin: 0 }}>
              DeviceFrame Architecture Benchmark
            </h3>
          </div>
        </div>

        {/* Live Diagnostics Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.lg }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              CONCENTRIC RADIUS
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.cyan }}>
              R_in={concentricScreenRadius}px (R_out={preset.borderRadius}px)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              VIEWPORT BOUNDS
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.emerald }}>
              {preset.width - preset.frameThickness * 2} × {preset.height - preset.frameThickness * 2} px
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              ENGINE STATE
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.amber }}>
              f={effectiveFrame} | {fps}fps
            </span>
          </div>

          <button
            type="button"
            onClick={handleReplay}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              backgroundColor: Colors.dark.surface2,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.sm,
              color: Colors.text.primary,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} />
            Replay Entrance
          </button>
        </div>
      </div>

      {/* 2. Form Factor Selector Bar */}
      <div
        style={{
          display: 'flex',
          gap: Spacing.scale.sm,
          backgroundColor: Colors.dark.surface1,
          padding: Spacing.scale.sm,
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
          flexWrap: 'wrap',
        }}
      >
        {(Object.keys(DEVICE_PRESETS) as DevicePresetKey[]).map((key) => {
          const item = DEVICE_PRESETS[key];
          const isSelected = activePreset === key;
          const IconComponent = item.icon;

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelectPreset(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: Spacing.radius.sm,
                backgroundColor: isSelected ? Colors.accent.brand : Colors.dark.surface2,
                border: `1px solid ${isSelected ? Colors.accent.brandLight : Colors.border.default}`,
                color: isSelected ? '#ffffff' : Colors.text.secondary,
                fontWeight: isSelected ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              <IconComponent size={16} />
              {item.label}
              <span
                style={{
                  fontSize: 10,
                  fontFamily: Typography.fontFamily.mono,
                  opacity: 0.75,
                }}
              >
                ({item.width}×{item.height})
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Parameter Controls Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: Spacing.scale.md,
          backgroundColor: Colors.dark.surface1,
          padding: Spacing.scale.md,
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        {/* Animation Variant */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            ENTRANCE KINETICS
          </label>
          <select
            value={animation}
            onChange={(e) => setAnimation(e.target.value as DeviceFrameAnimation)}
            style={{
              padding: '6px 10px',
              backgroundColor: Colors.dark.surface2,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.xs,
              color: Colors.text.primary,
              fontSize: 12,
              fontFamily: Typography.fontFamily.mono,
            }}
          >
            <option value="spring">spring (snappy settle)</option>
            <option value="pop">pop (bouncy overshoot)</option>
            <option value="slide-in">slide-in (directional)</option>
            <option value="scale-in">scale-in (zoom entrance)</option>
            <option value="rotate">rotate (angular tilt settle)</option>
            <option value="fade-in">fade-in (alpha reveal)</option>
            <option value="none">none (static)</option>
          </select>
        </div>

        {/* Slide Direction */}
        {animation === 'slide-in' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SLIDE DIRECTION
            </label>
            <select
              value={slideDir}
              onChange={(e) => setSlideDir(e.target.value as DeviceSlideDirection)}
              style={{
                padding: '6px 10px',
                backgroundColor: Colors.dark.surface2,
                border: `1px solid ${Colors.border.default}`,
                borderRadius: Spacing.radius.xs,
                color: Colors.text.primary,
                fontSize: 12,
                fontFamily: Typography.fontFamily.mono,
              }}
            >
              <option value="up">up (from bottom)</option>
              <option value="down">down (from top)</option>
              <option value="left">left (from right)</option>
              <option value="right">right (from left)</option>
            </select>
          </div>
        )}

        {/* 2D Shadow Depth */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            2D SHADOW PRESET
          </label>
          <select
            value={shadow}
            onChange={(e) => setShadow(e.target.value as DeviceShadowPreset)}
            style={{
              padding: '6px 10px',
              backgroundColor: Colors.dark.surface2,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.xs,
              color: Colors.text.primary,
              fontSize: 12,
              fontFamily: Typography.fontFamily.mono,
            }}
          >
            <option value="floating">floating (ambient 96px spread)</option>
            <option value="high">high (elevated 72px)</option>
            <option value="medium">medium (standard 48px)</option>
            <option value="subtle">subtle (minimal 24px)</option>
            <option value="none">none (flat)</option>
          </select>
        </div>

        {/* Notch Cutout Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            NOTCH / CUTOUT
          </label>
          <select
            value={notch}
            onChange={(e) => setNotch(e.target.value as DeviceNotchType)}
            style={{
              padding: '6px 10px',
              backgroundColor: Colors.dark.surface2,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.xs,
              color: Colors.text.primary,
              fontSize: 12,
              fontFamily: Typography.fontFamily.mono,
            }}
          >
            <option value="dynamic-island">dynamic-island (pill)</option>
            <option value="punch-hole">punch-hole (circle lens)</option>
            <option value="notch">notch (classic bezel)</option>
            <option value="speaker">speaker (minimal bar)</option>
            <option value="none">none (full screen)</option>
          </select>
        </div>

        {/* Hardware Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            DETAIL TOGGLES
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={glare} onChange={(e) => setGlare(e.target.checked)} />
              Glare
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={buttons} onChange={(e) => setButtons(e.target.checked)} />
              Buttons
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={statusBar} onChange={(e) => setStatusBar(e.target.checked)} />
              Status Bar
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={homeBar} onChange={(e) => setHomeBar(e.target.checked)} />
              Home Bar
            </label>
          </div>
        </div>

        {/* Demo Content Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            SCREEN CONTENT DEMO
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['rideshare', 'analytics', 'media'] as const).map((demoKey) => (
              <button
                key={demoKey}
                type="button"
                onClick={() => setActiveDemo(demoKey)}
                style={{
                  padding: '5px 10px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: activeDemo === demoKey ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${activeDemo === demoKey ? Colors.accent.cyan : Colors.border.default}`,
                  color: activeDemo === demoKey ? '#000000' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {demoKey}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Live Interactive Device Staging Stage */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 700,
          padding: `${Spacing.scale.xxl}px ${Spacing.scale.lg}px`,
          backgroundColor: Colors.dark.bgPrimary,
          borderRadius: Spacing.radius.lg,
          border: `1px solid ${Colors.border.default}`,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(39, 110, 241, 0.08) 0%, transparent 60%), radial-gradient(circle at 80% 80%, rgba(0, 229, 255, 0.04) 0%, transparent 50%)',
        }}
      >
        <DeviceFrame
          width={preset.width}
          height={preset.height}
          frameThickness={preset.frameThickness}
          borderRadius={preset.borderRadius}
          frameColor={preset.frameColor}
          shadow={shadow}
          notch={notch}
          glare={glare}
          buttons={buttons}
          statusBar={statusBar}
          homeBar={homeBar}
          animation={animation}
          slideDirection={slideDir}
          delay={0}
          durationInFrames={25}
        >
          {/* Active Demo Screen Mockups */}
          {activeDemo === 'rideshare' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0a0e17',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: statusBar ? '48px 18px 24px 18px' : '20px 18px 24px 18px',
                boxSizing: 'border-box',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              }}
            >
              {/* Top Greeting & Location Header */}
              <div>
                <div style={{ fontSize: 11, color: Colors.accent.cyan, fontWeight: 700, letterSpacing: '0.04em' }}>
                  AUTONOMOUS RIDE ACTIVE
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4, letterSpacing: '-0.02em' }}>
                  En Route to Mission District
                </div>
                <div style={{ fontSize: 12, color: Colors.text.tertiary, marginTop: 2 }}>
                  Estimated arrival: 4 mins (1.2 mi)
                </div>
              </div>

              {/* Center Stylized Route Card */}
              <div
                style={{
                  backgroundColor: '#131924',
                  borderRadius: 14,
                  padding: 14,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>Tesla Model S Plaid</span>
                  <span style={{ fontSize: 10, color: Colors.accent.emerald, fontWeight: 700 }}>● 98% BATTERY</span>
                </div>
                <div style={{ height: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '70%', height: '100%', backgroundColor: Colors.accent.cyan, borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: Colors.text.secondary }}>
                  <span>Speed: 34 mph</span>
                  <span>Safety Score: 99.8</span>
                </div>
              </div>

              {/* Bottom Driver Pill & Action */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div
                  style={{
                    backgroundColor: Colors.accent.brand,
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: 12,
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                    boxShadow: '0 4px 14px rgba(39, 110, 241, 0.4)',
                  }}
                >
                  Share Trip Status
                </div>
              </div>
            </div>
          )}

          {activeDemo === 'analytics' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0c1017',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: statusBar ? '48px 18px 24px 18px' : '20px 18px 24px 18px',
                boxSizing: 'border-box',
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              <div>
                <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.accent.emerald }}>
                  GLOBAL METRICS REVENUE
                </span>
                <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4, letterSpacing: '-0.03em' }}>
                  $148,290.40
                </div>
                <div style={{ fontSize: 11, color: Colors.accent.emerald, fontWeight: 600, marginTop: 2 }}>
                  ↑ +24.8% vs last month
                </div>
              </div>

              {/* Mini Bar Chart Mockup */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 8,
                  height: 100,
                  padding: '10px 0',
                }}
              >
                {[40, 65, 50, 85, 70, 95, 80, 100].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      backgroundColor: i === 7 ? Colors.accent.cyan : 'rgba(39, 110, 241, 0.35)',
                      borderRadius: 4,
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  backgroundColor: '#161c28',
                  borderRadius: 10,
                  padding: 12,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 11,
                }}
              >
                <span style={{ color: Colors.text.secondary }}>Active Instances</span>
                <span style={{ fontWeight: 700, color: Colors.accent.cyan }}>1,420 Pods</span>
              </div>
            </div>
          )}

          {activeDemo === 'media' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0d1117',
                color: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: statusBar ? '52px 20px 24px 20px' : '24px 20px 24px 20px',
                boxSizing: 'border-box',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 11, color: Colors.text.tertiary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Now Streaming
                </span>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>
                  Cybernetic Horizon
                </div>
                <div style={{ fontSize: 12, color: Colors.accent.cyan, marginTop: 2 }}>
                  Solaris Audio Lab
                </div>
              </div>

              {/* Album art mockup */}
              <div
                style={{
                  alignSelf: 'center',
                  width: Math.min(180, preset.width * 0.55),
                  height: Math.min(180, preset.width * 0.55),
                  borderRadius: 20,
                  background: 'linear-gradient(135deg, #276ef1 0%, #00e5ff 50%, #9333ea 100%)',
                  boxShadow: '0 12px 32px rgba(39, 110, 241, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={40} color="#ffffff" />
              </div>

              {/* Track Progress Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ height: 4, backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', backgroundColor: Colors.accent.cyan, borderRadius: 2 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                  <span>1:48</span>
                  <span>3:56</span>
                </div>
              </div>
            </div>
          )}
        </DeviceFrame>
      </div>

      {/* 5. Visual Variant Matrix Showcase */}
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
        <div>
          <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
            MULTI-FORM FACTOR COMPARISON
          </span>
          <h4 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 4 }}>
            Responsive Viewport Matrix
          </h4>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: Spacing.scale.lg,
            alignItems: 'center',
            justifyItems: 'center',
            padding: `${Spacing.scale.lg}px 0`,
          }}
        >
          {/* Card 1: Phone Mini */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.scale.sm }}>
            <DeviceFrame
              width={160}
              height={300}
              frameThickness={7}
              borderRadius={22}
              notch="dynamic-island"
              notchWidth={42}
              notchHeight={12}
              shadow="subtle"
              statusBar={false}
              homeBar={true}
              animation="none"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: Colors.accent.cyan,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: 8,
                  textAlign: 'center',
                }}
              >
                Smartphone (160×300)
              </div>
            </DeviceFrame>
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
              Compact Phone
            </span>
          </div>

          {/* Card 2: Tablet Landscape Mini */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.scale.sm }}>
            <DeviceFrame
              width={260}
              height={180}
              frameThickness={8}
              borderRadius={16}
              notch="punch-hole"
              notchWidth={8}
              notchHeight={8}
              shadow="subtle"
              statusBar={false}
              homeBar={true}
              animation="none"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: Colors.accent.emerald,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: 8,
                  textAlign: 'center',
                }}
              >
                Tablet (260×180)
              </div>
            </DeviceFrame>
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
              Tablet Landscape
            </span>
          </div>

          {/* Card 3: Desktop Viewport Mini */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.scale.sm }}>
            <DeviceFrame
              width={280}
              height={175}
              frameThickness={6}
              borderRadius={10}
              notch="none"
              shadow="subtle"
              statusBar={false}
              homeBar={false}
              animation="none"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#181e2b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: Colors.accent.amber,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: 8,
                  textAlign: 'center',
                }}
              >
                Desktop Browser (280×175)
              </div>
            </DeviceFrame>
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
              Desktop Viewport
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
