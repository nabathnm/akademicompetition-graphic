/**
 * Typography Tokens
 * Clean, geometric, hierarchical typography system designed for 1080p and 4K motion graphics.
 */

export const Typography = {
  // Font Family Stacks
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace',
  },

  // Font Weights
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  // Display Typography (Hero moments, punchy titles)
  display: {
    hero: {
      fontSize: 96,
      lineHeight: 1.05,
      letterSpacing: '-0.04em',
      fontWeight: 800,
    },
    display1: {
      fontSize: 72,
      lineHeight: 1.1,
      letterSpacing: '-0.035em',
      fontWeight: 800,
    },
    display2: {
      fontSize: 56,
      lineHeight: 1.15,
      letterSpacing: '-0.03em',
      fontWeight: 700,
    },
  },

  // Headline Typography (Section headers, prominent statements)
  headline: {
    h1: {
      fontSize: 44,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      fontWeight: 700,
    },
    h2: {
      fontSize: 36,
      lineHeight: 1.25,
      letterSpacing: '-0.02em',
      fontWeight: 600,
    },
    h3: {
      fontSize: 28,
      lineHeight: 1.3,
      letterSpacing: '-0.015em',
      fontWeight: 600,
    },
    h4: {
      fontSize: 22,
      lineHeight: 1.35,
      letterSpacing: '-0.01em',
      fontWeight: 600,
    },
  },

  // Body Typography (Descriptions, UI labels, data points)
  body: {
    large: {
      fontSize: 20,
      lineHeight: 1.45,
      letterSpacing: '-0.01em',
      fontWeight: 400,
    },
    medium: {
      fontSize: 16,
      lineHeight: 1.5,
      letterSpacing: '0em',
      fontWeight: 400,
    },
    small: {
      fontSize: 14,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
      fontWeight: 400,
    },
  },

  // Caption & Eyebrow Typography (Tags, categories, timestamps)
  caption: {
    caption: {
      fontSize: 12,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
      fontWeight: 500,
    },
    eyebrow: {
      fontSize: 11,
      lineHeight: 1.2,
      letterSpacing: '0.12em',
      fontWeight: 700,
      textTransform: 'uppercase' as const,
    },
    micro: {
      fontSize: 10,
      lineHeight: 1.3,
      letterSpacing: '0.04em',
      fontWeight: 500,
    },
  },
} as const;

export type TypographySystem = typeof Typography;
