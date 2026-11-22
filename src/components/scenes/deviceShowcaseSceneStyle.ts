/**
 * DeviceShowcaseScene Mathematical and Layout Engine
 * Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import type {
  DeviceAnnotationItem,
  DeviceItemConfig,
  DeviceShowcaseAnimationConfig,
  DeviceShowcaseLayout,
} from './types.ts';
import { clamp } from '../../utils/animation/clamp.ts';
import { easeOut } from '../../utils/animation/easing.ts';

export interface DeviceSlotMetrics {
  opacity: number;
  translateY: number;
  translateX: number;
  scale: number;
  rotation: number;
  progress: number;
  isSettled: boolean;
  floatingY: number;
  tiltAngle: number;
}

export interface DeviceShowcaseKinematics {
  title: DeviceSlotMetrics;
  subtitle: DeviceSlotMetrics;
  description: DeviceSlotMetrics;
  label: DeviceSlotMetrics;
  devices: DeviceSlotMetrics[];
  annotations: DeviceSlotMetrics[];
}

export interface DeviceShowcaseKinematicsOptions {
  frame: number;
  delay?: number;
  staggerDelay?: number;
  animation?: DeviceShowcaseAnimationConfig;
  devices?: DeviceItemConfig[];
  annotationCount?: number;
}

/**
 * Calculates deterministic kinematics for text slots, multi-device entrances, continuous floating hover physics, and annotations.
 */
