/**
 * LaptopMockup Component
 * Polished, generic 2D laptop mockup container for Remotion motion graphics.
 * Features a display lid with thin bezels, webcam cutout, hinge connector,
 * and a keyboard deck with chiclet keys grid and trackpad.
 * Supports configurable screen aspect ratios (16:10, 16:9, 3:2), deterministic lid opening kinetics,
 * continuous floating/tilt motion, and sequential screen reveals.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import { Img, useCurrentFrame, useVideoConfig } from 'remotion';
import type { LaptopMockupProps } from './types.ts';
import {
  calculateDeviceMotion,
  resolveDeviceFrameAnimationConfig,
  resolveDeviceShadow,
} from './deviceFrameStyle.ts';
import {
  calculateContinuousFloating,
  calculateContinuousTilt,
  calculateScreenRevealState,
} from './smartphoneMockupStyle.ts';
import {
  calculateLaptopOpeningState,
  resolveLaptopDimensions,
} from './laptopMockupStyle.ts';

const FINISH_COLORS: Record<string, string> = {
  'space-gray': '#2d3139',
  silver: '#d8dde6',
  midnight: '#161c28',
  starlight: '#e8e4dc',
};

const LaptopMockupBase: React.FC<LaptopMockupProps> = ({
  model: modelProp,
  preset,
  width,
  height,
  screenAspectRatio = '16:10',
  deviceColor,
  finish,
  frameColor,
  screenColor = '#000000',
  bezelThickness = 10,
  borderRadius = 14,
  screenRadius,
  baseHeight = 100,
  showKeyboard = true,
  showTrackpad = true,
  showHinge = true,
  showCamera = true,
  cameraType = 'camera-dot',
  shadow = 'medium',
  shadowColor,
  glare = true,
  screenshot,
  imageFit = 'cover',
  children,
  screenContent,
  animation = 'spring',
  animate = true,
  delay = 0,
  durationInFrames = 25,
  slideDirection = 'up',
  easing,
  springPreset = 'snappy',
  floating = false,
  tilt = false,
  openingAnimation = false,
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

  const model = preset ?? modelProp ?? 'standard';
  const resolvedColor =
    deviceColor ??
    (finish && FINISH_COLORS[finish] ? FINISH_COLORS[finish] : undefined) ??
    frameColor ??
    '#1e2430';

  // 1. Resolve geometry & physical dimensions (memoized across frames)
  const dims = React.useMemo(() => {
    return resolveLaptopDimensions({
      model,
      width,
      height,
      screenAspectRatio,
      bezelThickness,
      borderRadius,
      screenRadius,
      baseHeight,
    });
  }, [model, width, height, screenAspectRatio, bezelThickness, borderRadius, screenRadius, baseHeight]);

  // 2. Resolve entrance & exit kinetics (memoized across frames)
  const animConfig = React.useMemo(() => {
    return resolveDeviceFrameAnimationConfig({
      animation,
      animate,
      delay,
      durationInFrames,
      slideDirection,
      easing,
      springPreset,
    });
  }, [animation, animate, delay, durationInFrames, slideDirection, easing, springPreset]);

  const motion = calculateDeviceMotion({
    currentFrame,
    fps,
    config: animConfig,
    exitFrame,
    exitDurationInFrames,
    exitAnimation,
  });

  // 3. Resolve continuous floating and gentle tilt
  const floatY = calculateContinuousFloating({
    currentFrame,
    fps,
    config: floating,
    delay,
  });

  const tiltAngle = calculateContinuousTilt({
    currentFrame,
    fps,
    config: tilt,
    delay,
  });

  // 4. Resolve laptop opening kinetics
  const opening = calculateLaptopOpeningState({
    currentFrame,
    config: openingAnimation,
  });

  // 5. Resolve screen content reveal transition
  const reveal = calculateScreenRevealState({
    currentFrame,
    config: screenReveal,
  });

  const resolvedShadow = resolveDeviceShadow(shadow, shadowColor);

  if (motion.hasExited) {
    return null;
  }

  // Keyboard row layouts for stylized chiclet keys
  const keyboardRows = [
    { count: 14, flexWeights: Array(14).fill(1) }, // Functions
    { count: 14, flexWeights: Array(14).fill(1) }, // Numbers
    { count: 14, flexWeights: [1.4, ...Array(12).fill(1), 1.4] }, // Tab + QWERTY + Delete
    { count: 13, flexWeights: [1.7, ...Array(11).fill(1), 1.8] }, // Caps + ASDF + Return
    { count: 12, flexWeights: [2.2, ...Array(10).fill(1), 2.3] }, // Shift + ZXCV + Shift
    { count: 7, flexWeights: [1.2, 1.2, 1.4, 4.8, 1.4, 1.2, 1.2] }, // Spacebar row
  ];

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: dims.baseWidth,
        height: dims.height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        opacity: motion.opacity,
        transform: `translate3d(${motion.translateX}px, ${motion.translateY + floatY}px, 0) scale(${motion.scaleX}, ${motion.scaleY}) rotate(${motion.rotation + tiltAngle}deg)`,
        transformOrigin: 'bottom center',
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. DISPLAY LID HOUSING (Screen Display Frame)                 */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: 'relative',
          width: dims.lidWidth,
          height: dims.lidHeight,
          backgroundColor: resolvedColor,
          borderRadius: dims.borderRadius,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: resolvedShadow,
          boxSizing: 'border-box',
          padding: dims.bezelThickness,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `perspective(1000px) rotateX(${opening.angle}deg)`,
          transformOrigin: 'bottom center',
          opacity: opening.lidOpacity,
          zIndex: 2,
        }}
      >
        {/* Subtle Outer Bezel Edge Reflection Ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: dims.borderRadius,
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.18), inset 0 -1px 1px rgba(0, 0, 0, 0.5)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Bezel Webcam Cutout */}
        {showCamera && cameraType !== 'none' && (
          <div
            style={{
              position: 'absolute',
              top: Math.max(2, Math.round(dims.bezelThickness / 2) - 3),
              left: '50%',
              transform: 'translateX(-50%)',
              width: cameraType === 'notch' ? 44 : 6,
              height: cameraType === 'notch' ? 12 : 6,
              backgroundColor: '#070a0e',
              borderRadius: cameraType === 'notch' ? '0 0 6px 6px' : '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 1px rgba(39, 110, 241, 0.6)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            {/* Center camera lens reflex dot */}
            <div
              style={{
                width: 2.5,
                height: 2.5,
                borderRadius: '50%',
                backgroundColor: 'rgba(56, 189, 248, 0.6)',
              }}
            />
          </div>
        )}

        {/* Inner Screen Viewport Container */}
        <div
          style={{
            position: 'relative',
            width: dims.screenWidth,
            height: dims.screenHeight,
            backgroundColor: screenColor,
            borderRadius: dims.screenRadius,
            overflow: 'hidden',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            ...screenStyle,
          }}
        >
          {/* Screen Content Wrapper with Sequential Reveal */}
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
              zIndex: 1,
            }}
          >
            {screenshot ? (
              <Img
                src={screenshot}
                alt="Laptop Screen Content"
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

          {/* Diagonal Glass Glare Reflection Overlay */}
          {glare && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 42%, transparent 60%)',
                borderRadius: dims.screenRadius,
                pointerEvents: 'none',
                zIndex: 5,
              }}
            />
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. LAPTOP HINGE DETAIL                                        */}
      {/* ------------------------------------------------------------- */}
      {showHinge && (
        <div
          style={{
            width: dims.hingeWidth,
            height: dims.hingeHeight,
            backgroundColor: '#0f141d',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(0, 0, 0, 0.4)',
            zIndex: 3,
            marginTop: -2,
            marginBottom: -2,
          }}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. KEYBOARD DECK / BASE CHASSIS                               */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: 'relative',
          width: dims.baseWidth,
          height: dims.baseHeight,
          backgroundColor: resolvedColor,
          borderRadius: `4px 4px ${dims.borderRadius}px ${dims.borderRadius}px`,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 14px 10px 14px',
          boxSizing: 'border-box',
          zIndex: 1,
        }}
      >
        {/* Top Front Lip Notch (Finger opening groove) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 48,
            height: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            borderRadius: '0 0 3px 3px',
          }}
        />

        {/* Keyboard Area Well & Chiclet Keys Grid */}
        {showKeyboard ? (
          <div
            style={{
              width: dims.keyboardWidth,
              height: dims.keyboardHeight,
              backgroundColor: '#0c1017',
              borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '3px 4px',
              boxSizing: 'border-box',
            }}
          >
            {keyboardRows.map((row, rIdx) => (
              <div
                key={rIdx}
                style={{
                  display: 'flex',
                  gap: 2.5,
                  height: rIdx === 0 ? '11%' : '15%',
                  alignItems: 'center',
                }}
              >
                {row.flexWeights.map((weight, kIdx) => (
                  <div
                    key={kIdx}
                    style={{
                      flex: weight,
                      height: '100%',
                      backgroundColor: '#19202c',
                      borderRadius: 1.5,
                      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.4), inset 0 0.5px 0.5px rgba(255, 255, 255, 0.08)',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ height: dims.keyboardHeight }} />
        )}

        {/* Trackpad Area */}
        {showTrackpad ? (
          <div
            style={{
              width: dims.trackpadWidth,
              height: dims.trackpadHeight,
              borderRadius: 5,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.015)',
              marginBottom: 2,
            }}
          />
        ) : (
          <div style={{ height: dims.trackpadHeight }} />
        )}
      </div>
    </div>
  );
};

export const LaptopMockup = React.memo(LaptopMockupBase);
