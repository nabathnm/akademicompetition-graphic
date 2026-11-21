/**
 * BrowserWindowMockup Showcase
 * Interactive development and evaluation harness for the BrowserWindowMockup component.
 * Demonstrates minimal and full browser chrome variants, light and dark themes,
 * simulated deterministic scrolling, custom SaaS dashboard and landing page UI, and multi-window cascades.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Monitor,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowUpRight,
  BarChart3,
  Users,
  Shield,
} from 'lucide-react';
import { BrowserWindowMockup } from '../../components/mockups/BrowserWindowMockup.tsx';
import type {
  BrowserControlsStyle,
  BrowserTheme,
  BrowserVariant,
  DeviceFrameAnimation,
  DeviceShadowPreset,
  DeviceSlideDirection,
} from '../../components/mockups/types.ts';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { Spacing } from '../../styles/spacing.ts';

export const BrowserWindowMockupShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mode and style controls
  const [variant, setVariant] = useState<BrowserVariant>('full');
  const [theme, setTheme] = useState<BrowserTheme>('dark');
  const [controlsStyle, setControlsStyle] = useState<BrowserControlsStyle>('traffic-lights');
  const [shadow, setShadow] = useState<DeviceShadowPreset>('floating');
  const [animation, setAnimation] = useState<DeviceFrameAnimation>('spring');
  const [slideDir, setSlideDir] = useState<DeviceSlideDirection>('up');

  // Interactive toggles
  const [showTabs, setShowTabs] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showAddressBar, setShowAddressBar] = useState(true);
  const [showScrollbar, setShowScrollbar] = useState(true);
  const [animatedScroll, setAnimatedScroll] = useState(true);
  const [floating, setFloating] = useState(true);
  const [chromeReveal, setChromeReveal] = useState(true);
  const [viewportReveal, setViewportReveal] = useState(true);

  // Content demo mode
  const [contentDemo, setContentDemo] = useState<'dashboard' | 'landing' | 'multi'>('dashboard');
  const [replayOffset, setReplayOffset] = useState(0);

  const handleReplay = () => {
    setReplayOffset(currentFrame);
  };

  const effectiveFrame = Math.max(0, currentFrame - replayOffset);

  // Sample tab sets
  const demoTabs = [
    { id: 'tab-1', title: 'Analytics · Acme Cloud', active: true, faviconColor: Colors.accent.cyan },
    { id: 'tab-2', title: 'API Documentation', active: false, faviconColor: Colors.accent.brand },
    { id: 'tab-3', title: 'Cluster Deployments', active: false, faviconColor: Colors.accent.emerald },
  ];

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
            <Monitor size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
              <span style={{ ...Typography.caption.eyebrow, color: Colors.accent.cyan }}>
                LAYER 2 / LAYER 3 · BROWSER MOCKUP
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
              BrowserWindowMockup Evaluation Stage
            </h3>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.lg }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              VARIANT / THEME
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.cyan }}>
              {variant.toUpperCase()} ({theme.toUpperCase()})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              SCROLL ENGINE
            </span>
            <span style={{ fontSize: 13, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.emerald }}>
              {animatedScroll ? 'DETERMINISTIC ANIMATED' : 'STATIC'}
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

      {/* 2. Top Interactive Configuration Bar */}
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
        {/* Style Variant */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            WINDOW STYLE
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['full', 'minimal'] as BrowserVariant[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVariant(v)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: variant === v ? Colors.accent.brand : Colors.dark.surface2,
                  border: `1px solid ${variant === v ? Colors.accent.brandLight : Colors.border.default}`,
                  color: variant === v ? '#ffffff' : Colors.text.secondary,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {v} Window
              </button>
            ))}
          </div>
        </div>

        {/* Theme Palette */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            BROWSER THEME
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['dark', 'light'] as BrowserTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: theme === t ? (t === 'dark' ? '#1e293b' : '#f1f5f9') : Colors.dark.surface2,
                  border: `1px solid ${theme === t ? Colors.accent.cyan : Colors.border.default}`,
                  color: theme === t ? (t === 'dark' ? Colors.accent.cyan : '#0f172a') : Colors.text.secondary,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {t} Theme
              </button>
            ))}
          </div>
        </div>

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

        {/* Window Controls Style */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            WINDOW CONTROLS
          </label>
          <select
            value={controlsStyle}
            onChange={(e) => setControlsStyle(e.target.value as BrowserControlsStyle)}
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
            <option value="traffic-lights">traffic-lights (Color)</option>
            <option value="monochrome">monochrome (Slate)</option>
            <option value="subtle">subtle (Translucent)</option>
          </select>
        </div>

        {/* Depth Shadow */}
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
            <option value="floating">floating (96px diffuse spread)</option>
            <option value="high">high (elevated 72px)</option>
            <option value="medium">medium (standard 48px)</option>
            <option value="subtle">subtle (minimal 24px)</option>
            <option value="none">none (flat)</option>
          </select>
        </div>

        {/* Detail Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            CHROME & MOTION TOGGLES
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showTabs} onChange={(e) => setShowTabs(e.target.checked)} />
              Tabs
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showToolbar} onChange={(e) => setShowToolbar(e.target.checked)} />
              Toolbar
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showAddressBar} onChange={(e) => setShowAddressBar(e.target.checked)} />
              URL Bar
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={showScrollbar} onChange={(e) => setShowScrollbar(e.target.checked)} />
              Scrollbar
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={animatedScroll} onChange={(e) => setAnimatedScroll(e.target.checked)} />
              Scroll
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={floating} onChange={(e) => setFloating(e.target.checked)} />
              Float
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={chromeReveal} onChange={(e) => setChromeReveal(e.target.checked)} />
              Chrome In
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: Colors.text.secondary, cursor: 'pointer' }}>
              <input type="checkbox" checked={viewportReveal} onChange={(e) => setViewportReveal(e.target.checked)} />
              Viewport In
            </label>
          </div>
        </div>

        {/* Demo Content Mode */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
            WEBSITE CONTENT
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {[
              { id: 'dashboard', label: 'Cloud SaaS' },
              { id: 'landing', label: 'Landing Page' },
              { id: 'multi', label: 'Multi-Window' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setContentDemo(tab.id as typeof contentDemo)}
                style={{
                  flex: 1,
                  padding: '5px 8px',
                  borderRadius: Spacing.radius.xs,
                  backgroundColor: contentDemo === tab.id ? Colors.accent.cyan : Colors.dark.surface2,
                  border: `1px solid ${contentDemo === tab.id ? Colors.accent.cyan : Colors.border.default}`,
                  color: contentDemo === tab.id ? '#000000' : Colors.text.secondary,
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

      {/* 3. Live Staging Stage */}
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
            'radial-gradient(circle at 50% 25%, rgba(39, 110, 241, 0.09) 0%, transparent 65%), radial-gradient(circle at 85% 85%, rgba(0, 229, 255, 0.04) 0%, transparent 50%)',
        }}
      >
        {contentDemo !== 'multi' ? (
          <BrowserWindowMockup
            width={840}
            height={530}
            variant={variant}
            theme={theme}
            windowControlsStyle={controlsStyle}
            shadow={shadow}
            title={contentDemo === 'dashboard' ? 'Acme Cloud Dashboard' : 'Starlight AI Engine'}
            url={contentDemo === 'dashboard' ? 'https://console.acme.cloud/analytics' : 'https://starlight.design'}
            tabs={demoTabs}
            showTabs={showTabs}
            showToolbar={showToolbar}
            showAddressBar={showAddressBar}
            showScrollbar={showScrollbar}
            animation={animation}
            slideDirection={slideDir}
            floating={floating ? { amplitude: 6, frequency: 0.4 } : false}
            chromeReveal={chromeReveal ? { delay: 6, duration: 14 } : false}
            viewportReveal={viewportReveal ? { delay: 12, duration: 18, type: 'wipe-up' } : false}
            scrollProgress={animatedScroll ? { startFrame: 22, duration: 48, from: 0, to: 75, contentHeight: 1100 } : 0}
            contentHeight={1100}
            delay={0}
            durationInFrames={25}
          >
            {/* Demo 1: Cloud SaaS Dashboard Content */}
            {contentDemo === 'dashboard' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  padding: 24,
                  color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                  fontFamily: Typography.fontFamily.sans,
                }}
              >
                {/* Dashboard Nav Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        backgroundColor: Colors.accent.brand,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      <Layers size={14} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Global Clusters & Telemetry</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
                        fontSize: 11,
                        color: Colors.accent.emerald,
                        fontWeight: 600,
                      }}
                    >
                      ● 99.99% Uptime
                    </div>
                  </div>
                </div>

                {/* 3 Analytics Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                  {[
                    { label: 'Active Ingestion Pods', val: '2,480', delta: '+14.2%', icon: BarChart3, color: Colors.accent.cyan },
                    { label: 'Concurrent Sessions', val: '84.2k', delta: '+28.0%', icon: Users, color: Colors.accent.brand },
                    { label: 'Threat Mitigation', val: '99.98%', delta: 'Optimal', icon: Shield, color: Colors.accent.emerald },
                  ].map((card, i) => {
                    const Icon = card.icon;
                    return (
                      <div
                        key={i}
                        style={{
                          backgroundColor: theme === 'dark' ? '#131926' : '#f8fafc',
                          border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                          borderRadius: 12,
                          padding: 16,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 6,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11, color: theme === 'dark' ? Colors.text.tertiary : '#64748b' }}>
                            {card.label}
                          </span>
                          <Icon size={16} color={card.color} />
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
                          {card.val}
                        </div>
                        <span style={{ fontSize: 10, color: Colors.accent.emerald, fontWeight: 700 }}>
                          {card.delta} vs yesterday
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bar Visualizer Section */}
                <div
                  style={{
                    backgroundColor: theme === 'dark' ? '#131926' : '#f8fafc',
                    border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 12,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 700 }}>Traffic Throughput by Region</span>
                    <span style={{ fontSize: 10, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
                      LIVE SAMPLING (500ms)
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
                    {[35, 60, 45, 80, 55, 90, 75, 100, 85, 70, 95, 65, 80, 88].map((h, idx) => (
                      <div
                        key={idx}
                        style={{
                          flex: 1,
                          height: `${h}%`,
                          backgroundColor: idx === 7 ? Colors.accent.cyan : 'rgba(39, 110, 241, 0.4)',
                          borderRadius: 4,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Additional content to demonstrate scrolling */}
                <div
                  style={{
                    backgroundColor: theme === 'dark' ? '#131926' : '#f8fafc',
                    border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    borderRadius: 12,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700 }}>Audit Logs & Cluster Security</span>
                  {[
                    { node: 'edge-cluster-us-east-1', status: 'Healthy', latency: '4ms' },
                    { node: 'edge-cluster-eu-central', status: 'Healthy', latency: '9ms' },
                    { node: 'edge-cluster-ap-southeast', status: 'Healthy', latency: '18ms' },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        backgroundColor: theme === 'dark' ? '#1a2233' : '#eef2f6',
                        borderRadius: 8,
                        fontSize: 11,
                      }}
                    >
                      <span style={{ fontFamily: Typography.fontFamily.mono }}>{row.node}</span>
                      <span style={{ color: Colors.accent.emerald, fontWeight: 700 }}>● {row.status}</span>
                      <span style={{ color: Colors.text.tertiary }}>{row.latency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Demo 2: Landing Page Hero UI */}
            {contentDemo === 'landing' && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '40px 32px',
                  color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                  fontFamily: Typography.fontFamily.sans,
                  gap: 24,
                }}
              >
                <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 12px',
                      borderRadius: 20,
                      backgroundColor: 'rgba(39, 110, 241, 0.15)',
                      color: Colors.accent.brandLight,
                      fontSize: 11,
                      fontWeight: 700,
                      marginBottom: 12,
                    }}
                  >
                    <Sparkles size={13} /> GENERATION 3 ARCHITECTURE
                  </div>
                  <h2 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                    Build Motion Graphics at the Speed of Light
                  </h2>
                  <p style={{ fontSize: 13, color: theme === 'dark' ? Colors.text.secondary : '#64748b', marginTop: 10 }}>
                    Deterministic Remotion animations with pure mathematical frame accuracy.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 18 }}>
                    <div
                      style={{
                        padding: '10px 20px',
                        backgroundColor: Colors.accent.brand,
                        color: '#ffffff',
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      Get Started Free <ArrowUpRight size={14} />
                    </div>
                    <div
                      style={{
                        padding: '10px 20px',
                        backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
                        color: theme === 'dark' ? '#ffffff' : '#0f172a',
                        borderRadius: 8,
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      Documentation
                    </div>
                  </div>
                </div>

                {/* Grid of features */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 12 }}>
                  {['Deterministic Math', 'Zero CSS Transitions', 'Production Bundle Ready'].map((feat, i) => (
                    <div
                      key={i}
                      style={{
                        backgroundColor: theme === 'dark' ? '#131926' : '#f8fafc',
                        border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                        borderRadius: 10,
                        padding: 16,
                        textAlign: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {feat}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </BrowserWindowMockup>
        ) : (
          /* Multi-Window Cascade Presentation */
          <div
            style={{
              position: 'relative',
              width: 900,
              height: 580,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Window 1 (Background Minimal Dark Window) */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 30,
                zIndex: 1,
                opacity: 0.88,
              }}
            >
              <BrowserWindowMockup
                width={560}
                height={360}
                variant="minimal"
                theme="dark"
                title="Telemetry Terminal"
                url="https://acme.io/terminal"
                shadow="medium"
                animation="slide-in"
                slideDirection="left"
                delay={0}
                floating={false}
              >
                <div
                  style={{
                    padding: 18,
                    color: Colors.accent.cyan,
                    fontFamily: Typography.fontFamily.mono,
                    fontSize: 11,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div>$ acme-agent start --cluster=prod</div>
                  <div style={{ color: Colors.accent.emerald }}>✔ Connected to 40 nodes [OK]</div>
                  <div style={{ color: Colors.text.tertiary }}>Ingestion stream active: 2.4k req/sec</div>
                </div>
              </BrowserWindowMockup>
            </div>

            {/* Window 2 (Foreground Full Light/Dark Window) */}
            <div
              style={{
                position: 'absolute',
                bottom: 20,
                right: 30,
                zIndex: 2,
              }}
            >
              <BrowserWindowMockup
                width={620}
                height={390}
                variant="full"
                theme={theme}
                title="Acme Analytics Hub"
                url="https://app.acme.io"
                shadow="floating"
                animation="spring"
                delay={6}
                floating={{ amplitude: 5, frequency: 0.35 }}
                viewportReveal={{ delay: 16, duration: 16, type: 'wipe-up' }}
              >
                <div
                  style={{
                    padding: 20,
                    color: theme === 'dark' ? '#ffffff' : '#0f172a',
                    fontFamily: Typography.fontFamily.sans,
                  }}
                >
                  <span style={{ fontSize: 11, color: Colors.accent.cyan, fontWeight: 700 }}>
                    LIVE USER ACTIVITY
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>
                    14,892 Online Now
                  </div>
                  <div
                    style={{
                      height: 120,
                      backgroundColor: theme === 'dark' ? '#141d2f' : '#f1f5f9',
                      borderRadius: 10,
                      marginTop: 14,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: Colors.text.tertiary,
                      fontSize: 12,
                    }}
                  >
                    Interactive Map Canvas
                  </div>
                </div>
              </BrowserWindowMockup>
            </div>
          </div>
        )}
      </div>

      {/* 4. Comparison Strip: Minimal vs Full Side-by-Side */}
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
            CHROME ARCHITECTURE COMPARISON
          </span>
          <h4 style={{ ...Typography.headline.h4, color: Colors.text.primary, marginTop: 4 }}>
            Minimal vs Full Window Chrome
          </h4>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: Spacing.scale.lg,
            alignItems: 'center',
            justifyItems: 'center',
            padding: `${Spacing.scale.md}px 0`,
          }}
        >
          {/* Minimal Window Card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.scale.xs }}>
            <BrowserWindowMockup
              width={380}
              height={220}
              variant="minimal"
              theme="dark"
              url="https://acme.io/docs"
              shadow="subtle"
              animation="none"
              floating={false}
            >
              <div
                style={{
                  padding: 14,
                  color: Colors.accent.cyan,
                  fontSize: 11,
                  fontFamily: Typography.fontFamily.mono,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                Minimal Chrome (Single 40px Header)
              </div>
            </BrowserWindowMockup>
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
              Minimal Variant
            </span>
          </div>

          {/* Full Window Card */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Spacing.scale.xs }}>
            <BrowserWindowMockup
              width={380}
              height={220}
              variant="full"
              theme="dark"
              url="https://acme.io/dashboard"
              shadow="subtle"
              animation="none"
              floating={false}
            >
              <div
                style={{
                  padding: 14,
                  color: Colors.accent.emerald,
                  fontSize: 11,
                  fontFamily: Typography.fontFamily.mono,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                }}
              >
                Full Chrome (Tabs + Toolbar = 78px)
              </div>
            </BrowserWindowMockup>
            <span style={{ fontSize: 11, fontFamily: Typography.fontFamily.mono, color: Colors.text.secondary }}>
              Full Variant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
