import type { Iframe } from './iframe';

export type LayoutMode = 'grid' | 'split-horizontal' | 'split-vertical';

export interface Layout {
  mode: LayoutMode;
  iframes: Iframe[];
  order: string[]; // iframe IDs in order
  panelSizes: Record<string, { width: number; height: number }>;
}

export interface PanelSize {
  width: number;
  height: number;
}
