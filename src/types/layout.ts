import type { Iframe } from './iframe';

export type LayoutMode = 'layout-grid' | 'layout-horizontal' | 'layout-vertical';
export type AppMode = 'edit' | 'view';
export type ModalMode = 'create' | 'edit' | 'clone';

export interface Preset {
  id: string;
  name: string;
  mode: LayoutMode;
  iframes: Iframe[];
  order: string[];
}

export interface Layout {
  appMode: AppMode;
  preset: Preset;
  presetId: string | null;
}
