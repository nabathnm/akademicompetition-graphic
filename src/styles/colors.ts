/**
 * Color Tokens
 * Inspired by modern premium mobility and technology design systems (e.g. Uber).
 * Built with high-contrast monochrome foundations and surgical accent highlights.
 */

export const Colors = {
  // Base Palette
  black: '#000000',
  white: '#FFFFFF',

  // Dark Neutrals (Foundational Canvas)
  dark: {
    bgPrimary: '#000000',
    bgSecondary: '#0D0D0E',
    bgTertiary: '#161618',
    surface1: '#1A1A1D',
    surface2: '#242428',
    surface3: '#2E2E33',
    surfaceElevated: '#333338',
  },

  // Light Neutrals
  light: {
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F7F7F8',
    bgTertiary: '#EFEFF1',
    surface1: '#E5E5E8',
    surface2: '#D8D8DC',
    surface3: '#CBCBCE',
    surfaceElevated: '#FFFFFF',
  },

  // Text Contrast Tokens
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    tertiary: '#71717A',
    muted: '#52525B',
    inverse: '#000000',
    inverseSecondary: '#52525B',
  },

  // Brand & Semantic Accents
  accent: {
    brand: '#276EF1',         // Uber Blue
    brandLight: '#4B88F5',
    brandDark: '#1E56BE',
    electricViolet: '#7B2CBF', // Modern Mobility Accent
    emerald: '#0E8345',        // Success / Positive
    amber: '#FFC043',          // Warning / Attention
    crimson: '#E11900',        // Error / Urgent
    cyan: '#00D1FF',           // Highlight / Electric
  },

  // Border & Divider Tokens
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    default: 'rgba(255, 255, 255, 0.14)',
    strong: 'rgba(255, 255, 255, 0.25)',
    accent: '#276EF1',
  },

  // Overlay & Glassmorphism Tokens
  overlay: {
    scrim: 'rgba(0, 0, 0, 0.65)',
    glass: 'rgba(255, 255, 255, 0.04)',
    glassBorder: 'rgba(255, 255, 255, 0.10)',
    spotlight: 'radial-gradient(circle at 50% 0%, rgba(39, 110, 241, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
  },
} as const;

export type ColorTheme = typeof Colors;
