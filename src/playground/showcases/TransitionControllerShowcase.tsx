/**
 * TransitionController Showcase
 * Interactive motion graphics playground demonstrating the TransitionController:
 * - Adjacent scene transitions (crossfade, slide, zoom, wipe, mask, split, glitch)
 * - Single scene entrance and exit envelopes
 * - Boundary alignment options ('center', 'lead-in', 'lead-out')
 * - Real-time transition disabling / bypass (instant cuts)
 * - Telemetry inspection and live controls
 */

import React, { useState } from 'react';
import {
  Shuffle,
  Layers,
  ArrowRight,
  Maximize2,
  Sliders,
  Sparkles,
  Zap,
  Shield,
  Activity,
} from 'lucide-react';
import { Colors } from '../../styles/colors.ts';
import { Typography } from '../../styles/typography.ts';
import { TransitionController } from '../../components/transitions/TransitionController.tsx';
import type {
  SupportedTransitionType,
  TransitionAlignment,
} from '../../components/transitions/transitionControllerTypes.ts';
import { HeroScene } from '../../components/scenes/HeroScene.tsx';
import { ProductShowcaseScene } from '../../components/scenes/ProductShowcaseScene.tsx';
import { SmartphoneMockup } from '../../components/mockups/SmartphoneMockup.tsx';

export type TransitionDemoPreset =
  | 'fade-crossfade'
  | 'slide-replace'
  | 'zoom-spatial'
  | 'wipe-reveal'
  | 'glitch-cyber'
  | 'split-curtain'
  | 'single-envelope';

