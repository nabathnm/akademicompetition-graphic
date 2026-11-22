/**
 * SoundEffectGroup Component
 * Container for organizing and triggering multiple SoundEffect instances across a timeline.
 *
 * Layer 2 / Layer 3 of the Motion Graphics Framework.
 */

import React from 'react';
import { SoundEffect } from './SoundEffect.tsx';
import type { SoundEffectGroupProps } from './soundEffectTypes.ts';

export const SoundEffectGroup: React.FC<SoundEffectGroupProps> = ({
  effects = [],
  masterVolume = 1.0,
  muted = false,
  disabled = false,
  debug = false,
  children,
}) => {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <>
      {effects.map((effect, index) => {
        const key = effect.id ?? `sfx-group-${index}-${effect.preset ?? 'custom'}-${effect.triggerFrame ?? effect.startFrame ?? 0}`;
        return (
          <SoundEffect
            key={key}
            {...effect}
            masterVolume={(effect.masterVolume ?? 1.0) * masterVolume}
            muted={muted || effect.muted}
            disabled={disabled || effect.disabled}
            debug={debug || effect.debug}
          />
        );
      })}
      {children}
    </>
  );
};
