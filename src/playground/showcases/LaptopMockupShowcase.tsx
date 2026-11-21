/**
 * LaptopMockup Showcase
 * Interactive development and evaluation harness for the LaptopMockup component.
 * Demonstrates 13/15/16-inch sizes, metallic finishes, deterministic lid opening kinetics,
 * continuous floating and tilt motion, and rich SaaS dashboard / website screen content.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Laptop,
  RotateCcw,
  Sparkles,
  BarChart3,
  Globe,
  Activity,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { LaptopMockup } from '../../components/mockups/LaptopMockup.tsx';
import type {
  DeviceFrameAnimation,
  DeviceShadowPreset,
  DeviceSlideDirection,
  LaptopModelPreset,
} from '../../components/mockups/types.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

interface LaptopFinish {
  id: string;
  label: string;
  color: string;
  accent: string;
}

const LAPTOP_FINISHES: LaptopFinish[] = [
  { id: 'space-gray', label: 'Space Gray', color: '#1e2430', accent: '#475569' },
  { id: 'silver', label: 'Natural Silver', color: '#384152', accent: '#94a3b8' },
  { id: 'midnight', label: 'Midnight Obsidian', color: '#0f141d', accent: '#1e293b' },
  { id: 'starlight', label: 'Starlight Gold', color: '#2d2627', accent: '#cbd5e1' },
];

export const LaptopMockupShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Model size & finish
  const [model, setModel] = useState<LaptopModelPreset>('standard');
  const [finish, setFinish] = useState<LaptopFinish>(LAPTOP_FINISHES[0]);
  const [aspectRatio, setAspectRatio] = useState<string>('16:10');

  // Animation and details
  const [animation, setAnimation] = useState<DeviceFrameAnimation>('spring');
  const [slideDir, setSlideDir] = useState<DeviceSlideDirection>('up');
  const [shadow, setShadow] = useState<DeviceShadowPreset>('floating');
  const [openingAnim, setOpeningAnim] = useState(true);
  const [floating, setFloating] = useState(true);
  const [tilt, setTilt] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showTrackpad, setShowTrackpad] = useState(true);
  const [showHinge, setShowHinge] = useState(true);
  const [showCamera, setShowCamera] = useState(true);
  const [glare, setGlare] = useState(true);
  const [screenReveal, setScreenReveal] = useState(true);

  // Content selector
  const [screenDemo, setScreenDemo] = useState<'dashboard' | 'website' | 'presentation'>('dashboard');
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
              backgroundColor: 'rgba(39, 110, 241, 0.15)',
              border: `1px solid ${Colors.accent.brand}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.accent.brandLight,
            }}
          >
            <Laptop size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
                LAYER 2 / LAYER 3 · LAPTOP MOCKUP
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
              LaptopMockup Presentation Engine
            </h3>
          </div>
        </div>

        {/* Live Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.lg }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              FORM FACTOR
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.cyan }}>
              {model.toUpperCase()} ({aspectRatio})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              LID OPENING
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.emerald }}>
              {openingAnim ? 'DETERMINISTIC OPEN' : 'STATIC 0°'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              FRAME TIMELINE
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
            Replay Sequence
          </button>
        </div>
      </div>

      {/* 2. Model & Finish Selection Bar */}
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
        {/* Sizes */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { id: 'compact', label: '13" Compact (560px)' },
            { id: 'standard', label: '15" Standard (680px)' },
            { id: 'pro', label: '16" Pro (780px)' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setModel(item.id as LaptopModelPreset)}
              style={{
                padding: '6px 14px',
                borderRadius: Spacing.radius.xs,
                backgroundColor: model === item.id ? Colors.accent.brand : Colors.dark.surface2,
                border: `1px solid ${model === item.id ? Colors.accent.brandLight : Colors.border.default}`,
                color: model === item.id ? '#ffffff' : Colors.text.secondary,
                fontWeight: model === item.id ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Hardware Finishes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            CHASSIS:
          </span>
          {LAPTOP_FINISHES.map((f) => (
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
                border: finish.id === f.id ? `2px solid ${Colors.accent.cyan}` : '1px solid rgba(255, 255, 255, 0.2)',
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
              <option value="up">up (bottom to center)</option>
              <option value="down">down (top to center)</option>
              <option value="left">left (right to center)</option>
              <option value="right">right (left to center)</option>
            </select>
          </div>
        )}

        {/* Aspect Ratio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            SCREEN ASPECT RATIO
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
            <option value="16:10">16:10 (Modern Pro Standard)</option>
            <option value="16:9">16:9 (Cinematic 1080p)</option>
            <option value="3:2">3:2 (Productivity Canvas)</option>
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
            <option value="floating">floating (96px diffuse spread)</option>
            <option value="high">high (elevated 72px)</option>
            <option value="medium">medium (standard 48px)</option>
            <option value="subtle">subtle (minimal 24px)</option>
            <option value="none">none (flat)</option>
          </select>
        </div>

        {/* Hardware Detail Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            HARDWARE & KINETIC TOGGLES
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={openingAnim} onChange={(e) => setOpeningAnim(e.target.checked)} />
              Opening
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
              <input type="checkbox" checked={showKeyboard} onChange={(e) => setShowKeyboard(e.target.checked)} />
              Keys
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showTrackpad} onChange={(e) => setShowTrackpad(e.target.checked)} />
              Trackpad
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showHinge} onChange={(e) => setShowHinge(e.target.checked)} />
              Hinge
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showCamera} onChange={(e) => setShowCamera(e.target.checked)} />
              Webcam
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={glare} onChange={(e) => setGlare(e.target.checked)} />
              Glare
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
            SCREEN CONTENT
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'dashboard', label: 'Analytics' },
              { id: 'website', label: 'Hero Page' },
              { id: 'presentation', label: 'Slide Deck' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setScreenDemo(tab.id as typeof screenDemo)}
                style={{
                  flex: 1,
                  padding: '5px 8px',
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

      {/* 4. Live Staging Stage */}
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
            'radial-gradient(circle at 50% 30%, rgba(39, 110, 241, 0.09) 0%, transparent 65%), radial-gradient(circle at 80% 85%, rgba(0, 229, 255, 0.04) 0%, transparent 50%)',
        }}
      >
        <LaptopMockup
          model={model}
          deviceColor={finish.color}
          screenAspectRatio={aspectRatio}
          shadow={shadow}
          showKeyboard={showKeyboard}
          showTrackpad={showTrackpad}
          showHinge={showHinge}
          showCamera={showCamera}
          glare={glare}
          animation={animation}
          slideDirection={slideDir}
          openingAnimation={openingAnim ? { startFrame: 5, duration: 28, fromAngle: 65, toAngle: 0 } : false}
          floating={floating ? { amplitude: 6, frequency: 0.4 } : false}
          tilt={tilt ? { maxAngle: 2.2, frequency: 0.3 } : false}
          screenReveal={screenReveal ? { delay: 14, duration: 16, type: 'wipe-up' } : false}
          delay={0}
          durationInFrames={25}
        >
          {/* Demo 1: SaaS Analytics View */}
          {screenDemo === 'dashboard' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0a0e17',
                color: '#ffffff',
                padding: '24px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 5,
                      backgroundColor: Colors.accent.brand,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Layers size={13} color="#ffffff" />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>Enterprise Telemetry Hub</span>
                </div>
                <span style={{ fontSize: 10, color: Colors.accent.emerald, fontWeight: 700 }}>
                  ● ALL SYSTEMS OPERATIONAL
                </span>
              </div>

              {/* 3 Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { label: 'Cluster Bandwidth', val: '48.2 Gbps', delta: '+12.4%', icon: Activity },
                  { label: 'Total Ingestion', val: '1.42 Billion', delta: '+28.0%', icon: BarChart3 },
                  { label: 'Global Edge Ping', val: '14.2 ms', delta: 'Optimal', icon: Globe },
                ].map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={i}
                      style={{
                        backgroundColor: '#121724',
                        borderRadius: 10,
                        padding: 12,
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, color: Colors.text.tertiary }}>{card.label}</span>
                        <Icon size={14} color={Colors.accent.cyan} />
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{card.val}</div>
                      <span style={{ fontSize: 9, color: Colors.accent.emerald, fontWeight: 600 }}>{card.delta}</span>
                    </div>
                  );
                })}
              </div>

              {/* Mini Chart Mockup */}
              <div
                style={{
                  height: 90,
                  backgroundColor: '#121724',
                  borderRadius: 10,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 8,
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {[40, 65, 50, 80, 60, 95, 75, 100, 85, 70, 90, 82, 98, 88].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      backgroundColor: i === 7 ? Colors.accent.cyan : 'rgba(39, 110, 241, 0.4)',
                      borderRadius: 3,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Demo 2: Hero Website Page */}
          {screenDemo === 'website' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#ffffff',
                color: '#0f172a',
                padding: '36px 32px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                boxSizing: 'border-box',
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 16,
                  backgroundColor: 'rgba(39, 110, 241, 0.1)',
                  color: Colors.accent.brand,
                  fontSize: 10,
                  fontWeight: 700,
                  marginBottom: 10,
                }}
              >
                <Sparkles size={12} /> REMOTION DESKTOP WORKSPACE
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Next-Generation Video Animation Stack
              </h2>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 8, maxWidth: 440 }}>
                High-performance deterministic React mockups rendered directly in video compositions.
              </p>
              <div
                style={{
                  marginTop: 14,
                  padding: '8px 16px',
                  backgroundColor: Colors.accent.brand,
                  color: '#ffffff',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Explore Architecture <ArrowUpRight size={13} />
              </div>
            </div>
          )}

          {/* Demo 3: Presentation Slide Deck */}
          {screenDemo === 'presentation' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #0b1120 0%, #1e1b4b 100%)',
                color: '#ffffff',
                padding: '36px 40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: Colors.accent.cyan, fontWeight: 700, letterSpacing: '0.08em' }}>
                  KEYNOTE 2026 · PHASE 2 ENGINE
                </span>
                <h1 style={{ fontSize: 32, fontWeight: 900, marginTop: 8, letterSpacing: '-0.03em' }}>
                  Autonomous Motion Primitives
                </h1>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: Colors.text.tertiary }}>
                  Google Deepmind Antigravity System
                </span>
                <span style={{ fontSize: 12, fontFamily: Typography.fontFamily.mono, color: Colors.accent.emerald }}>
                  SLIDE 04 / 18
                </span>
              </div>
            </div>
          )}
        </LaptopMockup>
      </div>

      {/* 5. Size Matrix Strip */}
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
            RESPONSIVE LAPTOP VIEWPORTS
          </span>
          <h4 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 4 }}>
            Compact 13" vs Standard 15" Size Comparison
          </h4>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: Spacing.scale.lg,
            alignItems: 'center',
            justifyItems: 'center',
            padding: `${Spacing.scale.md}px 0`,
          }}
        >
          {/* Card 1: 13-inch Compact */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.scale.xs }}>
            <LaptopMockup
              model="compact"
              deviceColor="#1e2430"
              shadow="subtle"
              animation="none"
              openingAnimation={false}
              floating={false}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0c121e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: Colors.accent.cyan,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                13-Inch Compact (560px)
              </div>
            </LaptopMockup>
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
              13" Compact Model
            </span>
          </div>

          {/* Card 2: 15-inch Standard */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.scale.xs }}>
            <LaptopMockup
              model="standard"
              deviceColor="#384152"
              shadow="subtle"
              animation="none"
              openingAnimation={false}
              floating={false}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0c121e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: Colors.accent.emerald,
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: Typography.fontFamily.mono,
                }}
              >
                15-Inch Standard (680px)
              </div>
            </LaptopMockup>
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
              15" Standard Model
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
