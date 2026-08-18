import type { Iframe } from './iframe';

export type LayoutMode = 'grid' | 'split-horizontal' | 'split-vertical';
export type AppMode = 'edit' | 'view';

export interface Layout {
  mode: LayoutMode;
  appMode: AppMode;
  iframes: Iframe[];
  order: string[]; // iframe IDs in order
  panelSizes: Record<string, { width: number; height: number }>;
}

export interface PanelSize {
  width: number;
  height: number;
}
