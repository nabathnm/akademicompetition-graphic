/**
 * Scene Layout Types
 */

import React from 'react';

export type SceneLayoutMode = 'centered' | 'split-horizontal' | 'split-vertical' | 'grid-cards';

export interface SplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: '50/50' | '60/40' | '40/60';
  gap?: number;
}

export interface CenteredLayoutProps {
  children: React.ReactNode;
  maxWidth?: number;
}
