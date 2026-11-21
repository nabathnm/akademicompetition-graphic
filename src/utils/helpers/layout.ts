/**
 * Layout and Styling Helpers
 * Standard styles and positioning helpers for canvas rendering.
 */

import React from 'react';

/**
 * Generates an absolute full-cover positioning style.
 */
export const absoluteFillStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
};

/**
 * Generates centered flex alignment styles.
 */
export const centeredFlexStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/**
 * Generates a safe area container style inside a standard 1920x1080 canvas.
 */
export const createSafeAreaStyle = (padding: number = 80): React.CSSProperties => ({
  position: 'absolute',
  top: padding,
  left: padding,
  right: padding,
  bottom: padding,
  display: 'flex',
  flexDirection: 'column',
});
