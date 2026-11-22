/**
 * DeviceShowcaseScene Component
 * Layer 3 of the Motion Graphics Framework.
 *
 * Dedicated scene template for presenting digital products, software interfaces, and responsive experiences
 * inside hardware mockups (Smartphone, Tablet, Laptop, BrowserWindow, and DeviceFrame).
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { SceneContainer } from './SceneContainer';
import type { DeviceItemConfig, DeviceShowcaseSceneProps } from './types';
import {
  calculateDeviceShowcaseKinematics,
  resolveDeviceAnnotationPosition,
  resolveDeviceShowcaseLayout,
} from './deviceShowcaseSceneStyle';
import { SmartphoneMockup } from '../mockups/SmartphoneMockup';
import { TabletMockup } from '../mockups/TabletMockup';
import { LaptopMockup } from '../mockups/LaptopMockup';
import { BrowserWindowMockup } from '../mockups/BrowserWindowMockup';
import { DeviceFrame } from '../mockups/DeviceFrame';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';

export const DeviceShowcaseScene: React.FC<DeviceShowcaseSceneProps> = ({
  title,
  subtitle,
  description,
  label,
  primaryDevice,
  secondaryDevices = [],
  devices: customDevices,
  annotations = [],
  decorativeElements,
  layout = 'single-centered',
  animation,
  staggerDelay = 6,
  children,
  background,
  backgroundColor,
  backgroundImage,
  durationInFrames,
  delay = 0,
  width,
  height,
  padding,
  safeArea = true,
  sceneId = 'device-showcase-scene',
  debug = false,
  style,
  className,
}) => {
  const frame = useCurrentFrame();

  // Consolidate devices list: prefer `devices` prop if passed, otherwise `[primaryDevice, ...secondaryDevices]`
  const effectiveDevices: DeviceItemConfig[] = React.useMemo(() => {
    if (customDevices && customDevices.length > 0) {
      return customDevices;
    }
    if (primaryDevice) {
      return [primaryDevice, ...secondaryDevices];
    }
    // Default fallback: single smartphone mockup
    return [
      {
        id: 'default-phone',
        type: 'smartphone',
        width: 280,
        height: 580,
      },
    ];
  }, [customDevices, primaryDevice, secondaryDevices]);

  const kinematics = calculateDeviceShowcaseKinematics({
    frame,
    delay,
    staggerDelay,
    animation,
    devices: effectiveDevices,
    annotationCount: annotations.length,
  });

  const resolved = resolveDeviceShowcaseLayout(layout);

  // Helper to render individual device mockup components
  const renderMockup = (device: DeviceItemConfig) => {
    const content = device.screenContent ?? children;

    switch (device.type) {
      case 'smartphone':
        return (
          <SmartphoneMockup
            width={device.width ?? 280}
            height={device.height ?? 580}
            deviceColor={device.deviceColor}
            screenshot={device.screenshot}
            screenContent={content}
            animate={false}
          />
        );

      case 'tablet':
        return (
          <TabletMockup
            width={device.width ?? 520}
            height={device.height ?? 380}
            orientation={device.orientation ?? 'landscape'}
            deviceColor={device.deviceColor}
            screenshot={device.screenshot}
            screenContent={content}
            animate={false}
          />
        );

      case 'laptop':
        return (
          <LaptopMockup
            width={device.width ?? 640}
            height={device.height ?? 400}
            deviceColor={device.deviceColor}
            screenshot={device.screenshot}
            screenContent={content}
            animate={false}
          />
        );

      case 'browser':
        return (
          <BrowserWindowMockup
            width={device.width ?? 680}
            height={device.height ?? 420}
            url={device.url ?? 'https://antigravity.dev'}
            title={device.browserTitle ?? 'Application Dashboard'}
            screenContent={content}
            animate={false}
          />
        );

      case 'frame':
      default:
        return (
          <DeviceFrame
            width={device.width ?? 320}
            height={device.height ?? 540}
            frameColor={device.deviceColor}
            screenContent={content}
            animate={false}
          />
        );
    }
  };

  // Render text block
  const renderTextBlock = () => (
    <div style={resolved.textColStyle}>
      {/* Category Eyebrow / Label */}
      {label && (
        <div
          style={{
            opacity: kinematics.label.opacity,
            transform: `translateY(${kinematics.label.translateY}px)`,
          }}
        >
          <span
            style={{
              ...Typography.caption.eyebrow,
              color: Colors.accent.cyan,
              backgroundColor: `${Colors.accent.cyan}18`,
              border: `1px solid ${Colors.accent.cyan}40`,
              padding: '4px 12px',
              borderRadius: 16,
              display: 'inline-block',
            }}
          >
            {label}
          </span>
        </div>
      )}

      {/* Main Title */}
      <h2
        style={{
          ...Typography.headline.h1,
          color: Colors.text.primary,
          margin: 0,
          opacity: kinematics.title.opacity,
          transform: `translateY(${kinematics.title.translateY}px)`,
        }}
      >
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            ...Typography.headline.h3,
            color: Colors.text.secondary,
            margin: 0,
            opacity: kinematics.subtitle.opacity,
            transform: `translateY(${kinematics.subtitle.translateY}px)`,
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Description */}
      {description && (
        <p
          style={{
            ...Typography.body.large,
            color: Colors.text.tertiary,
            margin: 0,
            maxWidth: 620,
            opacity: kinematics.description.opacity,
            transform: `translateY(${kinematics.description.translateY}px)`,
          }}
        >
          {description}
        </p>
      )}

      {/* Ambient decorative graphics */}
      {decorativeElements && (
        <div style={{ marginTop: Spacing.scale.sm }}>
          {decorativeElements}
        </div>
      )}
    </div>
  );

  // Render device(s) collection
  const renderDeviceBlock = () => (
    <div style={resolved.deviceColStyle}>
      {effectiveDevices.map((device, idx) => {
        const metric = kinematics.devices[idx] ?? {
          opacity: 1,
          translateY: 0,
          translateX: 0,
          scale: 1,
          rotation: 0,
          floatingY: 0,
        };

        const wrapperStyle = resolved.deviceWrapperStyle(
          idx,
          effectiveDevices.length,
          device,
        );

        return (
          <div
            key={device.id ?? `dev-${idx}`}
            style={{
              ...wrapperStyle,
              opacity: metric.opacity,
              transform: `translate3d(${metric.translateX}px, ${metric.translateY + metric.floatingY}px, 0) scale(${metric.scale}) rotate(${metric.rotation}deg)`,
              willChange: 'transform, opacity',
              ...device.style,
            }}
          >
            {renderMockup(device)}
          </div>
        );
      })}

      {/* Hardware / Feature Callout Annotations */}
      {annotations.map((anno, idx) => {
        const metric = kinematics.annotations[idx] ?? { opacity: 1, scale: 1 };
        const posStyle = resolveDeviceAnnotationPosition(anno);
        const cardColor = anno.color ?? Colors.accent.cyan;

        return (
          <div
            key={anno.id ?? `anno-${idx}`}
            style={{
              ...posStyle,
              opacity: metric.opacity,
              transform: `${posStyle.transform ?? ''} scale(${metric.scale})`,
              backgroundColor: '#0a101dc8',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${cardColor}50`,
              borderRadius: Spacing.radius.sm,
              padding: '8px 14px',
              maxWidth: 220,
              boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 12px ${cardColor}25`,
              pointerEvents: 'none',
            }}
          >
            {anno.badge && (
              <span
                style={{
                  fontSize: 9,
                  fontFamily: Typography.fontFamily.mono,
                  color: cardColor,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: 2,
                }}
              >
                {anno.badge}
              </span>
            )}
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: Colors.text.primary,
                fontFamily: Typography.fontFamily.sans,
              }}
            >
              {anno.title}
            </div>
            {anno.description && (
              <div
                style={{
                  fontSize: 11,
                  color: Colors.text.secondary,
                  fontFamily: Typography.fontFamily.sans,
                  marginTop: 2,
                  lineHeight: 1.35,
                }}
              >
                {anno.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <SceneContainer
      width={width}
      height={height}
      background={background}
      backgroundColor={backgroundColor}
      backgroundImage={backgroundImage}
      durationInFrames={durationInFrames}
      delay={delay}
      padding={padding}
      safeArea={safeArea}
      sceneId={sceneId}
      debug={debug}
      layout="custom"
      style={style}
      className={className}
    >
      <div style={resolved.containerStyle}>
        {layout === 'device-left' ? (
          <>
            {renderDeviceBlock()}
            {renderTextBlock()}
          </>
        ) : (
          <>
            {renderTextBlock()}
            {renderDeviceBlock()}
          </>
        )}
      </div>
    </SceneContainer>
  );
};