export const TransitionControllerShowcase: React.FC = () => {
  // Preset state
  const [preset, setPreset] = useState<TransitionDemoPreset>('fade-crossfade');

  // Interactive controls
  const [transitionType, setTransitionType] = useState<SupportedTransitionType>('fade');
  const [durationInFrames, setDurationInFrames] = useState<number>(25);
  const [alignment, setAlignment] = useState<TransitionAlignment>('center');
  const [direction, setDirection] = useState<'left' | 'right' | 'top' | 'bottom'>('left');
  const [disabled, setDisabled] = useState<boolean>(false);
  const [debugHud, setDebugHud] = useState<boolean>(true);

  // Apply preset configs
  const applyPreset = (newPreset: TransitionDemoPreset) => {
    setPreset(newPreset);
    switch (newPreset) {
      case 'fade-crossfade':
        setTransitionType('fade');
        setDurationInFrames(25);
        setAlignment('center');
        setDisabled(false);
        break;
      case 'slide-replace':
        setTransitionType('slide');
        setDurationInFrames(24);
        setAlignment('center');
        setDirection('left');
        setDisabled(false);
        break;
      case 'zoom-spatial':
        setTransitionType('zoom');
        setDurationInFrames(28);
        setAlignment('center');
        setDisabled(false);
        break;
      case 'wipe-reveal':
        setTransitionType('wipe');
        setDurationInFrames(24);
        setAlignment('center');
        setDirection('left');
        setDisabled(false);
        break;
      case 'glitch-cyber':
        setTransitionType('glitch');
        setDurationInFrames(30);
        setAlignment('center');
        setDisabled(false);
        break;
      case 'split-curtain':
        setTransitionType('split');
        setDurationInFrames(24);
        setAlignment('center');
        setDisabled(false);
        break;
      case 'single-envelope':
        setTransitionType('fade');
        setDurationInFrames(20);
        setDisabled(false);
        break;
    }
  };

  // Shared mock screen for mockups
  const mockScreen = (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #091224 0%, #172a4d 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        color: '#ffffff',
        fontFamily: Typography.fontFamily.sans,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${Colors.accent.cyan}, ${Colors.accent.electricViolet})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          boxShadow: '0 8px 24px rgba(6, 182, 212, 0.4)',
        }}
      >
        <Sparkles size={24} color="#ffffff" />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Antigravity OS</div>
      <div style={{ fontSize: 12, color: Colors.text.tertiary, maxWidth: 180 }}>
        Next-generation high velocity rendering
      </div>
    </div>
  );

  // Scene A: Hero Scene
  const sceneA = (
    <HeroScene
      headline="Antigravity Cloud"
      subtitle="The real-time motion graphics framework for modern product engineering."
      eyebrow="ENTERPRISE PLATFORM"
      cta="Explore Architecture"
      layout="split-right"
      background={`radial-gradient(circle at 30% 40%, #1e1b4b 0%, #030712 100%)`}
      heroVisual={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <SmartphoneMockup model="flagship" deviceColor="#1e293b" width={260} animate={false}>
            {mockScreen}
          </SmartphoneMockup>
        </div>
      }
    />
  );

  // Scene B: Product Showcase Scene
  const sceneB = (
    <ProductShowcaseScene
      title="Dynamic Transitions"
      subtitle="Connect, replace, and orchestrate scenes with frame-accurate timing."
      label="LAYER 2 ARCHITECTURE"
      layout="center-product"
      background={`radial-gradient(circle at 70% 30%, #064e3b 0%, #022c22 40%, #030712 100%)`}
      productVisual={
        <div
          style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 30,
            borderRadius: 20,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: Colors.accent.emerald }}>0.0ms</div>
            <div style={{ fontSize: 13, color: Colors.text.tertiary }}>Timing Drift</div>
          </div>
          <div style={{ width: 1, height: 50, background: 'rgba(255, 255, 255, 0.15)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: Colors.accent.cyan }}>8+</div>
            <div style={{ fontSize: 13, color: Colors.text.tertiary }}>Transition Engines</div>
          </div>
          <div style={{ width: 1, height: 50, background: 'rgba(255, 255, 255, 0.15)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: Colors.accent.electricViolet }}>100%</div>
            <div style={{ fontSize: 13, color: Colors.text.tertiary }}>Deterministic</div>
          </div>
        </div>
      }
    />
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#090D16',
        color: '#F8FAFC',
        fontFamily: Typography.fontFamily.sans,
        padding: '32px 40px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              padding: 6,
              borderRadius: 8,
              backgroundColor: 'rgba(39, 110, 241, 0.15)',
              color: Colors.accent.brand,
            }}
          >
            <Shuffle size={20} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            TransitionController Playground
          </h1>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 12,
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              color: Colors.accent.emerald,
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            Layer 2 / 3 Bridge
          </span>
        </div>
        <p style={{ margin: 0, color: Colors.text.tertiary, fontSize: 14, maxWidth: 840 }}>
          Centralized orchestrator for connecting the Transition Library with scene components.
          Seamlessly blends adjacent scenes, provides entrance/exit envelopes, and guarantees frame-accurate determinism.
        </p>
      </div>

      {/* Preset Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 24,
          padding: 14,
          backgroundColor: '#0F172A',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <span
          style={{
            alignSelf: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: Colors.text.tertiary,
            marginRight: 6,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Presets:
        </span>
        {(
          [
            { id: 'fade-crossfade', label: 'Crossfade', icon: Sparkles },
            { id: 'slide-replace', label: 'Directional Slide', icon: ArrowRight },
            { id: 'zoom-spatial', label: 'Spatial Zoom', icon: Maximize2 },
            { id: 'wipe-reveal', label: 'Wipe Reveal', icon: Layers },
            { id: 'glitch-cyber', label: 'Cyber Glitch', icon: Zap },
            { id: 'split-curtain', label: 'Split Curtain', icon: Sliders },
            { id: 'single-envelope', label: 'Scene Envelope', icon: Shield },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          const isSelected = preset === item.id;
          return (
            <button
              key={item.id}
              onClick={() => applyPreset(item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: isSelected ? 600 : 500,
                backgroundColor: isSelected ? Colors.accent.brand : 'rgba(255, 255, 255, 0.04)',
                color: isSelected ? '#FFFFFF' : '#CBD5E1',
                border: isSelected ? '1px solid transparent' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={14} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Control Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 24,
          padding: 16,
          backgroundColor: '#0F172A',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Transition Type */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            TRANSITION TYPE
          </label>
          <select
            value={transitionType}
            onChange={(e) => setTransitionType(e.target.value as SupportedTransitionType)}
            style={{
              width: '100%',
              padding: '6px 10px',
              borderRadius: 6,
              backgroundColor: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: 13,
            }}
          >
            <option value="fade">Fade / Crossfade</option>
            <option value="slide">Slide Replace</option>
            <option value="zoom">Zoom Spatial</option>
            <option value="wipe">Wipe Reveal</option>
            <option value="mask">Mask Shape</option>
            <option value="split">Split Multi-Panel</option>
            <option value="glitch">Glitch Digital</option>
            <option value="none">None (Cut)</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            DURATION ({durationInFrames} FRAMES)
          </label>
          <input
            type="range"
            min={10}
            max={50}
            value={durationInFrames}
            onChange={(e) => setDurationInFrames(Number(e.target.value))}
            style={{ width: '100%', accentColor: Colors.accent.brand }}
          />
        </div>

        {/* Alignment */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            BOUNDARY ALIGNMENT
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['center', 'lead-in', 'lead-out'] as const).map((align) => (
              <button
                key={align}
                onClick={() => setAlignment(align)}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: alignment === align ? 600 : 400,
                  backgroundColor: alignment === align ? 'rgba(39, 110, 241, 0.25)' : '#1E293B',
                  color: alignment === align ? '#60A5FA' : '#94A3B8',
                  border: alignment === align ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                }}
              >
                {align}
              </button>
            ))}
          </div>
        </div>

        {/* Direction */}
        <div>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: Colors.text.tertiary, marginBottom: 6 }}>
            DIRECTION
          </label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as 'left' | 'right' | 'top' | 'bottom')}
            style={{
              width: '100%',
              padding: '6px 10px',
              borderRadius: 6,
              backgroundColor: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: 13,
            }}
          >
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
            <input
              type="checkbox"
              checked={disabled}
              onChange={(e) => setDisabled(e.target.checked)}
              style={{ accentColor: '#EF4444' }}
            />
            <span style={{ color: disabled ? '#F87171' : '#94A3B8' }}>Disable Transition</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
            <input
              type="checkbox"
              checked={debugHud}
              onChange={(e) => setDebugHud(e.target.checked)}
              style={{ accentColor: Colors.accent.brand }}
            />
            <span>Debug HUD</span>
          </label>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        style={{
          width: '100%',
          height: 640,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: '#000000',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          position: 'relative',
        }}
      >
        {preset === 'single-envelope' ? (
          <TransitionController
            sceneDurationInFrames={180}
            entrance={{
              type: transitionType,
              durationInFrames,
              direction,
              disabled,
            }}
            exit={{
              type: transitionType,
              durationInFrames,
              direction,
              disabled,
            }}
            debug={debugHud}
          >
            {sceneA}
          </TransitionController>
        ) : (
          <TransitionController
            boundaryFrame={90}
            transition={{
              type: transitionType,
              durationInFrames,
              alignment,
              direction,
              disabled,
            }}
            fromContent={sceneA}
            toContent={sceneB}
            debug={debugHud}
          />
        )}
      </div>

      {/* Specifications & Notes */}
      <div
        style={{
          marginTop: 24,
          padding: 20,
          backgroundColor: '#0F172A',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: 13,
          lineHeight: 1.6,
          color: Colors.text.tertiary,
        }}
      >
        <div style={{ color: '#F8FAFC', fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={16} color={Colors.accent.brand} />
          Architecture & Implementation Notes:
        </div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>
            <strong>Dual Mode Support:</strong> Automatically switches between <em>Adjacent Transition Mode</em> (when outgoing and incoming scenes are provided) and <em>Single Scene Envelope Mode</em> (when wrapping a single scene).
          </li>
          <li>
            <strong>Zero-Overhead Cuts:</strong> When <code>disabled={true}</code> or <code>type="none"</code> is passed, an instantaneous cut occurs without rendering heavy transition filters or clip-paths.
          </li>
          <li>
            <strong>Frame-Accurate Synchronization:</strong> Fully integrated with <code>useCurrentFrame()</code> and compatible with <code>TimelineManager</code>.
          </li>
          <li>
            <strong>Graceful Fallbacks:</strong> Any unrecognized transition string safely falls back to standard <code>fade</code> with a development warning.
          </li>
        </ul>
      </div>
    </div>
  );
};
