/**
 * Centralized Design Tokens Index
 * Single point of access for all visual and motion parameters across the framework.
 */

import { Colors } from '../colors';
import { Typography } from '../typography';
import { Spacing } from '../spacing';
import { Motion, MOTION } from '../motion';

export { Colors, Typography, Spacing, Motion, MOTION };

export const Tokens = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  motion: Motion,
  MOTION,
} as const;

export type DesignTokens = typeof Tokens;
