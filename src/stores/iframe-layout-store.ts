import { makeAutoObservable } from 'mobx';
import type { Layout, Preset, AppMode } from '@/types/layout';
import type { Iframe } from '@/types/iframe';
import { loadFromStorage, saveToStorage, clearStorage } from '@/utils/storage';
import { getHashPreset, setHashPreset, removeHashPreset } from '@/utils/hash';
import { modalStore } from './modal-store';

class IframeLayoutStore {
  preset: Preset = {
    id: 'default',
    name: 'Default',
    mode: 'layout-grid',
    iframes: [],
    order: [],
  };
  layout: Layout = {
    appMode: 'view',
    preset: this.preset,
    presetId: null,
  };
  presets: Map<string, Preset> = new Map();
  isLoading: boolean = false;
  error: string | null = null;

  isSidePanelOpen: boolean = false;
  draggedIframeId: string | null = null;
  dragOverIframeId: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.loadPresets();
    this.initializeFromHash();
    window.addEventListener('hashchange', this.handleHashChange);
  }

  dispose(): void {
    window.removeEventListener('hashchange', this.handleHashChange);
  }

  private loadPresets(): void {
    try {
      const stored = localStorage.getItem('presets');
      if (stored) {
        const presets = JSON.parse(stored) as Preset[];
        presets.forEach((p) => this.presets.set(p.id, p));
      }
    } catch (err) {
      console.error('Failed to load presets:', err);
    }
  }

  private deduplicatePresetName(name: string): string {
    const existing = Array.from(this.presets.values()).find((p) => p.name === name);
    if (existing) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      return `${name}-${timestamp}`;
    }
    return name;
  }

  savePresets = (): void => {
    try {
      const presets = Array.from(this.presets.values());
      localStorage.setItem('presets', JSON.stringify(presets));
    } catch (err) {
      console.error('Failed to save presets:', err);
    }
  };

  private initializeFromHash(): void {
    const presetName = getHashPreset();
    if (presetName) {
      const preset = Array.from(this.presets.values()).find(
        (p) => p.name.toLowerCase() === presetName.toLowerCase()
      );
      if (preset) {
        this.applyPreset(preset);
        return;
      }
      // If preset doesn't exist, clear hash
      removeHashPreset();
    } else if (this.layout.presetId) {
      // No hash set but preset exists, set hash
      setHashPreset(this.preset.name);
    } else if (this.presets.size === 0) {
      // First load, create default preset
      this.createDefaultPreset();
    }
  }

  private createDefaultPreset(): void {
    const id = 'preset-default';
    const preset: Preset = {
      id,
      name: 'Default',
      mode: 'layout-grid',
      iframes: [],
      order: [],
    };
    this.presets.set(id, preset);
    this.preset = preset;
    this.layout.presetId = id;
    this.savePresets();
    setHashPreset(preset.name);
  }

  private handleHashChange = (): void => {
    const presetName = getHashPreset();
    if (presetName) {
      const preset = Array.from(this.presets.values()).find(
        (p) => p.name.toLowerCase() === presetName.toLowerCase()
      );
      if (preset) {
        this.applyPreset(preset);
        return;
      }
      removeHashPreset();
    }
  };

  private applyPreset(preset: Preset): void {
    this.preset = preset;
    this.layout.preset = preset;
    this.layout.presetId = preset.id;
    this.saveToStorage();
  }

  private syncPreset(): void {
    if (!this.layout.presetId) return;
    const preset = this.presets.get(this.layout.presetId);
    if (preset) {
      preset.mode = this.layout.preset.mode;
      preset.iframes = [...this.layout.preset.iframes];
      preset.order = [...this.layout.preset.order];
      this.savePresets();
    }
  }

  addIframe = (iframe: Iframe): void => {
    this.layout.preset.iframes.push(iframe);
    this.layout.preset.order.push(iframe.id);
    this.syncPreset();
    this.saveToStorage();
  };

  removeIframe = (id: string): void => {
    this.layout.preset.iframes = this.layout.preset.iframes.filter((i) => i.id !== id);
    this.layout.preset.order = this.layout.preset.order.filter((oid) => oid !== id);
    this.syncPreset();
    this.saveToStorage();
  };

  updateIframe = (id: string, updates: Partial<Iframe>): void => {
    const iframe = this.layout.preset.iframes.find((i) => i.id === id);
    if (iframe) {
      Object.assign(iframe, updates, { updatedAt: new Date().toISOString() });
      this.syncPreset();
      this.saveToStorage();
    }
  };

  toggleVisibility = (id: string): void => {
    const iframe = this.layout.preset.iframes.find((i) => i.id === id);
    if (iframe) {
      iframe.isVisible = !iframe.isVisible;
      this.syncPreset();
      this.saveToStorage();
    }
  };

  toggleHeaderVisibility = (id: string): void => {
    const iframe = this.layout.preset.iframes.find((i) => i.id === id);
    if (iframe) {
      iframe.headerVisible = !iframe.headerVisible;
      this.syncPreset();
      this.saveToStorage();
    }
  };

  switchLayout = (mode: Preset['mode']): void => {
    this.layout.preset.mode = mode;
    this.preset.mode = mode;
    this.syncPreset();
    this.saveToStorage();
    this.savePresets();
  };

  createPreset = (name: string, initialPreset?: Partial<Preset>): string => {
    const finalName = this.deduplicatePresetName(name);

    const id = `preset-${Date.now()}`;
    const preset: Preset = {
      id,
      name: finalName,
      mode: initialPreset?.mode ?? this.layout.preset.mode,
      iframes: initialPreset?.iframes ?? [...this.layout.preset.iframes],
      order: initialPreset?.order ?? [...this.layout.preset.order],
    };
    this.presets.set(id, preset);
    this.preset = preset;
    this.layout.preset = preset;
    this.layout.presetId = id;
    this.savePresets();
    setHashPreset(preset.name);
    return id;
  };

  switchPreset = (presetId: string): void => {
    const preset = this.presets.get(presetId);
    if (preset) {
      this.applyPreset(preset);
      setHashPreset(preset.name);
    }
  };

  deletePreset = (presetId: string): void => {
    const wasCurrent = this.layout.presetId === presetId;
    this.presets.delete(presetId);
    this.savePresets();
    if (wasCurrent) {
      removeHashPreset();
      this.layout.presetId = null;
      // Select first preset if available
      const firstPreset = Array.from(this.presets.values())[0];
      if (firstPreset) {
        this.applyPreset(firstPreset);
        setHashPreset(firstPreset.name);
      }
    }
  };

  clonePreset = (sourceId: string, newName: string): string => {
    const source = this.presets.get(sourceId);
    if (!source) throw new Error('Preset not found');

    return this.createPreset(newName, {
      mode: source.mode,
      iframes: [...source.iframes],
      order: [...source.order],
    });
  };

  editPresetName = (presetId: string, newName: string): void => {
    const preset = this.presets.get(presetId);
    if (!preset) throw new Error('Preset not found');

    const existing = Array.from(this.presets.values()).find(
      (p) => p.name.toLowerCase() === newName.toLowerCase() && p.id !== presetId
    );
    if (existing) {
      throw new Error(`Preset "${newName}" already exists`);
    }

    preset.name = newName;
    this.savePresets();
  };

  toggleAppMode = (): void => {
    this.layout.appMode = this.layout.appMode === 'edit' ? 'view' : 'edit';
    this.saveToStorage();
  };

  toggleSidePanel = (): void => {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  };

  openSidePanel = (): void => {
    this.isSidePanelOpen = true;
  };

  closeSidePanel = (): void => {
    this.isSidePanelOpen = false;
  };

  // Iframe modal actions


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

    const order = [...this.layout.preset.order];
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

    this.layout.preset.order = order;
    this.draggedIframeId = null;
    this.dragOverIframeId = null;
    this.syncPreset();
    this.saveToStorage();
  };

  endDrag = (): void => {
    this.draggedIframeId = null;
    this.dragOverIframeId = null;
  };

  reorderIframes = (order: string[]): void => {
    this.layout.preset.order = order;
    this.syncPreset();
    this.saveToStorage();
  };

  loadFromStorage = (): void => {
    this.isLoading = true;
    this.error = null;
    try {
      const data = loadFromStorage();
      if (data) {
        this.layout.appMode = data.appMode;
        this.layout.preset = this.preset;
        this.layout.presetId = data.presetId;
        // Migrate existing iframes to have headerVisible property
        this.layout.preset.iframes.forEach((iframe) => {
          if (typeof iframe.headerVisible !== 'boolean') {
            iframe.headerVisible = true;
          }
        });
        this.syncPreset();
        // Ensure hash reflects current preset after loading
        if (this.layout.presetId && !getHashPreset()) {
          setHashPreset(this.preset.name);
        }
      }
    } catch (err) {
      this.error = 'Failed to load layout from storage';
      console.error(err);
    } finally {
      this.isLoading = false;
    }
  };

  saveToStorage = (): void => {
    saveToStorage(this.layout);
  };

  exportPreset = (): string => {
    const presetData = {
      name: this.preset.name,
      mode: this.preset.mode,
      iframes: this.preset.iframes,
      order: this.preset.order,
    };
    return JSON.stringify(presetData, null, 2);
  };

  downloadPreset = (): void => {
    const presetData = {
      name: this.preset.name,
      mode: this.preset.mode,
      iframes: this.preset.iframes,
      order: this.preset.order,
    };
    const blob = new Blob([JSON.stringify(presetData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.preset.name.replace(/\s+/g, '-').toLowerCase()}-preset.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  clearStorage = (): void => {
    clearStorage();
    this.preset = {
      id: 'default',
      name: 'Default',
      mode: 'layout-grid',
      iframes: [],
      order: [],
    };
    this.layout = {
      appMode: 'view',
      preset: this.preset,
      presetId: null,
    };
    removeHashPreset();
  };

  get visibleIframes(): Iframe[] {
    return this.layout.preset.iframes.filter((iframe) => iframe.isVisible);
  }

  get orderedIframes(): Iframe[] {
    return this.layout.preset.order
      .map((id) => this.layout.preset.iframes.find((i) => i.id === id))
      .filter((iframe): iframe is Iframe => iframe !== undefined);
  }

  getIFrameById(id: string): Iframe | undefined {
    return this.layout.preset.iframes.find((i) => i.id === id);
  }

  get currentMode(): Preset['mode'] {
    return this.layout.preset.mode;
  }

  get appMode(): AppMode {
    return this.layout.appMode;
  }

  get sidePanelOpen(): boolean {
    return this.isSidePanelOpen;
  }

  get currentPresetId(): string | null {
    return this.layout.presetId;
  }

  get currentPresetName(): string {
    return this.preset.name;
  }

  get presetList(): Preset[] {
    return Array.from(this.presets.values());
  }

  get addIframeModalOpen(): boolean {
    return modalStore.editIframeModalOpen;
  }

  get isAnyModalOpen(): boolean {
    return modalStore.isAnyModalOpen;
  }

  get exportedJson(): string {
    return this.exportPreset();
  }
}

export const iframeLayoutStore = new IframeLayoutStore();
