/**
 * TabletMockup Component
 * Configurable, high-fidelity tablet mockup container for Remotion motion graphics.
 * Supports landscape and portrait orientations, calibrated model presets (compact, standard, pro),
 * metallic finishes, Touch ID home button, magnetic stylus dock, tablet status bar,
 * deterministic device rotation kinetics, continuous floating/tilt, and sequential screen reveals.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import { Img, useCurrentFrame, useVideoConfig } from 'remotion';
import type { DeviceNotchType, TabletMockupProps } from './types.ts';
import { DeviceFrame } from './DeviceFrame.tsx';
import {
  calculateContinuousFloating,
  calculateContinuousTilt,
  calculateScreenRevealState,
} from './smartphoneMockupStyle.ts';
import {
  calculateTabletRotationState,
  resolveTabletDimensions,
  TABLET_FINISH_COLORS,
} from './tabletMockupStyle.ts';

export const TabletMockup: React.FC<TabletMockupProps> = ({
  model: modelProp,
  preset,
  orientation = 'landscape',
  width,
  height,
  aspectRatio,
  finish,
  deviceColor,
  frameColor,
  screenColor = '#000000',
  frameThickness,
  borderRadius,
  screenRadius,
  showCamera = true,
  cameraPosition,
  showHomeButton = false,
  showStatusBar = true,
  showHomeIndicator = true,
  showStylus = false,
  showButtons = true,
  buttons,
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
  deviceRotation,
  rotationAnimation = false,
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

  // 1. Resolve model & orientation dimensions
  const dims = resolveTabletDimensions({
    model: modelProp,
    preset,
    orientation,
    width,
    height,
    aspectRatio,
    frameThickness,
    borderRadius,
    screenRadius,
  });

  // 2. Resolve chassis color finish
  const resolvedColor =
    deviceColor ??
    (finish && finish in TABLET_FINISH_COLORS
      ? TABLET_FINISH_COLORS[finish as keyof typeof TABLET_FINISH_COLORS]
      : undefined) ??
    frameColor ??
    '#1e2430';

  // 3. Resolve continuous kinetics
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

  // 4. Resolve device orientation rotation angle
  const rotationAngle = calculateTabletRotationState({
    currentFrame,
    config: rotationAnimation,
    staticAngle: deviceRotation,
  });

  // 5. Resolve sequential screen reveal transition
  const reveal = calculateScreenRevealState({
    currentFrame,
    config: screenReveal,
  });

  // 6. Camera position & notch type
  const resolvedCameraPosition =
    cameraPosition ?? (orientation === 'landscape' ? 'top' : 'top');
  const resolvedNotch: DeviceNotchType = showCamera ? 'punch-hole' : 'none';

  // 7. Resolve tablet status bar layout
  const resolvedStatusBar = React.useMemo(() => {
    if (showStatusBar === false) {
      return false;
    }

    if (React.isValidElement(showStatusBar)) {
      return showStatusBar;
    }

    const isLightScreen = showStatusBar === 'light';
    const textColor = isLightScreen ? '#0f172a' : '#f8fafc';
    const iconColor = isLightScreen ? '#0f172a' : '#f8fafc';

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 25,
          pointerEvents: 'none',
          color: textColor,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        {/* Left: Clock and optional weekday */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>9:41 AM</span>
          <span style={{ fontSize: 11, opacity: 0.65, fontWeight: 500 }}>Tue Sep 12</span>
        </div>

        {/* Right: Connectivity and Battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Cellular Signal */}
          <svg width="15" height="10" viewBox="0 0 17 11" fill={iconColor}>
            <rect x="0" y="8" width="2.5" height="3" rx="0.75" />
            <rect x="4.5" y="5.5" width="2.5" height="5.5" rx="0.75" />
            <rect x="9" y="3" width="2.5" height="8" rx="0.75" />
            <rect x="13.5" y="0.5" width="2.5" height="10.5" rx="0.75" />
          </svg>
          {/* Wifi Icon */}
          <svg width="14" height="10" viewBox="0 0 16 12" fill={iconColor}>
            <path d="M8 9.5C8.82843 9.5 9.5 10.1716 9.5 11C9.5 11.8284 8.82843 12.5 8 12.5C7.17157 12.5 6.5 11.8284 6.5 11C6.5 10.1716 7.17157 9.5 8 9.5Z" />
            <path
              d="M4.2 6.5C5.2 5.5 6.6 5 8 5C9.4 5 10.8 5.5 11.8 6.5"
              stroke={iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M1.5 3.8C3.2 2.2 5.5 1.4 8 1.4C10.5 1.4 12.8 2.2 14.5 3.8"
              stroke={iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          {/* Battery Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700 }}>98%</span>
            <div
              style={{
                position: 'relative',
                width: 22,
                height: 11,
                border: `1.2px solid ${iconColor}`,
                borderRadius: 3.5,
                padding: 1.5,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '90%',
                  height: '100%',
                  backgroundColor: iconColor,
                  borderRadius: 1.5,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  right: -3,
                  top: 3,
                  width: 1.5,
                  height: 4,
                  backgroundColor: iconColor,
                  borderTopRightRadius: 1,
                  borderBottomRightRadius: 1,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }, [showStatusBar]);

  // Combined rotation & tilt transform
  const totalTransform = [
    `translate3d(0, ${floatY}px, 0)`,
    `rotate(${rotationAngle}deg)`,
    `rotateY(${tiltAngle}deg)`,
  ].join(' ');

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: totalTransform,
        transformOrigin: 'center center',
        willChange: 'transform',
        ...style,
      }}
    >
      {/* Optional Stylus / Apple Pencil Magnetic Dock Accent */}
      {showStylus && (
        <div
          style={{
            position: 'absolute',
            ...(orientation === 'landscape'
              ? {
                  top: -8,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: Math.min(dims.width * 0.55, 340),
                  height: 6,
                  borderRadius: '3px 3px 0 0',
                }
              : {
                  right: -8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 6,
                  height: Math.min(dims.height * 0.55, 340),
                  borderRadius: '0 3px 3px 0',
                }),
            backgroundColor: '#f1f5f9',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          {/* Magnetic Charging Center Line */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              ...(orientation === 'landscape'
                ? { width: 36, height: 1.5 }
                : { width: 1.5, height: 36 }),
              backgroundColor: 'rgba(0, 0, 0, 0.22)',
              borderRadius: 1,
            }}
          />
        </div>
      )}

      {/* Core Device Hardware Frame */}
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
        cameraPosition={resolvedCameraPosition}
        buttons={showButtons === false ? false : (buttons ?? true)}
        statusBar={resolvedStatusBar}
        homeBar={showHomeIndicator}
        animation={animation}
        animate={animate}
        delay={delay}
        durationInFrames={durationInFrames}
        slideDirection={slideDirection}
        easing={easing}
        springPreset={springPreset}
        exitFrame={exitFrame}
        exitDurationInFrames={exitDurationInFrames}
        exitAnimation={exitAnimation}
        screenStyle={{
          overflow: 'hidden',
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
              alt="Tablet Screen"
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

      {/* Optional Touch ID / Classic Circular Home Button */}
      {showHomeButton && (
        <div
          style={{
            position: 'absolute',
            ...(orientation === 'portrait'
              ? {
                  bottom: Math.max(3, Math.round((dims.frameThickness - 18) / 2)),
                  left: '50%',
                  transform: 'translateX(-50%)',
                }
              : {
                  right: Math.max(3, Math.round((dims.frameThickness - 18) / 2)),
                  top: '50%',
                  transform: 'translateY(-50%)',
                }),
            width: 16,
            height: 16,
            borderRadius: '50%',
            border: '1.2px solid rgba(255, 255, 255, 0.28)',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.6)',
            zIndex: 30,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Inner Touch ID Square Detail */}
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: 1,
              border: '0.8px solid rgba(255, 255, 255, 0.2)',
            }}
          />
        </div>
      )}
    </div>
  );
};
