/**
 * TabletMockup Showcase
 * Interactive playground showcase for TabletMockup.
 * Demonstrates landscape and portrait tablet orientations, calibrated presets (compact, standard, pro),
 * metallic hardware finishes, Touch ID home button, magnetic stylus dock, tablet status bar,
 * deterministic entrance animations, floating/tilt kinetics, device rotation, and rich screen applications.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Tablet,
  RotateCcw,
  Check,
  LayoutDashboard,
  BookOpen,
  Presentation,
} from 'lucide-react';
import { TabletMockup } from '../../components/mockups/TabletMockup.tsx';
import type {
  DeviceFrameAnimation,
  DeviceShadowPreset,
  DeviceSlideDirection,
  TabletFinish,
  TabletModelPreset,
  TabletOrientation,
} from '../../components/mockups/types.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

interface FinishOption {
  id: TabletFinish;
  label: string;
  color: string;
  accent: string;
}

const TABLET_FINISHES: FinishOption[] = [
  { id: 'space-gray', label: 'Space Gray', color: '#1e2430', accent: '#475569' },
  { id: 'silver', label: 'Silver', color: '#d8dde6', accent: '#94a3b8' },
  { id: 'starlight', label: 'Starlight', color: '#e8e4dc', accent: '#d2cecaa' },
  { id: 'midnight', label: 'Midnight', color: '#161c28', accent: '#1e293b' },
  { id: 'rose-gold', label: 'Rose Gold', color: '#e8cfc8', accent: '#f43f5e' },
  { id: 'sky-blue', label: 'Sky Blue', color: '#a8c6db', accent: '#0284c7' },
];

export const TabletMockupShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Orientation & Form Factor
  const [orientation, setOrientation] = useState<TabletOrientation>('landscape');
  const [model, setModel] = useState<TabletModelPreset>('standard');
  const [finish, setFinish] = useState<FinishOption>(TABLET_FINISHES[0]);
  const [aspectRatio, setAspectRatio] = useState<string>('4:3');

  // Animation Kinetics
  const [animation, setAnimation] = useState<DeviceFrameAnimation>('spring');
  const [slideDir, setSlideDir] = useState<DeviceSlideDirection>('up');
  const [shadow, setShadow] = useState<DeviceShadowPreset>('floating');
  const [floating, setFloating] = useState(true);
  const [tilt, setTilt] = useState(true);
  const [rotateAnim, setRotateAnim] = useState(false);
  const [screenReveal, setScreenReveal] = useState(true);

  // Hardware Details
  const [showCamera, setShowCamera] = useState(true);
  const [showHomeButton, setShowHomeButton] = useState(false);
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showHomeIndicator, setShowHomeIndicator] = useState(true);
  const [showStylus, setShowStylus] = useState(true);
  const [glare, setGlare] = useState(true);

  // Screen Demo
  const [screenDemo, setScreenDemo] = useState<'dashboard' | 'publication' | 'presentation'>('dashboard');
  const [replayOffset, setReplayOffset] = useState(0);

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
      {/* 1. Diagnostic Header */}
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
              backgroundColor: 'rgba(0, 229, 255, 0.15)',
              border: `1px solid ${Colors.accent.cyan}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.accent.cyan,
            }}
          >
            <Tablet size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
                LAYER 2 / LAYER 3 · TABLET MOCKUP
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
              TabletMockup Presentation Engine
            </h3>
          </div>
        </div>

        {/* Live Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.lg }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              ORIENTATION
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.cyan }}>
              {orientation.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              PRESET
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.emerald }}>
              {model.toUpperCase()} ({aspectRatio})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              TIMELINE
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.amber }}>
              f={effectiveFrame} ({((effectiveFrame / fps) % 60).toFixed(1)}s)
            </span>
          </div>

          <button
            type="button"
            onClick={handleReplay}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: Spacing.radius.sm,
              backgroundColor: Colors.accent.cyan,
              border: 'none',
              color: '#000000',
              fontFamily: Typography.fontFamily.mono,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={14} />
            REPLAY
          </button>
        </div>
      </div>

      {/* 2. Controls Panel */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: Spacing.scale.md,
          padding: Spacing.scale.md,
          backgroundColor: Colors.dark.surface1,
          borderRadius: Spacing.radius.md,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        {/* Orientation Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            ORIENTATION
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['landscape', 'portrait'] as TabletOrientation[]).map((ori) => (
              <button
                key={ori}
                type="button"
                onClick={() => setOrientation(ori)}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: orientation === ori ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${orientation === ori ? Colors.accent.cyan : Colors.border.default}`,
                  color: orientation === ori ? '#000000' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {ori === 'landscape' ? 'Landscape (Horizontal)' : 'Portrait (Vertical)'}
              </button>
            ))}
          </div>
        </div>

        {/* Model Size Preset */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            DEVICE SIZE PRESET
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'compact', label: '8.3" Mini' },
              { id: 'standard', label: '11" Standard' },
              { id: 'pro', label: '12.9" Pro' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setModel(p.id as TabletModelPreset)}
                style={{
                  flex: 1,
                  padding: '6px 6px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: model === p.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${model === p.id ? Colors.accent.cyan : Colors.border.default}`,
                  color: model === p.id ? '#000000' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            DISPLAY ASPECT RATIO
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {['4:3', '16:10', '3:2'].map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: aspectRatio === ratio ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${aspectRatio === ratio ? Colors.accent.cyan : Colors.border.default}`,
                  color: aspectRatio === ratio ? '#000000' : Colors.text.secondary,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Hardware Metallic Finish */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            METALLIC FINISH
          </label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TABLET_FINISHES.map((f) => {
              const isSelected = finish.id === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFinish(f)}
                  title={f.label}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    backgroundColor: f.color,
                    border: isSelected ? `2px solid ${Colors.accent.cyan}` : '1.5px solid rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 8px rgba(0, 229, 255, 0.5)' : 'none',
                  }}
                >
                  {isSelected && <Check size={13} color="#ffffff" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Entrance Animation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            ENTRANCE ANIMATION
          </label>
          <select
            value={animation}
            onChange={(e) => setAnimation(e.target.value as DeviceFrameAnimation)}
            style={{
              padding: '6px 8px',
              backgroundColor: Colors.dark.surface2,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.xs,
              color: Colors.text.primary,
              fontSize: 12,
              fontFamily: Typography.fontFamily.mono,
            }}
          >
            <option value="spring">spring (overshoot damping)</option>
            <option value="pop">pop (bouncy entrance)</option>
            <option value="scale-in">scale-in (elastic)</option>
            <option value="slide-in">slide-in (directional)</option>
            <option value="rotate">rotate (perspective settle)</option>
            <option value="fade-in">fade-in (smooth alpha)</option>
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
                padding: '6px 8px',
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

        {/* Depth Shadow */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            DEPTH SHADOW
          </label>
          <select
            value={shadow}
            onChange={(e) => setShadow(e.target.value as DeviceShadowPreset)}
            style={{
              padding: '6px 8px',
              backgroundColor: Colors.dark.surface2,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: Spacing.radius.xs,
              color: Colors.text.primary,
              fontSize: 12,
              fontFamily: Typography.fontFamily.mono,
            }}
          >
            <option value="floating">floating (96px ambient spread)</option>
            <option value="high">high (elevated 72px)</option>
            <option value="medium">medium (standard 48px)</option>
            <option value="subtle">subtle (minimal 24px)</option>
            <option value="none">none (flat)</option>
          </select>
        </div>

        {/* Hardware & Kinetic Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            HARDWARE & KINETIC ACCENTS
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showCamera} onChange={(e) => setShowCamera(e.target.checked)} />
              Camera
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showHomeButton} onChange={(e) => setShowHomeButton(e.target.checked)} />
              Home Button
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showStatusBar} onChange={(e) => setShowStatusBar(e.target.checked)} />
              Status Bar
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showHomeIndicator} onChange={(e) => setShowHomeIndicator(e.target.checked)} />
              Indicator
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showStylus} onChange={(e) => setShowStylus(e.target.checked)} />
              Stylus Dock
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={glare} onChange={(e) => setGlare(e.target.checked)} />
              Glare
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={floating} onChange={(e) => setFloating(e.target.checked)} />
              Float
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={tilt} onChange={(e) => setTilt(e.target.checked)} />
              Tilt
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={rotateAnim} onChange={(e) => setRotateAnim(e.target.checked)} />
              Rotate 90°
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={screenReveal} onChange={(e) => setScreenReveal(e.target.checked)} />
              Reveal
            </label>
          </div>
        </div>

        {/* Screen Content Demo Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            SCREEN APPLICATION DEMO
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'dashboard', label: 'Analytics BI', icon: LayoutDashboard },
              { id: 'publication', label: 'Magazine E-Book', icon: BookOpen },
              { id: 'presentation', label: 'Executive Deck', icon: Presentation },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setScreenDemo(tab.id as typeof screenDemo)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '6px 8px',
                    borderRadius: Spacing.radius.xs,
                    backgroundColor: screenDemo === tab.id ? Colors.accent.cyan : Colors.dark.surface2,
                    border: `1px solid ${screenDemo === tab.id ? Colors.accent.cyan : Colors.border.default}`,
                    color: screenDemo === tab.id ? '#000000' : Colors.text.secondary,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Live Staging Stage */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 760,
          padding: `${Spacing.scale.xxl}px ${Spacing.scale.lg}px`,
          backgroundColor: Colors.dark.bgPrimary,
          borderRadius: Spacing.radius.lg,
          border: `1px solid ${Colors.border.default}`,
          position: 'relative',
          overflow: 'hidden',
          backgroundImage:
            'radial-gradient(circle at 50% 30%, rgba(0, 229, 255, 0.08) 0%, transparent 65%), radial-gradient(circle at 80% 85%, rgba(39, 110, 241, 0.05) 0%, transparent 50%)',
        }}
      >
        <TabletMockup
          orientation={orientation}
          model={model}
          aspectRatio={aspectRatio}
          deviceColor={finish.color}
          shadow={shadow}
          showCamera={showCamera}
          showHomeButton={showHomeButton}
          showStatusBar={showStatusBar}
          showHomeIndicator={showHomeIndicator}
          showStylus={showStylus}
          glare={glare}
          animation={animation}
          slideDirection={slideDir}
          floating={floating ? { amplitude: 6, frequency: 0.45 } : false}
          tilt={tilt ? { maxAngle: 2.2, frequency: 0.3 } : false}
          rotationAnimation={rotateAnim ? { startFrame: 10, duration: 35, fromAngle: 0, toAngle: 90 } : false}
          screenReveal={screenReveal ? { delay: 10, duration: 18, type: 'wipe-up' } : false}
          delay={0}
          durationInFrames={25}
        >
          {/* Demo 1: Tablet Analytics BI Dashboard */}
          {screenDemo === 'dashboard' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0a0e17',
                color: '#f8fafc',
                display: 'flex',
                overflow: 'hidden',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              {/* Sidebar */}
              <div
                style={{
                  width: orientation === 'landscape' ? 160 : 120,
                  borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                  backgroundColor: '#070a10',
                  padding: '40px 14px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: Colors.accent.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, fontSize: 12 }}>
                    T
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: -0.3 }}>Nexus BI</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {['Overview', 'Traffic', 'Customers', 'Reports', 'Settings'].map((item, idx) => (
                    <div
                      key={item}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        backgroundColor: idx === 0 ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                        color: idx === 0 ? Colors.accent.cyan : '#94a3b8',
                        fontSize: 11,
                        fontWeight: idx === 0 ? 700 : 500,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Analytics Canvas */}
              <div style={{ flex: 1, padding: '38px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#ffffff' }}>Performance Analytics</h4>
                    <span style={{ fontSize: 11, color: '#64748b' }}>Live data stream synchronized</span>
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 12, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: Colors.accent.emerald, fontSize: 10, fontWeight: 700 }}>
                    ● ONLINE
                  </span>
                </div>

                {/* KPI Stat Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {[
                    { label: 'Active Users', value: '48,290', delta: '+14.2%', color: Colors.accent.cyan },
                    { label: 'Conversion', value: '4.82%', delta: '+2.1%', color: Colors.accent.emerald },
                    { label: 'Monthly MRR', value: '$184,500', delta: '+18.6%', color: Colors.accent.electricViolet },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        padding: 12,
                        backgroundColor: '#111726',
                        borderRadius: 8,
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{stat.label}</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>{stat.value}</span>
                      <span style={{ fontSize: 10, color: stat.color, fontWeight: 600 }}>{stat.delta} vs last month</span>
                    </div>
                  ))}
                </div>

                {/* Simulated Chart Area */}
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#111726',
                    borderRadius: 8,
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>Revenue Growth (Q3-Q4)</span>
                    <span style={{ fontSize: 10, color: '#64748b' }}>Updated 2m ago</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 8, paddingTop: 10 }}>
                    {[38, 52, 45, 68, 60, 84, 78, 92, 88, 100].map((h, i) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div
                          style={{
                            width: '100%',
                            height: `${h}%`,
                            backgroundColor: i === 9 ? Colors.accent.cyan : 'rgba(0, 229, 255, 0.35)',
                            borderRadius: '3px 3px 0 0',
                          }}
                        />
                        <span style={{ fontSize: 8, color: '#64748b' }}>W{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demo 2: Digital Magazine & Publication Layout */}
          {screenDemo === 'publication' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f8fafc',
                color: '#0f172a',
                padding: '36px 28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                overflow: 'hidden',
                fontFamily: 'Georgia, Cambria, serif',
              }}
            >
              {/* Publication Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #0f172a', paddingBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 9, fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: 2, color: '#64748b', fontWeight: 700 }}>
                    THE QUARTERLY DESIGN CHRONICLE · ISSUE 42
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>
                    The Next Architecture of Spatial Computing
                  </h3>
                </div>
                <span style={{ fontSize: 11, fontFamily: 'sans-serif', color: '#64748b' }}>OCTOBER 2026</span>
              </div>

              {/* Two Column Article Body */}
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: orientation === 'landscape' ? '1.2fr 1fr' : '1fr', gap: 18, overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div
                    style={{
                      height: orientation === 'landscape' ? 140 : 100,
                      backgroundColor: '#1e293b',
                      borderRadius: 6,
                      background: 'linear-gradient(135deg, #0284c7 0%, #1e1b4b 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                    }}
                  >
                    <span style={{ fontFamily: 'sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
                      COMPUTATIONAL AESTHETICS
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: '#334155' }}>
                    As physical boundaries between personal workstations, creative tablets, and distributed cloud computing dissolve, motion graphics components require frame-accurate deterministic pipelines.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <blockquote
                    style={{
                      margin: 0,
                      padding: '10px 14px',
                      backgroundColor: '#e2e8f0',
                      borderLeft: `4px solid ${Colors.accent.brand}`,
                      borderRadius: '0 6px 6px 0',
                      fontStyle: 'italic',
                      fontSize: 12,
                      lineHeight: 1.5,
                      color: '#1e293b',
                    }}
                  >
                    "Precision geometry and frame-driven transforms render seamless digital artifacts that feel tangible in the hand."
                  </blockquote>
                  <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#475569' }}>
                    Tablet layouts uniquely empower dynamic landscape-to-portrait orientation shifts without breaking composition flows.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Demo 3: Executive Slide Presentation */}
          {screenDemo === 'presentation' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#030712',
                color: '#ffffff',
                padding: '40px 32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.cyan, fontWeight: 700 }}>
                    ACME MOTION LABS · STRATEGIC ROADMAP
                  </span>
                </div>
                <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: -0.8 }}>
                  Accelerating High-Fidelity UI Motion
                </h2>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#94a3b8' }}>
                  Next-generation device hardware presentation primitives built for Remotion.
                </p>
              </div>

              {/* 3 Pillars */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { num: '01', title: 'Deterministic', desc: '100% frame-driven with zero browser timing drift' },
                  { num: '02', title: 'Concentric Radii', desc: 'Inner screen curves adapt perfectly to chassis outer bevel' },
                  { num: '03', title: 'Hardware Accents', desc: 'Touch ID, magnetic stylus dock, and tablet status bars' },
                ].map((pillar) => (
                  <div
                    key={pillar.num}
                    style={{
                      padding: 14,
                      borderRadius: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 900, color: Colors.accent.cyan }}>{pillar.num}</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{pillar.title}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.4 }}>{pillar.desc}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 10 }}>
                <span style={{ fontSize: 10, color: '#64748b' }}>CONFIDENTIAL · FOR INTERNAL REVIEW ONLY</span>
                <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.accent.emerald }}>SLIDE 04 / 12</span>
              </div>
            </div>
          )}
        </TabletMockup>
      </div>
    </div>
  );
};