export function calculateDeviceShowcaseKinematics(
  options: DeviceShowcaseKinematicsOptions,
): DeviceShowcaseKinematics {
  const {
    frame,
    delay = 0,
    staggerDelay: globalStagger = 6,
    animation,
    devices = [],
    annotationCount = 0,
  } = options;

  const config = animation ?? {};
  const stagger = config.staggerDelay ?? globalStagger;
  const globalFloating = config.floating !== false;
  const baseAmp = config.floatingAmplitude ?? 8;
  const baseSpeed = config.floatingSpeed ?? 0.05;

  const labelStart = delay;
  const titleStart = delay + (config.titleDelay ?? stagger * 1);
  const subtitleStart = delay + (config.subtitleDelay ?? stagger * 2);
  const descStart = delay + stagger * 3;
  const devicesStart = delay + (config.devicesDelay ?? stagger * 1);
  const annotationsStart = delay + (config.annotationsDelay ?? stagger * 4);

  const computeTextSlot = (
    startFrame: number,
    animType: 'slide-up' | 'fade' | 'none' = 'slide-up',
    duration = 18,
    slideDistance = 24,
  ): DeviceSlotMetrics => {
    if (animType === 'none') {
      return {
        opacity: 1,
        translateY: 0,
        translateX: 0,
        scale: 1,
        rotation: 0,
        progress: 1,
        isSettled: true,
        floatingY: 0,
        tiltAngle: 0,
      };
    }

    if (frame < startFrame) {
      return {
        opacity: 0,
        translateY: animType === 'slide-up' ? slideDistance : 0,
        translateX: 0,
        scale: 1,
        rotation: 0,
        progress: 0,
        isSettled: false,
        floatingY: 0,
        tiltAngle: 0,
      };
    }

    const raw = clamp((frame - startFrame) / duration, 0, 1);
    const progress = easeOut(raw);

    return {
      opacity: progress,
      translateY: animType === 'slide-up' ? slideDistance * (1 - progress) : 0,
      translateX: 0,
      scale: 1,
      rotation: 0,
      progress,
      isSettled: raw >= 1,
      floatingY: 0,
      tiltAngle: 0,
    };
  };

  const textAnim = config.textAnimation ?? 'slide-up';
  const annoAnim = config.annotationAnimation ?? 'pop';

  // Compute kinematics for each device
  const deviceMetrics: DeviceSlotMetrics[] = devices.map((dev, idx) => {
    const devStart = dev.delay ?? (devicesStart + idx * stagger);
    const devDuration = dev.durationInFrames ?? 22;
    const anim = dev.animation ?? 'scale';

    let opacity = 1;
    let translateY = 0;
    let translateX = 0;
    let scale = dev.scale ?? 1;
    let progress = 1;
    let isSettled = true;

    if (anim !== 'none') {
      if (frame < devStart) {
        opacity = 0;
        translateY = anim === 'slide-up' ? 50 : 0;
        translateX = anim === 'slide-left' ? 50 : anim === 'slide-right' ? -50 : 0;
        scale = anim === 'scale' ? 0.75 * (dev.scale ?? 1) : dev.scale ?? 1;
        progress = 0;
        isSettled = false;
      } else {
        const raw = clamp((frame - devStart) / devDuration, 0, 1);
        progress = easeOut(raw);
        opacity = progress;
        translateY = anim === 'slide-up' ? 50 * (1 - progress) : 0;
        translateX =
          anim === 'slide-left'
            ? 50 * (1 - progress)
            : anim === 'slide-right'
              ? -50 * (1 - progress)
              : 0;
        scale =
          anim === 'scale'
            ? (0.75 + 0.25 * progress) * (dev.scale ?? 1)
            : dev.scale ?? 1;
        isSettled = raw >= 1;
      }
    }

    // Continuous floating hover physics
    let floatingY = 0;
    if (globalFloating && dev.floating !== false) {
      const floatConfig = typeof dev.floating === 'object' ? dev.floating : {};
      const amp = floatConfig.amplitude ?? baseAmp;
      const freq = floatConfig.frequency ?? baseSpeed;
      const phase = floatConfig.phase ?? (idx * Math.PI * 0.4);
      floatingY = Math.sin(frame * freq + phase) * amp;
    }

    // Continuous tilt rotation
    let tiltAngle = 0;
    if (dev.tilt) {
      const tiltConfig = typeof dev.tilt === 'object' ? dev.tilt : {};
      const maxA = tiltConfig.maxAngle ?? 2.5;
      const freq = tiltConfig.frequency ?? 0.035;
      tiltAngle = Math.sin(frame * freq + idx * 1.2) * maxA;
    }

    return {
      opacity,
      translateY,
      translateX,
      scale,
      rotation: tiltAngle,
      progress,
      isSettled,
      floatingY,
      tiltAngle,
    };
  });

  // Compute kinematics for annotations
  const annotationMetrics: DeviceSlotMetrics[] = [];
  for (let i = 0; i < annotationCount; i++) {
    const start = annotationsStart + i * stagger;
    if (annoAnim === 'none') {
      annotationMetrics.push({
        opacity: 1,
        translateY: 0,
        translateX: 0,
        scale: 1,
        rotation: 0,
        progress: 1,
        isSettled: true,
        floatingY: 0,
        tiltAngle: 0,
      });
    } else if (frame < start) {
      annotationMetrics.push({
        opacity: 0,
        translateY: annoAnim === 'slide' ? 16 : 0,
        translateX: 0,
        scale: annoAnim === 'pop' ? 0.7 : 1,
        rotation: 0,
        progress: 0,
        isSettled: false,
        floatingY: 0,
        tiltAngle: 0,
      });
    } else {
      const raw = clamp((frame - start) / 16, 0, 1);
      const prog = easeOut(raw);
      annotationMetrics.push({
        opacity: prog,
        translateY: annoAnim === 'slide' ? 16 * (1 - prog) : 0,
        translateX: 0,
        scale: annoAnim === 'pop' ? 0.7 + 0.3 * prog : 1,
        rotation: 0,
        progress: prog,
        isSettled: raw >= 1,
        floatingY: 0,
        tiltAngle: 0,
      });
    }
  }

  return {
    label: computeTextSlot(labelStart, 'fade', 14, 12),
    title: computeTextSlot(titleStart, textAnim, 20, 28),
    subtitle: computeTextSlot(subtitleStart, textAnim, 18, 22),
    description: computeTextSlot(descStart, textAnim, 18, 20),
    devices: deviceMetrics,
    annotations: annotationMetrics,
  };
}

export interface DeviceShowcaseResolvedLayout {
  containerStyle: React.CSSProperties;
  textColStyle: React.CSSProperties;
  deviceColStyle: React.CSSProperties;
  deviceWrapperStyle: (idx: number, total: number, device: DeviceItemConfig) => React.CSSProperties;
}

