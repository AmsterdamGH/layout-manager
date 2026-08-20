import { makeAutoObservable } from 'mobx';
import type { ModalMode, Preset } from '@/types/layout';
import type { Iframe } from '@/types/iframe';
import { iframeLayoutStore } from './iframe-layout-store';

class ModalStore {
  isEditIframeModalOpen: boolean = false;
  isExportPresetModalOpen: boolean = false;
  isEditPresetModalOpen: boolean = false;
  isImportPresetModalOpen: boolean = false;
  isDeletePresetModalOpen: boolean = false;
  deletePresetId: string | null = null;
  iframeModalMode: ModalMode = 'create';
  presetModalMode: ModalMode = 'create';
  editingIframeId: string | null = null;
  editingPresetId: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // Iframe modal actions
  openEditIframeModal(mode: 'create' | 'edit' = 'create', id?: string): void {
    this.isEditIframeModalOpen = true;
    this.iframeModalMode = mode;
    if (id) {
      this.editingIframeId = id;
    }
  }

  closeEditIframeModal(): void {
    this.iframeModalMode = 'create';
    this.isEditIframeModalOpen = false;
    this.editingIframeId = null;
  }

  // Getters
  get editingIframe(): Iframe | null {
    if (!this.editingIframeId) return null;
    return iframeLayoutStore.getIFrameById(this.editingIframeId) || null;
  }

  // Iframe actions
  updateIframe(url: string, title: string): void {
    if (this.editingIframe) {
      iframeLayoutStore.updateIframe(this.editingIframe.id, { url, title });
    }
  }

  addIframe(url: string, title: string): void {
    iframeLayoutStore.addIframe({
      id: crypto.randomUUID(),
      url,
      title,
      isVisible: true,
      headerVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Preset actions
  updatePreset(name: string, mode: Preset['mode']): void {
    const preset = iframeLayoutStore.presets.get(this.editingPresetId!);
    if (preset) {
      preset.name = name;
      preset.mode = mode;
      iframeLayoutStore.savePresets();
    }
  }

  addPreset(name: string, mode: Preset['mode']): void {
    iframeLayoutStore.createPreset(name, { mode });
  }

  // Preset modal actions
  openEditPresetModal(mode: ModalMode = 'edit', presetId?: string): void {
    this.isEditPresetModalOpen = true;
    this.presetModalMode = mode;
    if (presetId) {
      this.editingPresetId = presetId;
    }
  }

  closeEditPresetModal(): void {
    this.isEditPresetModalOpen = false;
    this.presetModalMode = 'create';
    this.editingPresetId = null;
  }

  // Getters
  get editingPreset(): Preset | null {
    if (!this.editingPresetId) return null;
    return iframeLayoutStore.presets.get(this.editingPresetId) || null;
  }

  openImportPresetModal(): void {
    this.isImportPresetModalOpen = true;
  }

  closeImportPresetModal(): void {
    this.isImportPresetModalOpen = false;
  }

  openExportPresetModal(): void {
    this.isExportPresetModalOpen = true;
  }

  closeExportPresetModal(): void {
    this.isExportPresetModalOpen = false;
  }

  // Delete preset modal actions
  openDeletePresetModal(presetId: string): void {
    this.isDeletePresetModalOpen = true;
    this.deletePresetId = presetId;
  }

  closeDeletePresetModal(): void {
    this.isDeletePresetModalOpen = false;
    this.deletePresetId = null;
  }

  // Close all modals
  closeAllModals(): void {
    this.closeEditPresetModal();
    this.closeExportPresetModal();
    this.closeImportPresetModal();
    this.closeEditIframeModal();
    this.closeDeletePresetModal();
    this.iframeModalMode = 'create';
    this.presetModalMode = 'create';
  }

  // Computed properties
  get isAnyModalOpen(): boolean {
    return this.isEditIframeModalOpen || this.isExportPresetModalOpen || this.isEditPresetModalOpen || this.isImportPresetModalOpen || this.isDeletePresetModalOpen;
  }

  get editIframeModalOpen(): boolean {
    return this.isEditIframeModalOpen;
  }

  get exportPresetModalOpen(): boolean {
    return this.isExportPresetModalOpen;
  }

  get importPresetModalOpen(): boolean {
    return this.isImportPresetModalOpen;
  }

  get deletePresetModalOpen(): boolean {
    return this.isDeletePresetModalOpen;
  }

  get currentModalMode(): ModalMode {
    return this.iframeModalMode;
  }
}

export const modalStore = new ModalStore();
