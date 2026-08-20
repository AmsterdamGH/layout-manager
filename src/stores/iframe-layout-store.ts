import type { Iframe } from '@/types/iframe'
import type {
  AppMode,
  Preset,
} from '@/types/layout'
import {
  getHashPreset,
  removeHashPreset,
  setHashPreset,
} from '@/utils/hash'
import { makeAutoObservable } from 'mobx'
import { presetStore } from './preset-store'

class IframeLayoutStore {
  appMode: AppMode = 'view';
  presetId: string | null = null;

  isSidePanelOpen: boolean = false;
  draggedIframeId: string | null = null;
  dragOverIframeId: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.initializeFromHash();
    window.addEventListener('hashchange', this.handleHashChange);
  }

  dispose(): void {
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  private initializeFromHash(): void {
    const presetName = getHashPreset();
    if (presetName) {
      const preset = presetStore.getPresetByName(presetName);
      if (preset) {
        this.presetId = preset.id;
        return;
      }
      // If preset doesn't exist, clear hash
      removeHashPreset();
    } else if (this.presetId) {
      // No hash set but preset exists, set hash
      const preset = presetStore.getPresetById(this.presetId);
      if (preset) setHashPreset(preset.name);
    } else if (presetStore.getPresetList().length === 0) {
      // First load, create default preset
      const preset = presetStore.createDefaultPreset();
      this.presetId = preset.id;
      setHashPreset(preset.name);
    }
  }

  private handleHashChange = (): void => {
    const presetName = getHashPreset();
    if (presetName) {
      const preset = presetStore.getPresetByName(presetName);
      if (preset) {
        this.presetId = preset.id;
        return;
      }
      removeHashPreset();
    }
  };

  addIframe = (iframe: Iframe): void => {
    const preset = presetStore.getPresetById(this.presetId!);
    if (!preset) return;
    preset.iframes[iframe.id] = iframe;
    preset.order.push(iframe.id);
    presetStore.savePresets();
  };

  removeIframe = (id: string): void => {
    const preset = presetStore.getPresetById(this.presetId!);
    if (!preset) return;
    delete preset.iframes[id];
    preset.order = preset.order.filter((oid) => oid !== id);
    presetStore.savePresets();
  };

  updateIframe = (id: string, updates: Partial<Iframe>): void => {
    const preset = presetStore.getPresetById(this.presetId!);
    if (!preset) return;
    const iframe = preset.iframes[id];
    if (iframe) {
      Object.assign(iframe, updates, { updatedAt: new Date().toISOString() });
      presetStore.savePresets();
    }
  };

  toggleVisibility = (id: string): void => {
    const preset = presetStore.getPresetById(this.presetId!);
    if (!preset) return;
    const iframe = preset.iframes[id];
    if (iframe) {
      iframe.isVisible = !iframe.isVisible;
      presetStore.savePresets();
    }
  };

  toggleHeaderVisibility = (id: string): void => {
    const preset = presetStore.getPresetById(this.presetId!);
    if (!preset) return;
    const iframe = preset.iframes[id];
    if (iframe) {
      iframe.headerVisible = !iframe.headerVisible;
      presetStore.savePresets();
    }
  };

  switchLayout = (mode: Preset['mode']): void => {
    const preset = presetStore.getPresetById(this.presetId!);
    if (!preset) return;
    preset.mode = mode;
    presetStore.savePresets();
  };

  selectPreset = (presetId: string): void => {
    const preset = presetStore.getPresetById(presetId);
    if (preset) {
      this.presetId = preset.id;
      setHashPreset(preset.name);
    }
  };

  get orderedIframes(): Iframe[] {
    if (!this.presetId) return [];
    const preset = presetStore.getPresetById(this.presetId);
    if (!preset) return [];
    return preset.order
      .map((id) => preset.iframes[id])
      .filter((iframe): iframe is Iframe => iframe !== null && iframe !== undefined);
  }

  get currentMode(): Preset['mode'] {
    if (!this.presetId) return 'layout-grid';
    const preset = presetStore.getPresetById(this.presetId);
    return preset?.mode ?? 'layout-grid';
  }

  toggleAppMode = (): void => {
    this.appMode = this.appMode === 'edit' ? 'view' : 'edit';
  };

  openSidePanel = (): void => {
    this.isSidePanelOpen = true;
  };

  closeSidePanel = (): void => {
    this.isSidePanelOpen = false;
  };

  // Drag and drop actions
  startDrag = (id: string): void => {
    this.draggedIframeId = id;
  };

  dragOver = (id: string): void => {
    this.dragOverIframeId = id;
  };

  drop = (targetId: string): void => {
    if (!this.draggedIframeId || this.draggedIframeId === targetId) {
      this.draggedIframeId = null;
      this.dragOverIframeId = null;
      return;
    }

    const preset = this.preset;
    if (!preset) return;

    const order = [...preset.order];
    const draggedIndex = order.indexOf(this.draggedIframeId);
    const targetIndex = order.indexOf(targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      this.draggedIframeId = null;
      this.dragOverIframeId = null;
      return;
    }

    // Remove dragged item from its position
    const [draggedItem] = order.splice(draggedIndex, 1);
    // Insert at target position
    order.splice(targetIndex, 0, draggedItem);

    preset.order = order;
    this.draggedIframeId = null;
    this.dragOverIframeId = null;
    presetStore.savePresets();
  };

  endDrag = (): void => {
    this.draggedIframeId = null;
    this.dragOverIframeId = null;
  };

  getIFrameById(id: string): Iframe | undefined {
    if (!this.presetId) return undefined;
    const preset = presetStore.getPresetById(this.presetId);
    if (!preset) return undefined;
    const iframe = preset.iframes[id];
    return iframe !== null && iframe !== undefined ? iframe : undefined;
  }

  get preset(): Preset | undefined {
    if (!this.presetId) return undefined;
    return presetStore.getPresetById(this.presetId);
  }

  set preset(preset: Preset) {
    if (!preset) {
      removeHashPreset();
      return;
    }
    const existing = presetStore.getPresetById(preset.id);
    if (!existing) {
      removeHashPreset();
      return;
    }
    this.presetId = preset.id;
    setHashPreset(preset.name);
  }

  get sidePanelOpen(): boolean {
    return this.isSidePanelOpen;
  }

  get exportedJson(): string {
    if (!this.presetId) return '';
    const preset = presetStore.getPresetById(this.presetId);
    if (!preset) return '';
    const presetData = {
      name: preset.name,
      mode: preset.mode,
      iframes: preset.iframes,
      order: preset.order,
    };
    return JSON.stringify(presetData, null, 2);
  };

  get currentPresetId(): string | null {
    return this.presetId;
  }
}

export const iframeLayoutStore = new IframeLayoutStore();
