/**
 * PlaceholderShowcase Component
 * Visual blueprint rendering inside the showcase card before actual component implementation.
 */

import React from 'react';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { ShowcaseDefinition } from '../types';

export interface PlaceholderShowcaseProps {
  definition: ShowcaseDefinition;
}

export const PlaceholderShowcase: React.FC<PlaceholderShowcaseProps> = ({
  definition,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        gap: Spacing.scale.xs,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: Spacing.radius.md,
          backgroundColor: Colors.dark.surface2,
          border: `1px dashed ${Colors.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: Colors.accent.brand,
          fontFamily: Typography.fontFamily.mono,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        #
      </div>

      <span
        style={{
          fontFamily: Typography.fontFamily.sans,
          fontSize: 12,
          fontWeight: 600,
          color: Colors.text.primary,
        }}
      >
        {definition.name} Blueprint
      </span>

      <span
        style={{
          fontSize: 10,
          fontFamily: Typography.fontFamily.mono,
          color: Colors.text.tertiary,
          letterSpacing: '0.04em',
        }}
      >
        READY FOR IMPLEMENTATION
      </span>
    </div>
  );
};
