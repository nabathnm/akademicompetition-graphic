/**
 * ComponentIntegrationShowcase
 * Live diagnostic integration testbed demonstrating multi-library component composition.
 *
 * Demonstrations:
 * 1. AnimatedText inside AnimatedCard
 * 2. AnimatedButton inside DeviceFrame
 * 3. Graphic components combined with typography
 * 4. Multiple UI components inside SmartphoneMockup
 * 5. Scene components using existing transitions
 * 6. Multiple components working together in one scene
 */

import React, { useState } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import {
  Sparkles,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { formatTimecode } from '../../utils/timing/frame.ts';
import {
  INTEGRATION_SCENARIOS,
  IntegrationScenarioId,
  getIntegrationTheme,
} from './componentIntegrationStyle.ts';

// Component imports across all 5 libraries
import { AnimatedText } from '../../components/typography/AnimatedText.tsx';
import { TextHighlight } from '../../components/typography/TextHighlight.tsx';
import { SplitText } from '../../components/typography/SplitText.tsx';
import { AnimatedCard } from '../../components/ui/AnimatedCard.tsx';
import { AnimatedButton } from '../../components/ui/AnimatedButton.tsx';
import { AnimatedNotification } from '../../components/ui/AnimatedNotification.tsx';
import { AnimatedSearchBar } from '../../components/ui/AnimatedSearchBar.tsx';
import { AnimatedCheckbox } from '../../components/ui/AnimatedCheckbox.tsx';
import { AnimatedToggle } from '../../components/ui/AnimatedToggle.tsx';
import { DeviceFrame } from '../../components/mockups/DeviceFrame.tsx';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup.tsx';
import { AnimatedArrow } from '../../components/graphics/AnimatedArrow.tsx';
import { AnimatedCircle } from '../../components/graphics/AnimatedCircle.tsx';
import { AnimatedLine } from '../../components/graphics/AnimatedLine.tsx';
import { AnimatedShape } from '../../components/graphics/AnimatedShape.tsx';
import { ParticleSystem } from '../../components/graphics/ParticleSystem.tsx';
import { TransitionController } from '../../components/transitions/TransitionController.tsx';
import { SceneContainer } from '../../components/scenes/SceneContainer.tsx';
import { HeroScene } from '../../components/scenes/HeroScene.tsx';
import { ProductShowcaseScene } from '../../components/scenes/ProductShowcaseScene.tsx';

export const ComponentIntegrationShowcase: React.FC = () => {
  const currentFrame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Active scenario tab
  const [activeScenario, setActiveScenario] = useState<IntegrationScenarioId>('card-typography');
  // Transition type for scenario 5
  const [transitionType, setTransitionType] = useState<'slide' | 'fade' | 'zoom' | 'wipe'>('slide');

  const activeMeta = INTEGRATION_SCENARIOS.find((s) => s.id === activeScenario) ?? INTEGRATION_SCENARIOS[0];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#090D16',
        color: '#F8FAFC',
        fontFamily: Typography.fontFamily.sans,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Top Header & Navigation Bar */}
      <header
        style={{
          padding: '16px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: 'rgba(0, 209, 255, 0.15)',
              border: `1px solid ${Colors.accent.cyan}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.accent.cyan,
            }}
          >
            <Layers size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: '#FFFFFF' }}>
                Component Integration Suite
              </span>
              <span
                style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 9999,
                  backgroundColor: 'rgba(0, 209, 255, 0.15)',
                  color: Colors.accent.cyan,
                  fontWeight: 600,
                  border: '1px solid rgba(0, 209, 255, 0.3)',
                }}
              >
                MULTI-LIBRARY
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: Colors.text.tertiary }}>
              Demonstrating seamless cross-library composition without animation friction
            </p>
          </div>
        </div>

        {/* Live Diagnostics Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              FRAME / TIME
            </div>
            <div style={{ fontSize: 14, fontFamily: Typography.fontFamily.mono, fontWeight: 700, color: Colors.accent.cyan }}>
              {currentFrame}f · {formatTimecode(currentFrame, fps)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontFamily: Typography.fontFamily.mono, color: Colors.text.tertiary }}>
              RESOLUTION
            </div>
            <div style={{ fontSize: 14, fontFamily: Typography.fontFamily.mono, fontWeight: 600, color: '#94A3B8' }}>
              {width}×{height} @ {fps}fps
            </div>
          </div>
        </div>
      </header>

      {/* Scenario Selector Tabs */}
      <nav
        style={{
          display: 'flex',
          gap: 8,
          padding: '12px 28px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          backgroundColor: '#0F172A',
          flexShrink: 0,
          overflowX: 'auto',
          zIndex: 40,
        }}
      >
        {INTEGRATION_SCENARIOS.map((scenario) => {
          const isActive = activeScenario === scenario.id;
          const theme = getIntegrationTheme(isActive);

          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setActiveScenario(scenario.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                backgroundColor: theme.backgroundColor,
                border: `1px solid ${theme.borderColor}`,
                color: theme.color,
                fontSize: 12,
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                whiteSpace: 'nowrap',
              }}
            >
              <span>{scenario.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Stage Viewport */}
      <main
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '24px 28px',
          boxSizing: 'border-box',
        }}
      >
        {/* ========================================================================= */}
        {/* DEMO 1: AnimatedText inside AnimatedCard */}
        {/* ========================================================================= */}
        {activeScenario === 'card-typography' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <AnimatedCard
              variant="elevated"
              size="lg"
              animation="scale"
              startFrame={0}
              durationInFrames={18}
              width={560}
              padding={32}
              style={{
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 209, 255, 0.1)',
                border: '1px solid rgba(0, 209, 255, 0.25)',
              }}
              badge="ENTERPRISE ARCHITECTURE"
              badgeColor="rgba(0, 209, 255, 0.2)"
              icon={<Sparkles size={20} color={Colors.accent.cyan} />}
            >
              {/* Nested Typography Suite */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                <AnimatedText
                  variant="fade-slide-up"
                  startFrame={10}
                  durationInFrames={18}
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  Unified Motion Graphics Pipeline
                </AnimatedText>

                <AnimatedText
                  variant="fade"
                  startFrame={18}
                  durationInFrames={16}
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: Colors.text.secondary,
                    margin: 0,
                  }}
                >
                  Typography components accept React children or plain strings, automatically inheriting card
                  dimensions, safe padding, and springsettle mechanics with zero layout shifts.
                </AnimatedText>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <TextHighlight
                    text="100% Deterministic Rendering"
                    highlight="Deterministic"
                    variant="marker"
                    startFrame={26}
                    color={Colors.accent.cyan}
                    style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}
                  />
                  <TextHighlight
                    text="Zero Frame Skips"
                    highlight="Zero"
                    variant="underline"
                    startFrame={32}
                    color={Colors.accent.emerald}
                    style={{ fontSize: 13, fontWeight: 600, color: '#F1F5F9' }}
                  />
                </div>
              </div>

              {/* Nested UI CTA Button */}
              <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <AnimatedButton
                  label="Explore Documentation"
                  variant="primary"
                  size="medium"
                  startFrame={36}
                  hoverFrame={55}
                  pressFrame={65}
                  releaseFrame={75}
                  trailingIcon={<ArrowRight size={16} />}
                />
                <AnimatedButton
                  label="Inspect State"
                  variant="outline"
                  size="medium"
                  startFrame={42}
                />
              </div>
            </AnimatedCard>

            <span style={{ fontSize: 11, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
              Integration: AnimatedCard (L2 UI) + AnimatedText (L2 Typography) + TextHighlight + AnimatedButton
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DEMO 2: AnimatedButton inside DeviceFrame */}
        {/* ========================================================================= */}
        {activeScenario === 'button-device' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <DeviceFrame
              width={340}
              height={580}
              frameThickness={14}
              borderRadius={44}
              frameColor="#1E2430"
              screenColor="#090E17"
              notch="dynamic-island"
              notchWidth={96}
              notchHeight={26}
              homeBar={true}
              animation="scale-in"
              delay={0}
              durationInFrames={22}
              shadow="floating"
            >
              {/* Screen Interior with UI Buttons & States */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '48px 20px 24px 20px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {/* Mobile App Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div>
                    <span style={{ fontSize: 11, color: Colors.accent.cyan, fontWeight: 600 }}>CHECKOUT DEMO</span>
                    <h4 style={{ margin: 0, fontSize: 18, color: '#FFFFFF', fontWeight: 700 }}>Pro License</h4>
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#F1F5F9' }}>$49/mo</span>
                </div>

                <div
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: 12,
                    color: Colors.text.secondary,
                    lineHeight: 1.5,
                  }}
                >
                  Buttons inside the screen container inherit responsive boundaries, screen corner clipping, and
                  hardware bezel shadows.
                </div>

                {/* Button 1: Interactive Press Action */}
                <AnimatedButton
                  label="Confirm Subscription"
                  variant="primary"
                  size="medium"
                  width="100%"
                  startFrame={14}
                  hoverFrame={30}
                  pressFrame={45}
                  releaseFrame={58}
                  trailingIcon={<ArrowRight size={16} />}
                />

                {/* Button 2: State Transition (Loading -> Success) */}
                <AnimatedButton
                  label="Authorize Payment"
                  variant="secondary"
                  size="medium"
                  width="100%"
                  startFrame={22}
                  loadingStartFrame={36}
                  loadingLabel="Contacting Bank..."
                  successFrame={64}
                  successLabel="Payment Approved"
                />

                {/* Button 3: Secondary Action */}
                <AnimatedButton
                  label="Cancel and Return"
                  variant="outline"
                  size="medium"
                  width="100%"
                  startFrame={30}
                />
              </div>
            </DeviceFrame>

            <span style={{ fontSize: 11, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
              Integration: DeviceFrame (L2 Mockup) + AnimatedButton (L2 UI with hover, press, loading states)
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DEMO 3: Graphic components combined with typography */}
        {/* ========================================================================= */}
        {activeScenario === 'graphics-typography' && (
          <div
            style={{
              position: 'relative',
              width: 860,
              height: 480,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Background Geometric Accents */}
            <AnimatedShape
              shape="circle"
              width={360}
              height={360}
              fill="rgba(0, 209, 255, 0.03)"
              stroke="rgba(0, 209, 255, 0.12)"
              strokeWidth={1}
              animation="scale-in"
              delay={0}
              durationInFrames={25}
              style={{ position: 'absolute', zIndex: 1 }}
            />

            <AnimatedShape
              shape="polygon"
              sides={6}
              width={120}
              height={120}
              fill="rgba(168, 85, 247, 0.06)"
              stroke="rgba(168, 85, 247, 0.25)"
              strokeWidth={1.5}
              rotation={25}
              animation="rotate"
              delay={5}
              durationInFrames={30}
              style={{ position: 'absolute', top: 40, right: 80, zIndex: 1 }}
            />

            {/* Central Typography Composition */}
            <div
              style={{
                position: 'relative',
                zIndex: 10,
                textAlign: 'center',
                maxWidth: 620,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <AnimatedCircle
                  radius={18}
                  stroke={Colors.accent.cyan}
                  strokeWidth={3}
                  animation="draw"
                  delay={8}
                  durationInFrames={16}
                />
                <span style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.cyan, letterSpacing: '0.08em' }}>
                  PRECISION VECTOR INTEGRATION
                </span>
              </div>

              <AnimatedText
                variant="fade-slide-up"
                startFrame={12}
                durationInFrames={20}
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: '#FFFFFF',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                High-Performance SVG Geometries
              </AnimatedText>

              <TextHighlight
                text="Harmonious SVG drawing and typography reveals without layout jitter."
                highlight="Harmonious SVG drawing"
                variant="underline"
                startFrame={22}
                durationInFrames={18}
                color={Colors.accent.cyan}
                style={{ fontSize: 16, color: Colors.text.secondary, lineHeight: 1.6 }}
              />

              {/* Accent Line Divider */}
              <AnimatedLine
                x1={0}
                y1={0}
                x2={320}
                y2={0}
                stroke={Colors.accent.cyan}
                strokeWidth={2}
                strokeDasharray="6 3"
                animation="draw"
                delay={28}
                durationInFrames={18}
                style={{ margin: '8px 0' }}
              />

              <div style={{ display: 'flex', gap: 16 }}>
                <AnimatedButton
                  label="View Architecture"
                  variant="primary"
                  size="medium"
                  startFrame={34}
                />
                <AnimatedButton
                  label="Source Geometry"
                  variant="outline"
                  size="medium"
                  startFrame={38}
                />
              </div>
            </div>

            {/* Annotated Connecting SVG Arrow pointing from a label to the highlight */}
            <div
              style={{
                position: 'absolute',
                bottom: 60,
                left: 60,
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <AnimatedText
                variant="fade"
                startFrame={25}
                style={{ fontSize: 12, color: Colors.accent.cyan, fontFamily: Typography.fontFamily.mono }}
              >
                Pointing to Dynamic Highlight
              </AnimatedText>
              <AnimatedArrow
                x1={20}
                y1={40}
                x2={180}
                y2={-10}
                curvature={-0.25}
                stroke={Colors.accent.cyan}
                strokeWidth={2}
                arrowheadStyle="triangle"
                arrowheadSize={10}
                animation="draw"
                delay={28}
                durationInFrames={18}
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DEMO 4: Multiple UI components inside SmartphoneMockup */}
        {/* ========================================================================= */}
        {activeScenario === 'smartphone-ui' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <SmartphoneMockup
              model="flagship"
              width={340}
              height={620}
              deviceColor="#1E293B"
              screenColor="#090E17"
              showCamera="dynamic-island"
              showStatusBar="light"
              showHomeIndicator={true}
              animation="scale-in"
              delay={0}
              durationInFrames={20}
              shadow="floating"
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '44px 16px 20px 16px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  overflowY: 'hidden',
                }}
              >
                {/* Component 1: AnimatedNotification sliding down */}
                <AnimatedNotification
                  type="success"
                  variant="toast"
                  title="Ride Reserved"
                  description="Tesla Model S arrives in 3 mins"
                  startFrame={10}
                  durationInFrames={12}
                  displayDuration={80}
                  position="top"
                  width="100%"
                />

                {/* Component 2: AnimatedSearchBar with live typing */}
                <AnimatedSearchBar
                  value="Downtown Airport Terminal 2"
                  placeholder="Where to?"
                  startFrame={18}
                  focusFrame={26}
                  typingStartFrame={32}
                  typingSpeed={2}
                  suggestionStartFrame={50}
                  selectionFrame={65}
                  size="sm"
                  width="100%"
                  suggestions={[
                    { id: '1', text: 'Downtown Airport Terminal 2', category: 'Recent' },
                    { id: '2', text: 'Silicon Valley Headquarters', category: 'Saved' },
                  ]}
                />

                {/* Component 3: AnimatedCard displaying trip summary */}
                <AnimatedCard
                  variant="elevated"
                  size="sm"
                  startFrame={28}
                  durationInFrames={14}
                  title="Priority Driver Assigned"
                  description="Alexandre K. · Rating 4.98 ★"
                  badge="ACTIVE"
                  badgeColor="rgba(16, 185, 129, 0.2)"
                  width="100%"
                  padding={12}
                  style={{
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                />

                {/* Component 4 & 5: Interactive Preferences Row */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <AnimatedCheckbox
                    label="Quiet Ride Mode"
                    startFrame={36}
                    checkFrame={48}
                    defaultChecked={false}
                    checked={true}
                    size="small"
                  />
                  <AnimatedToggle
                    label="AC On"
                    startFrame={42}
                    toggleFrame={56}
                    defaultChecked={false}
                    checked={true}
                    size="small"
                  />
                </div>

                {/* Component 6: Bottom Sticky CTA Button */}
                <div style={{ marginTop: 'auto' }}>
                  <AnimatedButton
                    label="Contact Driver"
                    variant="primary"
                    size="medium"
                    width="100%"
                    startFrame={48}
                  />
                </div>
              </div>
            </SmartphoneMockup>

            <span style={{ fontSize: 11, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
              Integration: SmartphoneMockup hosting 5 distinct UI components without viewport clipping
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DEMO 5: Scene components using existing transitions */}
        {/* ========================================================================= */}
        {activeScenario === 'scene-transitions' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', height: '100%' }}>
            {/* Transition Controls HUD */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '8px 16px',
                borderRadius: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                zIndex: 20,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text.tertiary }}>TRANSITION:</span>
              {(['slide', 'fade', 'zoom', 'wipe'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTransitionType(t)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    backgroundColor: transitionType === t ? Colors.accent.cyan : 'transparent',
                    color: transitionType === t ? '#000000' : '#CBD5E1',
                    border: 'none',
                    textTransform: 'uppercase',
                  }}
                >
                  {t}
                </button>
              ))}
              <span style={{ fontSize: 11, color: Colors.text.tertiary, marginLeft: 10 }}>
                Boundary Frame: 45f | Duration: 20f
              </span>
            </div>

            {/* Transition Frame Container */}
            <div
              style={{
                width: 900,
                height: 480,
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
              }}
            >
              <TransitionController
                boundaryFrame={45}
                transition={{
                  type: transitionType,
                  durationInFrames: 20,
                  direction: 'left',
                }}
                fromContent={
                  <HeroScene
                    headline="Scene A: Hero Presentation"
                    subtitle="Initial opening scene with high-impact headline and call-to-action."
                    eyebrow="HERO SCENE"
                    cta="Explore Features"
                    style={{ width: '100%', height: '100%' }}
                  />
                }
                toContent={
                  <ProductShowcaseScene
                    title="Scene B: Product Deep Dive"
                    subtitle="Transitioned scene highlighting responsive device mockups and feature lists."
                    label="SHOWCASE SCENE"
                    details={[
                      { id: '1', label: 'Frame-Accurate', value: 'Deterministic' },
                      { id: '2', label: 'Transitions', value: 'Glitch, Slide, Fade' },
                    ]}
                    style={{ width: '100%', height: '100%' }}
                  />
                }
              />
            </div>

            <span style={{ fontSize: 11, color: Colors.text.tertiary, fontFamily: Typography.fontFamily.mono }}>
              Integration: TransitionController bridging HeroScene (L3) and ProductShowcaseScene (L3)
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DEMO 6: Multiple components working together in one scene */}
        {/* ========================================================================= */}
        {activeScenario === 'all-in-scene' && (
          <div style={{ width: 1000, height: 520, position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <SceneContainer
              background="radial-gradient(circle at 75% 40%, #162447 0%, #080C14 70%)"
              safeArea={false}
              overflow="hidden"
              style={{ width: '100%', height: '100%' }}
            >
              {/* Layer 1: Ambient Particle System */}
              <ParticleSystem
                particleCount={30}
                speed={0.4}
                size={[1.5, 3.5]}
                color="rgba(0, 209, 255, 0.35)"
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
              />

              {/* Layer 2: Main Split Layout */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '40px 60px',
                  boxSizing: 'border-box',
                  zIndex: 10,
                }}
              >
                {/* Left Side: Typography + UI Action Group */}
                <div style={{ maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AnimatedCircle
                      radius={12}
                      stroke={Colors.accent.emerald}
                      strokeWidth={2.5}
                      animation="pulse"
                      delay={5}
                    />
                    <span style={{ fontSize: 12, fontWeight: 700, color: Colors.accent.emerald, letterSpacing: '0.06em' }}>
                      TOTAL FRAMEWORK UNIFICATION
                    </span>
                  </div>

                  <AnimatedText
                    variant="fade-slide-up"
                    startFrame={10}
                    durationInFrames={20}
                    style={{
                      fontSize: 34,
                      fontWeight: 800,
                      color: '#FFFFFF',
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                      margin: 0,
                    }}
                  >
                    All Motion Graphics Libraries Combined
                  </AnimatedText>

                  <SplitText
                    text="Typography, UI elements, mockups, SVG graphics, and particle fields orchestrated seamlessly."
                    splitBy="word"
                    variant="fade"
                    startFrame={18}
                    staggerDelay={2}
                    style={{ fontSize: 14, color: Colors.text.secondary, lineHeight: 1.6 }}
                  />

                  {/* UI Action Row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                    <AnimatedButton
                      label="Launch Platform"
                      variant="primary"
                      size="medium"
                      startFrame={28}
                      trailingIcon={<ArrowRight size={16} />}
                    />
                    <AnimatedButton
                      label="Read Documentation"
                      variant="outline"
                      size="medium"
                      startFrame={34}
                    />
                  </div>
                </div>

                {/* Right Side: Smartphone Mockup with live UI components */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SmartphoneMockup
                    model="flagship"
                    width={280}
                    height={460}
                    deviceColor="#1E293B"
                    screenColor="#0B132B"
                    showCamera="dynamic-island"
                    showStatusBar="light"
                    showHomeIndicator={true}
                    animation="scale-in"
                    delay={15}
                    durationInFrames={22}
                    shadow="high"
                  >
                    <div style={{ padding: '36px 14px 14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <AnimatedNotification
                        type="info"
                        variant="toast"
                        title="Sync Completed"
                        description="All 5 libraries linked"
                        startFrame={28}
                        width="100%"
                      />

                      <AnimatedCard
                        variant="outlined"
                        size="sm"
                        startFrame={38}
                        title="Motion Graph Engine"
                        description="1174 unit tests active"
                        badge="VERIFIED"
                        badgeColor="rgba(0, 209, 255, 0.25)"
                        width="100%"
                        padding={10}
                      />
                    </div>
                  </SmartphoneMockup>

                  {/* Connecting Curved Arrow from CTA to Phone */}
                  <div style={{ position: 'absolute', left: -90, top: '45%', pointerEvents: 'none', zIndex: 30 }}>
                    <AnimatedArrow
                      x1={0}
                      y1={30}
                      x2={90}
                      y2={-10}
                      curvature={-0.25}
                      stroke={Colors.accent.cyan}
                      strokeWidth={2}
                      arrowheadStyle="triangle"
                      arrowheadSize={10}
                      animation="draw"
                      delay={36}
                      durationInFrames={18}
                    />
                  </div>
                </div>
              </div>
            </SceneContainer>
          </div>
        )}
      </main>

      {/* Bottom Footer Info Bar */}
      <footer
        style={{
          padding: '10px 28px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 11,
          color: Colors.text.tertiary,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>
            <strong style={{ color: '#F1F5F9' }}>Scenario:</strong> {activeMeta.title}
          </span>
          <span>·</span>
          <span>
            <strong style={{ color: '#F1F5F9' }}>Libraries:</strong> {activeMeta.categoryTags.join(' + ')}
          </span>
        </div>
        <div>
          <span>Deterministic Frame Animation · Zero DOM Side Effects</span>
        </div>
      </footer>
    </div>
  );
};