/**
 * Resolves CSS layout styles for the 7 DeviceShowcaseScene layouts.
 */
export function resolveDeviceShowcaseLayout(
  layout: DeviceShowcaseLayout = 'single-centered',
): DeviceShowcaseResolvedLayout {
  switch (layout) {
    case 'device-left':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          gap: 60,
        },
        deviceColStyle: {
          flex: 1.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        },
        textColStyle: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          gap: 16,
        },
        deviceWrapperStyle: () => ({ position: 'relative' }),
      };

    case 'text-left':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          gap: 60,
        },
        textColStyle: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          gap: 16,
        },
        deviceColStyle: {
          flex: 1.2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        },
        deviceWrapperStyle: () => ({ position: 'relative' }),
      };

    case 'multiple-devices':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 36,
        },
        textColStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 12,
          maxWidth: 900,
        },
        deviceColStyle: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 40,
          width: '100%',
          position: 'relative',
        },
        deviceWrapperStyle: () => ({ position: 'relative' }),
      };

    case 'device-overlap':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 28,
        },
        textColStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 10,
          maxWidth: 800,
          zIndex: 10,
        },
        deviceColStyle: {
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: 520,
        },
        deviceWrapperStyle: (idx: number, total: number, device: DeviceItemConfig) => {
          if (device.x !== undefined || device.y !== undefined) {
            return {
              position: 'absolute',
              left: typeof device.x === 'number' ? `${device.x}px` : (device.x ?? 'auto'),
              top: typeof device.y === 'number' ? `${device.y}px` : (device.y ?? 'auto'),
              zIndex: device.zIndex ?? (idx + 1),
            };
          }
          // Default staggered 2.5D overlap: first device in back-center, second device in front-right
          if (idx === 0) {
            return { position: 'relative', zIndex: 1 };
          }
          return {
            position: 'absolute',
            right: '18%',
            bottom: '4%',
            zIndex: 5,
            filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.65))',
          };
        },
      };

    case 'device-stack':
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 48,
        },
        textColStyle: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'left',
          gap: 16,
        },
        deviceColStyle: {
          flex: 1.3,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 540,
        },
        deviceWrapperStyle: (idx: number, total: number, device: DeviceItemConfig) => ({
          position: 'absolute',
          left: `${15 + idx * 24}%`,
          top: `${10 + idx * 16}%`,
          zIndex: device.zIndex ?? (total - idx),
        }),
      };

    case 'custom':
      return {
        containerStyle: { display: 'flex', width: '100%', height: '100%' },
        textColStyle: {},
        deviceColStyle: { position: 'relative' },
        deviceWrapperStyle: () => ({ position: 'relative' }),
      };

    case 'single-centered':
    default:
      return {
        containerStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          gap: 32,
        },
        textColStyle: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 12,
          maxWidth: 900,
        },
        deviceColStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        },
        deviceWrapperStyle: () => ({ position: 'relative' }),
      };
  }
}

/**
 * Resolves coordinate positioning for device callout annotations.
 */
export function resolveDeviceAnnotationPosition(
  annotation: DeviceAnnotationItem,
): React.CSSProperties {
  const { x, y, position = 'top' } = annotation;

  if (x !== undefined || y !== undefined) {
    return {
      position: 'absolute',
      left: typeof x === 'number' ? `${x}%` : (x ?? '50%'),
      top: typeof y === 'number' ? `${y}%` : (y ?? '50%'),
      transform: 'translate(-50%, -50%)',
      zIndex: 20,
    };
  }

  switch (position) {
    case 'top':
      return { position: 'absolute', top: '4%', left: '50%', transform: 'translateX(-50%)', zIndex: 20 };
    case 'bottom':
      return { position: 'absolute', bottom: '4%', left: '50%', transform: 'translateX(-50%)', zIndex: 20 };
    case 'left':
      return { position: 'absolute', left: '2%', top: '50%', transform: 'translateY(-50%)', zIndex: 20 };
    case 'right':
      return { position: 'absolute', right: '2%', top: '50%', transform: 'translateY(-50%)', zIndex: 20 };
    default:
      return { position: 'absolute', top: '10%', right: '10%', zIndex: 20 };
  }
}
