/**
 * SmartphoneMockup Component
 * Polished, production-ready smartphone mockup container for Remotion motion graphics.
 * Composes the foundational DeviceFrame with calibrated flagship smartphone models,
 * custom aspect ratios, deterministic continuous floating/tilt kinetics, and sequential screen reveals.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import { Img, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SmartphoneMockupProps } from './types.ts';
import { DeviceFrame } from './DeviceFrame.tsx';
import {
  calculateContinuousFloating,
  calculateContinuousTilt,
  calculateScreenRevealState,
  resolveCameraCutout,
  resolveSmartphoneDimensions,
  SMARTPHONE_PRESETS,
} from './smartphoneMockupStyle.ts';

export const SmartphoneMockup: React.FC<SmartphoneMockupProps> = ({
  model = 'flagship',
  width,
  height,
  aspectRatio,
  deviceColor,
  frameColor,
  screenColor = '#000000',
  frameThickness,
  borderRadius,
  screenRadius,
  showCamera = true,
  cameraCutout,
  cameraPosition = 'center',
  showStatusBar = true,
  showHomeIndicator = true,
  showButtons = true,
  buttons,
  shadow = 'medium',
  shadowColor,
  glare = true,
  clipScreen = true,
  screenshot,
  imageFit = 'cover',
  screenContent,
  children,
  animation = 'spring',
  animate = true,
  delay = 0,
  startFrame,
  durationInFrames = 25,
  slideDirection = 'up',
  easing,
  springPreset = 'snappy',
  floating = false,
  tilt = false,
  screenReveal = false,
  exitFrame,
  exitDurationInFrames = 15,
  exitAnimation = 'fade-out',
  style,
  screenStyle,
  className,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Resolve model preset fallback
  const presetKey = model !== 'custom' ? model : undefined;
  const preset = presetKey ? SMARTPHONE_PRESETS[presetKey] : undefined;

  // 2. Resolve geometry & concentric dimensions
  const dims = resolveSmartphoneDimensions({
    model,
    width,
    height,
    aspectRatio,
    frameThickness,
    borderRadius,
    screenRadius,
  });

  // 3. Resolve camera cutout
  const resolvedNotch = resolveCameraCutout(showCamera, cameraCutout, preset?.notch);

  const effectiveDelay = delay !== 0 ? delay : (startFrame ?? 0);

  // 4. Resolve continuous kinetics (deterministic sinusoidal motion)
  const floatY = calculateContinuousFloating({
    currentFrame,
    fps,
    config: floating,
    delay: effectiveDelay,
  });

  const tiltAngle = calculateContinuousTilt({
    currentFrame,
    fps,
    config: tilt,
    delay: effectiveDelay,
  });

  // 5. Resolve sequential screen reveal transition
  const reveal = calculateScreenRevealState({
    currentFrame,
    config: screenReveal,
  });

  // 6. Resolve status bar style & contrast
  const resolvedStatusBar = React.useMemo(() => {
    if (showStatusBar === false) {
      return false;
    }

    if (showStatusBar === 'light') {
      // Dark icons for light theme app screens
      return (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            zIndex: 20,
            pointerEvents: 'none',
            color: '#0f172a',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '-0.01em',
          }}
        >
          <span>9:41</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="10" viewBox="0 0 17 11" fill="currentColor">
              <rect x="0" y="8" width="2.5" height="3" rx="0.75" />
              <rect x="4.5" y="5.5" width="2.5" height="5.5" rx="0.75" />
              <rect x="9" y="3" width="2.5" height="8" rx="0.75" />
              <rect x="13.5" y="0.5" width="2.5" height="10.5" rx="0.75" />
            </svg>
            <svg width="13" height="10" viewBox="0 0 16 12" fill="currentColor">
              <path d="M8 9.5C8.82843 9.5 9.5 10.1716 9.5 11C9.5 11.8284 8.82843 12.5 8 12.5C7.17157 12.5 6.5 11.8284 6.5 11C6.5 10.1716 7.17157 9.5 8 9.5Z" />
              <path d="M4.2 6.5C5.2 5.5 6.6 5 8 5C9.4 5 10.8 5.5 11.8 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M1.5 3.8C3.2 2.2 5.5 1.4 8 1.4C10.5 1.4 12.8 2.2 14.5 3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
            <div
              style={{
                position: 'relative',
                width: 22,
                height: 11,
                border: '1.2px solid currentColor',
                borderRadius: 3.5,
                padding: 1.5,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{ width: '75%', height: '100%', backgroundColor: 'currentColor', borderRadius: 1.5 }} />
              <div
                style={{
                  position: 'absolute',
                  right: -3,
                  top: 3,
                  width: 1.5,
                  height: 4,
                  backgroundColor: 'currentColor',
                  borderTopRightRadius: 1,
                  borderBottomRightRadius: 1,
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    if (showStatusBar === 'dark' || showStatusBar === true) {
      return true;
    }

    return showStatusBar;
  }, [showStatusBar]);

  const resolvedColor = deviceColor ?? frameColor ?? '#1a1f2c';

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translate3d(0, ${floatY}px, 0) rotate(${tiltAngle}deg)`,
        transformOrigin: 'center center',
        willChange: 'transform',
        ...style,
      }}
    >
      <DeviceFrame
        width={dims.width}
        height={dims.height}
        frameThickness={dims.frameThickness}
        borderRadius={dims.borderRadius}
        screenRadius={dims.screenRadius}
        frameColor={resolvedColor}
        screenColor={screenColor}
        shadow={shadow}
        shadowColor={shadowColor}
        glare={glare}
        notch={resolvedNotch}
        cameraPosition={cameraPosition}
        buttons={showButtons === false ? false : (buttons ?? true)}
        statusBar={resolvedStatusBar}
        homeBar={showHomeIndicator}
        animation={animation}
        animate={animate}
        delay={effectiveDelay}
        durationInFrames={durationInFrames}
        slideDirection={slideDirection}
        easing={easing}
        springPreset={springPreset}
        exitFrame={exitFrame}
        exitDurationInFrames={exitDurationInFrames}
        exitAnimation={exitAnimation}
        screenStyle={{
          overflow: clipScreen ? 'hidden' : 'visible',
          ...screenStyle,
        }}
      >
        {/* Screen Content Wrapper with Sequential Screen Reveal */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            opacity: reveal.opacity,
            transform: `translate3d(0, ${reveal.translateY}px, 0) scale(${reveal.scale})`,
            transformOrigin: 'center center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {screenshot ? (
            <Img
              src={screenshot}
              alt="Smartphone Screen"
              style={{
                width: '100%',
                height: '100%',
                objectFit: imageFit,
                display: 'block',
              }}
            />
          ) : (
            children ?? screenContent
          )}
        </div>
      </DeviceFrame>
    </div>
  );
};
