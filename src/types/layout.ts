import type { Iframe } from './iframe';

export type LayoutMode = 'layout-grid' | 'layout-horizontal' | 'layout-vertical';
export type AppMode = 'edit' | 'view';
export type PresetModalMode = 'create' | 'edit' | 'clone';

export interface Preset {
  id: string;
  name: string;
  mode: LayoutMode;
  iframes: Iframe[];
  order: string[];
  panelSizes: Record<string, { width: number; height: number }>;
}

export interface Layout {
  appMode: AppMode;
  preset: Preset;
  presetId: string | null;
}

export interface PanelSize {
  width: number;
  height: number;
}
