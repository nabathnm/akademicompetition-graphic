/**
 * DeviceFrame Component
 * Foundational hardware mockup container for mobile, tablet, and desktop display viewports.
 * Provides concentric screen geometry, multi-layered 2D depth shadows, hardware side buttons,
 * camera/notch cutouts, diagonal glass glare reflections, and Remotion frame-accurate entrance kinetics.
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { DeviceButtonConfig, DeviceFrameProps } from './types.ts';
import {
  calculateDeviceDimensions,
  calculateDeviceMotion,
  resolveDeviceFrameAnimationConfig,
  resolveDeviceShadow,
} from './deviceFrameStyle.ts';

/** Default hardware button configuration for smartphone form factor */
const DEFAULT_BUTTONS: DeviceButtonConfig[] = [
  // Left: Volume Up
  { side: 'left', position: 18, length: 44, thickness: 3, color: 'rgba(255, 255, 255, 0.22)' },
  // Left: Volume Down
  { side: 'left', position: 28, length: 44, thickness: 3, color: 'rgba(255, 255, 255, 0.22)' },
  // Right: Power / Lock
  { side: 'right', position: 22, length: 58, thickness: 3, color: 'rgba(255, 255, 255, 0.22)' },
];

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  width = 320,
  height = 640,
  frameThickness = 12,
  borderRadius = 38,
  screenRadius,
  frameColor = '#1e2430',
  screenColor = '#000000',
  borderWidth = 1,
  borderColor = 'rgba(255, 255, 255, 0.12)',
  innerBorderWidth = 1,
  innerBorderColor = 'rgba(0, 0, 0, 0.4)',
  shadow = 'medium',
  shadowColor,
  glare = true,
  notch = 'none',
  notchWidth,
  notchHeight,
  cameraPosition = 'center',
  buttons = false,
  statusBar = false,
  homeBar = false,
  children,
  screenContent,
  animation = 'spring',
  animate = true,
  delay = 0,
  startFrame,
  durationInFrames = 25,
  slideDirection = 'up',
  easing,
  springPreset = 'snappy',
  exitFrame,
  exitDurationInFrames = 15,
  exitAnimation = 'fade-out',
  style,
  screenStyle,
  className,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Compute concentric dimensions
  const dims = calculateDeviceDimensions({
    width,
    height,
    frameThickness,
    borderRadius,
    screenRadius,
  });

  const effectiveDelay = delay !== 0 ? delay : (startFrame ?? 0);

  // 2. Resolve animation kinematics
  const animConfig = resolveDeviceFrameAnimationConfig({
    animation,
    animate,
    delay: effectiveDelay,
    durationInFrames,
    slideDirection,
    easing,
    springPreset,
  });

  const motion = calculateDeviceMotion({
    currentFrame,
    fps,
    config: animConfig,
    exitFrame,
    exitDurationInFrames,
    exitAnimation,
  });

  // 3. Resolve 2D depth shadow
  const resolvedShadow = resolveDeviceShadow(shadow, shadowColor);

  // 4. Resolve hardware buttons
  const resolvedButtons: DeviceButtonConfig[] = React.useMemo(() => {
    if (!buttons) return [];
    if (Array.isArray(buttons)) return buttons;
    return DEFAULT_BUTTONS;
  }, [buttons]);

  // 5. Notch cutout dimensions
  const resolvedNotchWidth = notchWidth ?? (
    notch === 'dynamic-island' ? 84 :
    notch === 'notch' ? 116 :
    notch === 'punch-hole' ? 11 :
    notch === 'speaker' ? 48 : 0
  );

  const resolvedNotchHeight = notchHeight ?? (
    notch === 'dynamic-island' ? 24 :
    notch === 'notch' ? 22 :
    notch === 'punch-hole' ? 11 :
    notch === 'speaker' ? 4 : 0
  );

  // If exit transition has completely finished, hide node
  if (motion.hasExited) {
    return null;
  }

  // Camera horizontal alignment
  const notchLeft =
    cameraPosition === 'left' ? 24 :
    cameraPosition === 'right' ? dims.width - 24 - resolvedNotchWidth :
    (dims.width - resolvedNotchWidth) / 2;

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: dims.width,
        height: dims.height,
        opacity: motion.opacity,
        transform: `translate3d(${motion.translateX}px, ${motion.translateY}px, 0) scale(${motion.scaleX}, ${motion.scaleY}) rotate(${motion.rotation}deg)`,
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
        ...style,
      }}
    >
      {/* Hardware Buttons on Frame Edge */}
      {resolvedButtons.map((btn, index) => {
        const isLeft = btn.side === 'left';
        const thickness = btn.thickness ?? 3;
        const btnColor = btn.color ?? 'rgba(255, 255, 255, 0.22)';
        const topPos = typeof btn.position === 'number' && btn.position <= 100
          ? `${btn.position}%`
          : `${btn.position}px`;

        return (
          <div
            key={`hw-btn-${index}`}
            style={{
              position: 'absolute',
              top: topPos,
              [isLeft ? 'left' : 'right']: -thickness,
              width: thickness,
              height: btn.length,
              backgroundColor: btnColor,
              borderTopLeftRadius: isLeft ? 2 : 0,
              borderBottomLeftRadius: isLeft ? 2 : 0,
              borderTopRightRadius: !isLeft ? 2 : 0,
              borderBottomRightRadius: !isLeft ? 2 : 0,
              boxShadow: isLeft
                ? '-1px 0 2px rgba(0,0,0,0.4)'
                : '1px 0 2px rgba(0,0,0,0.4)',
              zIndex: 0,
            }}
          />
        );
      })}

      {/* Outer Device Bezel Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: frameColor,
          borderRadius: dims.borderRadius,
          border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : undefined,
          boxShadow: resolvedShadow,
          boxSizing: 'border-box',
          padding: dims.frameThickness,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        {/* Subtle Outer Bezel Highlight Ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: dims.borderRadius,
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.15), inset 0 -1px 1px rgba(0, 0, 0, 0.4)',
            pointerEvents: 'none',
          }}
        />

        {/* Inner Screen Display Viewport */}
        <div
          style={{
            position: 'relative',
            width: dims.screenWidth,
            height: dims.screenHeight,
            backgroundColor: screenColor,
            borderRadius: dims.screenRadius,
            border: innerBorderWidth > 0 ? `${innerBorderWidth}px solid ${innerBorderColor}` : undefined,
            overflow: 'hidden',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            ...screenStyle,
          }}
        >
          {/* Screen Content */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1,
            }}
          >
            {children ?? screenContent}
          </div>

          {/* Optional Mock Status Bar */}
          {statusBar && (
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
                color: '#ffffff',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              {typeof statusBar === 'boolean' ? (
                <>
                  {/* Left: Time */}
                  <span>9:41</span>

                  {/* Right: Signal, Wifi, Battery */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {/* Cellular bars */}
                    <svg width="14" height="10" viewBox="0 0 17 11" fill="currentColor">
                      <rect x="0" y="8" width="2.5" height="3" rx="0.75" />
                      <rect x="4.5" y="5.5" width="2.5" height="5.5" rx="0.75" />
                      <rect x="9" y="3" width="2.5" height="8" rx="0.75" />
                      <rect x="13.5" y="0.5" width="2.5" height="10.5" rx="0.75" />
                    </svg>

                    {/* Wifi */}
                    <svg width="13" height="10" viewBox="0 0 16 12" fill="currentColor">
                      <path d="M8 9.5C8.82843 9.5 9.5 10.1716 9.5 11C9.5 11.8284 8.82843 12.5 8 12.5C7.17157 12.5 6.5 11.8284 6.5 11C6.5 10.1716 7.17157 9.5 8 9.5Z" />
                      <path d="M4.2 6.5C5.2 5.5 6.6 5 8 5C9.4 5 10.8 5.5 11.8 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      <path d="M1.5 3.8C3.2 2.2 5.5 1.4 8 1.4C10.5 1.4 12.8 2.2 14.5 3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    </svg>

                    {/* Battery */}
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
                      <div
                        style={{
                          width: '75%',
                          height: '100%',
                          backgroundColor: 'currentColor',
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
                          backgroundColor: 'currentColor',
                          borderTopRightRadius: 1,
                          borderBottomRightRadius: 1,
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                statusBar
              )}
            </div>
          )}

          {/* Notch / Dynamic Island / Cutout */}
          {notch !== 'none' && (
            <div
              style={{
                position: 'absolute',
                top: notch === 'notch' ? 0 : 8,
                left: notchLeft - dims.frameThickness,
                width: resolvedNotchWidth,
                height: resolvedNotchHeight,
                backgroundColor: '#000000',
                borderRadius:
                  notch === 'punch-hole' ? '50%' :
                  notch === 'notch' ? '0 0 14px 14px' :
                  notch === 'speaker' ? 2 : 14,
                zIndex: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: notch === 'dynamic-island' ? '0 2px 6px rgba(0, 0, 0, 0.4)' : undefined,
                pointerEvents: 'none',
              }}
            >
              {/* Dynamic Island inner camera lens reflex */}
              {notch === 'dynamic-island' && (
                <div
                  style={{
                    position: 'absolute',
                    right: 9,
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    backgroundColor: '#0d131a',
                    boxShadow: 'inset 0 0 2px rgba(39, 110, 241, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 3.5,
                      height: 3.5,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(39, 110, 241, 0.4)',
                    }}
                  />
                </div>
              )}

              {/* Punch-hole camera lens reflex */}
              {notch === 'punch-hole' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    backgroundColor: '#0a0d12',
                    boxShadow: 'inset 0 0 2px rgba(39, 110, 241, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(56, 189, 248, 0.5)',
                    }}
                  />
                </div>
              )}

              {/* Speaker slit inner texture */}
              {notch === 'speaker' && (
                <div
                  style={{
                    width: '80%',
                    height: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: 1,
                  }}
                />
              )}
            </div>
          )}

          {/* Optional Home Bar Indicator */}
          {homeBar && (
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: Math.min(134, dims.screenWidth * 0.42),
                height: 4.5,
                backgroundColor: 'rgba(255, 255, 255, 0.55)',
                borderRadius: 3,
                zIndex: 25,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Subtle Diagonal Glass Glare Reflection Overlay */}
          {glare && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 42%, rgba(255, 255, 255, 0) 58%)',
                borderRadius: dims.screenRadius,
                pointerEvents: 'none',
                zIndex: 22,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
