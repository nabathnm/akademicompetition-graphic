/**
 * CategorySection Component
 * Groups component showcases by category in the playground.
 */

import React from 'react';
import { Colors } from '../../styles/colors';
import { Typography } from '../../styles/typography';
import { Spacing } from '../../styles/spacing';
import { ComponentCategory } from '../../components/types';

export interface CategorySectionProps {
  category: ComponentCategory;
  title: string;
  description: string;
  count: number;
  children: React.ReactNode;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  title,
  description,
  count,
  children,
}) => {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.scale.md,
      }}
    >
      {/* Category Section Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingBottom: Spacing.scale.xs,
          borderBottom: `1px solid ${Colors.border.subtle}`,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.scale.xs }}>
            <span
              style={{
                fontFamily: Typography.fontFamily.mono,
                fontSize: 11,
                color: Colors.accent.brand,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {category}
            </span>
            <span
              style={{
                fontSize: 11,
                padding: '1px 6px',
                borderRadius: Spacing.radius.full,
                backgroundColor: Colors.dark.surface2,
                color: Colors.text.tertiary,
              }}
            >
              {count} components
            </span>
          </div>
          <h2
            style={{
              ...Typography.headline.h4,
              color: Colors.text.primary,
              marginTop: 2,
            }}
          >
            {title}
          </h2>
        </div>

        <p
          style={{
            ...Typography.body.small,
            color: Colors.text.secondary,
            maxWidth: 500,
            textAlign: 'right',
          }}
        >
          {description}
        </p>
      </div>

      {/* Grid of Showcase Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: Spacing.scale.md,
        }}
      >
        {children}
      </div>
    </section>
  );
};
