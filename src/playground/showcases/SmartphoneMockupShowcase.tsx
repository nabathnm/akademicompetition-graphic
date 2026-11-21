/**
 * SmartphoneMockup Showcase
 * Interactive development and evaluation harness for the SmartphoneMockup component.
 * Demonstrates calibrated smartphone models, custom aspect ratios, light/dark finishes,
 * continuous floating and tilt kinetics, status bar variations, and multi-device compositions.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Smartphone,
  Sparkles,
  RotateCcw,
  Activity,
  CreditCard,
  Compass,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup.tsx';
import type {
  DeviceFrameAnimation,
  DeviceNotchType,
  DeviceShadowPreset,
  DeviceSlideDirection,
  SmartphoneModelPreset,
} from '../../components/mockups/types.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

interface DeviceFinish {
  id: string;
  label: string;
  color: string;
  border: string;
}

const DEVICE_FINISHES: DeviceFinish[] = [
  { id: 'space-black', label: 'Space Black', color: '#161a22', border: 'rgba(255, 255, 255, 0.15)' },
  { id: 'titanium-silver', label: 'Natural Titanium', color: '#3a3f4d', border: 'rgba(255, 255, 255, 0.3)' },
  { id: 'deep-navy', label: 'Deep Navy', color: '#0f1d36', border: 'rgba(39, 110, 241, 0.3)' },
  { id: 'ceramic-white', label: 'Ceramic White', color: '#e2e8f0', border: 'rgba(0, 0, 0, 0.12)' },
  { id: 'rose-gold', label: 'Rose Gold', color: '#3d252b', border: 'rgba(244, 63, 94, 0.3)' },
];

export const SmartphoneMockupShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Model & finish configuration
  const [model, setModel] = useState<SmartphoneModelPreset>('flagship');
  const [finish, setFinish] = useState<DeviceFinish>(DEVICE_FINISHES[0]);
  const [aspectRatio, setAspectRatio] = useState<string>('9:19.5');

  // Cutout and details
  const [cameraCutout, setCameraCutout] = useState<DeviceNotchType>('dynamic-island');
  const [statusBarTheme, setStatusBarTheme] = useState<'dark' | 'light' | 'none'>('dark');
  const [showHomeBar, setShowHomeBar] = useState(true);
  const [showButtons, setShowButtons] = useState(true);
  const [glare, setGlare] = useState(true);
  const [shadow, setShadow] = useState<DeviceShadowPreset>('floating');

  // Kinetics
  const [animation, setAnimation] = useState<DeviceFrameAnimation>('spring');
  const [slideDir, setSlideDir] = useState<DeviceSlideDirection>('up');
  const [floating, setFloating] = useState(true);
  const [tilt, setTilt] = useState(true);
  const [screenReveal, setScreenReveal] = useState(true);
  const [replayOffset, setReplayOffset] = useState(0);

  // Screen content demo selector
  const [screenDemo, setScreenDemo] = useState<'fintech' | 'fitness' | 'screenshot' | 'multi'>('fintech');

  const handleReplay = () => {
    setReplayOffset(currentFrame);
  };

  const effectiveFrame = Math.max(0, currentFrame - replayOffset);

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
      {/* 1. Telemetry Header */}
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
            <Smartphone size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
                LAYER 2 / LAYER 3 · SPECIALIZED MOCKUP
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
              SmartphoneMockup Presentation Engine
            </h3>
          </div>
        </div>

        {/* Live Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.lg }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              MODEL / RATIO
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.cyan }}>
              {model.toUpperCase()} ({aspectRatio})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              CONTINUOUS MOTION
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.emerald }}>
              Float: {floating ? 'ON' : 'OFF'} | Tilt: {tilt ? 'ON' : 'OFF'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              REPLAY FRAME
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

      {/* 2. Model & Finish Selection Strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: Colors.dark.surface1,
          padding: Spacing.scale.sm,
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
          flexWrap: 'wrap',
          gap: Spacing.scale.sm,
        }}
      >
        {/* Model Presets */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['flagship', 'compact', 'pro-max', 'fold'] as SmartphoneModelPreset[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModel(m)}
              style={{
                padding: '6px 14px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: model === m ? Colors.accent.brand : Colors.dark.surface2,
                border: `1px solid ${model === m ? Colors.accent.brandLight : Colors.border.default}`,
                color: model === m ? '#ffffff' : Colors.text.secondary,
                fontWeight: model === m ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Hardware Finishes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            FINISH:
          </span>
          {DEVICE_FINISHES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFinish(f)}
              title={f.label}
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                backgroundColor: f.color,
                border: finish.id === f.id ? `2px solid ${Colors.accent.cyan}` : `1px solid ${f.border}`,
                boxShadow: finish.id === f.id ? '0 0 8px rgba(0, 229, 255, 0.4)' : undefined,
                cursor: 'pointer',
                padding: 0,
              }}
            />
          ))}
          <span style={{ fontSize: 11, color: Colors.text.secondary, marginLeft: 4 }}>
            {finish.label}
          </span>
        </div>
      </div>

      {/* 3. Parameter Controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: Spacing.scale.md,
          backgroundColor: Colors.dark.surface1,
          padding: Spacing.scale.md,
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        {/* Entrance Animation */}
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
            <option value="scale-in">scale-in (smooth zoom)</option>
            <option value="rotate">rotate (angular tilt settle)</option>
            <option value="fade-in">fade-in (clean alpha)</option>
            <option value="none">none (static)</option>
          </select>
        </div>

        {/* Direction for slide */}
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
              <option value="up">up (bottom to center)</option>
              <option value="down">down (top to center)</option>
              <option value="left">left (right to center)</option>
              <option value="right">right (left to center)</option>
            </select>
          </div>
        )}

        {/* Camera Cutout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            CAMERA CUTOUT
          </label>
          <select
            value={cameraCutout}
            onChange={(e) => setCameraCutout(e.target.value as DeviceNotchType)}
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
            <option value="dynamic-island">Dynamic Island</option>
            <option value="punch-hole">Punch Hole Lens</option>
            <option value="notch">Classic Notch</option>
            <option value="speaker">Speaker Slit Only</option>
            <option value="none">None (Full Bezel)</option>
          </select>
        </div>

        {/* Status Bar Theme */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            STATUS BAR CONTRAST
          </label>
          <select
            value={statusBarTheme}
            onChange={(e) => setStatusBarTheme(e.target.value as 'dark' | 'light' | 'none')}
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
            <option value="dark">Dark Theme (White Icons)</option>
            <option value="light">Light Theme (Dark Icons)</option>
            <option value="none">Hidden</option>
          </select>
        </div>

        {/* Aspect Ratio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            ASPECT RATIO
          </label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
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
            <option value="9:19.5">9:19.5 (Modern Flagship)</option>
            <option value="9:20">9:20 (Tall Flagship)</option>
            <option value="9:16">9:16 (Classic 16:9)</option>
            <option value="9:21">9:21 (Ultra Cinematic)</option>
          </select>
        </div>

        {/* 2D Shadow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            2D SHADOW
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
            <option value="floating">Floating (96px diffuse)</option>
            <option value="high">High Elevation</option>
            <option value="medium">Medium Depth</option>
            <option value="subtle">Subtle</option>
            <option value="none">None</option>
          </select>
        </div>

        {/* Continuous Kinetics & Detail Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            KINETICS & DETAILS
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={floating} onChange={(e) => setFloating(e.target.checked)} />
              Float
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={tilt} onChange={(e) => setTilt(e.target.checked)} />
              Tilt
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={screenReveal} onChange={(e) => setScreenReveal(e.target.checked)} />
              Reveal
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={glare} onChange={(e) => setGlare(e.target.checked)} />
              Glare
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showHomeBar} onChange={(e) => setShowHomeBar(e.target.checked)} />
              Home
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showButtons} onChange={(e) => setShowButtons(e.target.checked)} />
              Buttons
            </label>
          </div>
        </div>

        {/* Demo Content Mode */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            SCREEN CONTENT
          </label>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {[
              { id: 'fintech', label: 'FinTech' },
              { id: 'fitness', label: 'Fitness' },
              { id: 'screenshot', label: 'Mock Screenshot' },
              { id: 'multi', label: 'Multi-Device' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setScreenDemo(tab.id as typeof screenDemo)}
                style={{
                  padding: '5px 10px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: screenDemo === tab.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${screenDemo === tab.id ? Colors.accent.cyan : Colors.border.default}`,
                  color: screenDemo === tab.id ? '#000000' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Live Smartphone Stage Viewport */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 740,
          padding: `${Spacing.scale.xxl}px ${Spacing.scale.lg}px`,
          backgroundColor: Colors.dark.bgPrimary,
          borderRadius: Spacing.radius.lg,
          border: `1px solid ${Colors.border.default}`,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'radial-gradient(circle at 50% 25%, rgba(39, 110, 241, 0.1) 0%, transparent 65%), radial-gradient(circle at 85% 80%, rgba(0, 229, 255, 0.05) 0%, transparent 50%)',
        }}
      >
        {/* Render Single Device OR Multi-Device Composition */}
        {screenDemo !== 'multi' ? (
          <SmartphoneMockup
            model={model}
            aspectRatio={aspectRatio}
            deviceColor={finish.color}
            shadow={shadow}
            cameraCutout={cameraCutout}
            showStatusBar={statusBarTheme === 'none' ? false : statusBarTheme}
            showHomeIndicator={showHomeBar}
            showButtons={showButtons}
            glare={glare}
            animation={animation}
            slideDirection={slideDir}
            floating={floating ? { amplitude: 9, frequency: 0.45 } : false}
            tilt={tilt ? { maxAngle: 2.8, frequency: 0.3 } : false}
            screenReveal={screenReveal ? { delay: 12, duration: 16, type: 'wipe-up' } : false}
            delay={0}
            durationInFrames={25}
          >
            {/* FinTech App UI Demo */}
            {screenDemo === 'fintech' && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#090d16',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: statusBarTheme !== 'none' ? '46px 18px 24px 18px' : '22px 18px 24px 18px',
                  boxSizing: 'border-box',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                }}
              >
                {/* Header */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: Colors.accent.cyan, fontWeight: 700, letterSpacing: '0.04em' }}>
                      TOTAL NET ASSETS
                    </span>
                    <span style={{ fontSize: 10, color: Colors.accent.emerald, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TrendingUp size={12} /> +18.4%
                    </span>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, marginTop: 4, letterSpacing: '-0.03em' }}>
                    $84,392.20
                  </div>
                </div>

                {/* Virtual Card Graphic */}
                <div
                  style={{
                    borderRadius: 16,
                    padding: 16,
                    background: 'linear-gradient(135deg, #276ef1 0%, #00e5ff 60%, #4338ca 100%)',
                    boxShadow: '0 8px 24px rgba(39, 110, 241, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: 120,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>Quantum Obsidian</span>
                    <CreditCard size={18} color="#ffffff" />
                  </div>
                  <div style={{ fontSize: 14, fontFamily: Typography.fontFamily.mono, letterSpacing: '0.12em' }}>
                    •••• 8821
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, opacity: 0.85 }}>
                    <span>CARDHOLDER</span>
                    <span>EXP 10/29</span>
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span style={{ fontSize: 11, color: Colors.text.tertiary, fontWeight: 600 }}>
                    RECENT TRANSACTIONS
                  </span>
                  {[
                    { label: 'Stripe Global Transfer', amount: '+$3,400.00', time: '10:42 AM' },
                    { label: 'AWS Cloud Services', amount: '-$420.50', time: 'Yesterday' },
                  ].map((tx, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#111724',
                        padding: '10px 12px',
                        borderRadius: 10,
                        fontSize: 11,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600 }}>{tx.label}</div>
                        <div style={{ fontSize: 9, color: Colors.text.tertiary }}>{tx.time}</div>
                      </div>
                      <span style={{ fontWeight: 700, color: tx.amount.startsWith('+') ? Colors.accent.emerald : '#ffffff' }}>
                        {tx.amount}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div
                  style={{
                    backgroundColor: Colors.accent.brand,
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: 12,
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  Transfer Funds
                </div>
              </div>
            )}

            {/* Fitness Tracker Demo */}
            {screenDemo === 'fitness' && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0c121e',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: statusBarTheme !== 'none' ? '46px 18px 24px 18px' : '22px 18px 24px 18px',
                  boxSizing: 'border-box',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                }}
              >
                <div>
                  <span style={{ fontSize: 11, color: Colors.accent.amber, fontWeight: 700 }}>
                    DAILY BIOMETRICS
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
                    Active Energy
                  </div>
                </div>

                {/* Progress Metric Wheel */}
                <div
                  style={{
                    alignSelf: 'center',
                    width: 130,
                    height: 130,
                    borderRadius: '50%',
                    border: '8px solid rgba(255, 255, 255, 0.08)',
                    borderTopColor: Colors.accent.amber,
                    borderRightColor: Colors.accent.cyan,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Activity size={22} color={Colors.accent.amber} />
                  <span style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>840</span>
                  <span style={{ fontSize: 9, color: Colors.text.tertiary }}>KCAL</span>
                </div>

                {/* Metrics Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ backgroundColor: '#141d2e', padding: 12, borderRadius: 12 }}>
                    <div style={{ fontSize: 10, color: Colors.text.tertiary }}>STEPS</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>11,482</div>
                  </div>
                  <div style={{ backgroundColor: '#141d2e', padding: 12, borderRadius: 12 }}>
                    <div style={{ fontSize: 10, color: Colors.text.tertiary }}>DISTANCE</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>8.4 km</div>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: Colors.accent.amber,
                    color: '#000000',
                    padding: '12px',
                    borderRadius: 12,
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  Start Workout
                </div>
              </div>
            )}

            {/* Simulated Screenshot Canvas Demo */}
            {screenDemo === 'screenshot' && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: statusBarTheme !== 'none' ? '50px 20px 24px 20px' : '24px 20px 24px 20px',
                  boxSizing: 'border-box',
                  fontFamily: Typography.fontFamily.sans,
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: Colors.accent.brand }}>
                    <Compass size={18} />
                    <span style={{ fontSize: 12, fontWeight: 700 }}>MapVoyager iOS</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8, letterSpacing: '-0.02em' }}>
                    San Francisco Bay
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                    Realistic screenshot graphic rendered with light app contrast.
                  </p>
                </div>

                {/* Mock Screenshot Graphic */}
                <div
                  style={{
                    backgroundColor: '#f1f5f9',
                    borderRadius: 14,
                    height: 180,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed #cbd5e1',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <Sparkles size={32} color={Colors.accent.brand} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#475569' }}>
                    Screenshot Slot (cover / contain)
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    padding: '12px',
                    borderRadius: 12,
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  Open in Maps
                </div>
              </div>
            )}
          </SmartphoneMockup>
        ) : (
          /* Multi-Device Dual Showcase: Overlapping Staggered Composition */
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              width: '100%',
              minHeight: 640,
            }}
          >
            {/* Background Device 1: Feed Overview */}
            <div
              style={{
                position: 'relative',
                transform: 'scale(0.88) translateX(-110px)',
                zIndex: 1,
                opacity: 0.85,
              }}
            >
              <SmartphoneMockup
                model="compact"
                deviceColor="#1e2430"
                shadow="medium"
                cameraCutout="punch-hole"
                showStatusBar={true}
                showHomeIndicator={true}
                animation="slide-in"
                slideDirection="left"
                delay={0}
                durationInFrames={25}
                floating={false}
                tilt={false}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0a0e17',
                    color: '#ffffff',
                    padding: '42px 14px 20px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    fontSize: 11,
                  }}
                >
                  <span style={{ fontWeight: 700, color: Colors.accent.cyan }}>DISCOVER STORIES</span>
                  <div style={{ height: 120, backgroundColor: '#131b2c', borderRadius: 12 }} />
                  <div style={{ height: 60, backgroundColor: '#131b2c', borderRadius: 10 }} />
                  <div style={{ height: 60, backgroundColor: '#131b2c', borderRadius: 10 }} />
                </div>
              </SmartphoneMockup>
            </div>

            {/* Foreground Device 2: Hero Details (Staggered Entrance + Floating) */}
            <div
              style={{
                position: 'relative',
                transform: 'scale(1.0) translateX(70px)',
                zIndex: 2,
              }}
            >
              <SmartphoneMockup
                model="flagship"
                deviceColor="#3a3f4d"
                shadow="floating"
                cameraCutout="dynamic-island"
                showStatusBar={true}
                showHomeIndicator={true}
                animation="spring"
                delay={6}
                durationInFrames={25}
                floating={{ amplitude: 7, frequency: 0.4 }}
                tilt={{ maxAngle: 2.2, frequency: 0.28 }}
                screenReveal={{ delay: 18, duration: 15, type: 'wipe-up' }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0c101b',
                    color: '#ffffff',
                    padding: '48px 18px 24px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  }}
                >
                  <div>
                    <span style={{ fontSize: 10, color: Colors.accent.emerald, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={12} /> TRIP CONFIRMED
                    </span>
                    <div style={{ fontSize: 20, fontWeight: 800, marginTop: 4 }}>
                      Waymo One Autonomous
                    </div>
                  </div>

                  <div
                    style={{
                      height: 140,
                      borderRadius: 14,
                      background: 'linear-gradient(135deg, #276ef1 0%, #00e5ff 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 700,
                    }}
                  >
                    Live GPS Telemetry
                  </div>

                  <div
                    style={{
                      backgroundColor: Colors.accent.brand,
                      color: '#ffffff',
                      padding: '12px',
                      borderRadius: 12,
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    Track in Real-Time
                  </div>
                </div>
              </SmartphoneMockup>
            </div>
          </div>
        )}
      </div>

      {/* 5. Matrix Multi-Finish View */}
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
            FINISH & BEZEL MATRIX
          </span>
          <h4 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 4 }}>
            Hardware Finishes & Cutout Styles
          </h4>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: Spacing.scale.lg,
            alignItems: 'center',
            justifyItems: 'center',
            padding: `${Spacing.scale.md}px 0`,
          }}
        >
          {DEVICE_FINISHES.slice(0, 4).map((f) => (
            <div
              key={f.id}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.scale.xs }}
            >
              <SmartphoneMockup
                width={150}
                height={290}
                frameThickness={7}
                borderRadius={20}
                deviceColor={f.color}
                shadow="subtle"
                cameraCutout="dynamic-island"
                showStatusBar={false}
                showHomeIndicator={true}
                animation="none"
                floating={false}
                tilt={false}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: f.id === 'ceramic-white' ? '#f8fafc' : '#0f172a',
                    color: f.id === 'ceramic-white' ? '#0f172a' : Colors.accent.cyan,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    fontWeight: 700,
                    textAlign: 'center',
                    padding: 8,
                  }}
                >
                  {f.label}
                </div>
              </SmartphoneMockup>
              <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
