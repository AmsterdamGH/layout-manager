import type { Iframe } from '@/types/iframe'
import type { Preset } from '@/types/layout'
import { PRESETS_KEY } from '@/utils/constants'
import {
  get,
  remove,
  set,
} from '@/utils/storage'
import { makeAutoObservable } from 'mobx'

class PresetStore {
  presets: Map<string, Preset> = new Map();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.loadPresets();
  }

  dispose(): void {
    // Nothing to clean up
  }

  private loadPresets(): void {
    try {
      const presets = get<Preset[]>(PRESETS_KEY);
      if (presets) {
        presets.forEach((p) => this.presets.set(p.id, p));
      }
    } catch (err) {
      console.error('Failed to load presets:', err);
    }
  }

  savePresets = (): void => {
    try {
      set(PRESETS_KEY, Array.from(this.presets.values()));
    } catch (err) {
      console.error('Failed to save presets:', err);
    }
  };

  private deduplicatePresetName(name: string): string {
    const existing = Array.from(this.presets.values()).find((p: Preset) => p.name === name);
    if (existing) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      return `${name}-${timestamp}`;
    }
    return name;
  }

  clearPresets = (): void => {
    try {
      remove(PRESETS_KEY);
      this.presets.clear();
    } catch (err) {
      console.error('Failed to clear presets:', err);
    }
  };

  createDefaultPreset = (): Preset => {
    return this.createPreset('Default', { mode: 'layout-grid' });
  };

  createPreset = (name: string, initialPreset?: Partial<Preset>): Preset => {
    const finalName = this.deduplicatePresetName(name);

    const id = `preset-${Date.now()}`;
    const preset: Preset = {
      id,
      name: finalName,
      mode: initialPreset?.mode ?? 'layout-grid',
      iframes: initialPreset?.iframes ?? {},
      order: initialPreset?.order ?? [],
    };
    this.presets.set(id, preset);
    this.savePresets();
    return preset;
  };

  // Note: switchPreset is intentionally NOT in this store.
  // It belongs in the layout store because it updates layout state.

  deletePreset = (presetId: string): void => {
    this.presets.delete(presetId);
    this.savePresets();
  };

  clonePreset = (sourceId: string, newName: string): Preset => {
    const source = this.presets.get(sourceId);
    if (!source) throw new Error('Preset not found');

    return this.createPreset(newName, {
      mode: source.mode,
      iframes: { ...source.iframes },
      order: [...source.order],
    });
  };

  getIframeByPresetId = (presetId: string, iframeId: string): Iframe | undefined => {
    const preset = this.presets.get(presetId);
    if (!preset) return undefined;
    return preset.iframes[iframeId];
  };

  editPresetName = (presetId: string, newName: string): void => {
    const preset = this.presets.get(presetId);
    if (!preset) throw new Error('Preset not found');

    const existing = Array.from(this.presets.values()).find(
      (p: Preset) => p.name.toLowerCase() === newName.toLowerCase() && p.id !== presetId
    );
    if (existing) {
      throw new Error(`Preset "${newName}" already exists`);
    }

    preset.name = newName;
    this.savePresets();
  };

  updateIframe = (presetId: string, iframeId: string, updates: Partial<Iframe>): void => {
    const preset = this.presets.get(presetId);
    if (!preset) throw new Error('Preset not found');
    const iframe = preset.iframes[iframeId];
    if (!iframe) throw new Error('Iframe not found');
    Object.assign(iframe, updates, { updatedAt: new Date().toISOString() });
    this.savePresets();
  };

  removeIframe = (presetId: string, iframeId: string): void => {
    const preset = this.presets.get(presetId);
    if (!preset) throw new Error('Preset not found');
    delete preset.iframes[iframeId];
    preset.order = preset.order.filter((id: string) => id !== iframeId);
    this.savePresets();
  };

  toggleIframeVisibility = (presetId: string, iframeId: string): void => {
    const preset = this.presets.get(presetId);
    if (!preset) throw new Error('Preset not found');
    const iframe = preset.iframes[iframeId];
    if (!iframe) throw new Error('Iframe not found');
    iframe.isVisible = !iframe.isVisible;
    this.savePresets();
  };

  toggleIframeHeaderVisibility = (presetId: string, iframeId: string): void => {
    const preset = this.presets.get(presetId);
    if (!preset) throw new Error('Preset not found');
    const iframe = preset.iframes[iframeId];
    if (!iframe) throw new Error('Iframe not found');
    iframe.headerVisible = !iframe.headerVisible;
    this.savePresets();
  };

  addIframe = (presetId: string, iframe: Iframe): void => {
    const preset = this.presets.get(presetId);
    if (!preset) throw new Error('Preset not found');
    preset.iframes[iframe.id] = iframe;
    preset.order.push(iframe.id);
    this.savePresets();
  };

  getPresetById = (id: string): Preset | undefined => {
    return this.presets.get(id);
  };

  getPresetByName = (name: string): Preset | undefined => {
    return Array.from(this.presets.values()).find(
      (p: Preset) => p.name.toLowerCase() === name.toLowerCase()
    );
  };

  getPresetList = (): Preset[] => {
    return Array.from(this.presets.values());
  };
}

export const presetStore = new PresetStore();
