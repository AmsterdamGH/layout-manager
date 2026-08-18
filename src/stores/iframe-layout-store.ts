import { makeAutoObservable } from 'mobx';
import type { Layout, AppMode } from '@/types/layout';
import type { Iframe } from '@/types/iframe';
import { loadFromStorage, saveToStorage, clearStorage } from '@/utils/storage';

class IframeLayoutStore {
  layout: Layout = {
    mode: 'grid',
    appMode: 'edit',
    iframes: [],
    order: [],
    panelSizes: {},
  };
  isLoading: boolean = false;
  error: string | null = null;
  editingIframeId: string | null = null;
  isSidePanelOpen: boolean = false;
  isHoveringLeftEdge: boolean = false;
  hoverTimeout: ReturnType<typeof setTimeout> | null = null;
  draggedIframeId: string | null = null;
  dragOverIframeId: string | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  addIframe = (iframe: Iframe): void => {
    this.layout.iframes.push(iframe);
    this.layout.order.push(iframe.id);
    this.saveToStorage();
  };

  removeIframe = (id: string): void => {
    this.layout.iframes = this.layout.iframes.filter((i) => i.id !== id);
    this.layout.order = this.layout.order.filter((oid) => oid !== id);
    delete this.layout.panelSizes[id];
    this.saveToStorage();
  };

  updateIframe = (id: string, updates: Partial<Iframe>): void => {
    const iframe = this.layout.iframes.find((i) => i.id === id);
    if (iframe) {
      Object.assign(iframe, updates, { updatedAt: new Date().toISOString() });
      this.saveToStorage();
    }
  };

  switchLayout = (mode: Layout['mode']): void => {
    this.layout.mode = mode;
    this.saveToStorage();
  };

  toggleAppMode = (): void => {
    this.layout.appMode = this.layout.appMode === 'edit' ? 'view' : 'edit';
    this.saveToStorage();
  };

  toggleSidePanel = (): void => {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  };

  openSidePanel = (): void => {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
      this.hoverTimeout = null;
    }
    this.isSidePanelOpen = true;
  };

  closeSidePanel = (): void => {
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
    this.hoverTimeout = setTimeout(() => {
      this.isSidePanelOpen = false;
      this.hoverTimeout = null;
    }, 300);
  };

  setHoveringLeftEdge = (isHovering: boolean): void => {
    this.isHoveringLeftEdge = isHovering;
    if (isHovering) {
      this.openSidePanel();
    } else {
      this.closeSidePanel();
    }
  };

  editIframe = (id: string): void => {
    this.editingIframeId = id;
  };

  closeEditModal = (): void => {
    this.editingIframeId = null;
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

    const order = [...this.layout.order];
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

    this.layout.order = order;
    this.draggedIframeId = null;
    this.dragOverIframeId = null;
    this.saveToStorage();
  };

  endDrag = (): void => {
    this.draggedIframeId = null;
    this.dragOverIframeId = null;
  };

  reorderIframes = (order: string[]): void => {
    this.layout.order = order;
    this.saveToStorage();
  };

  loadFromStorage = (): void => {
    this.isLoading = true;
    this.error = null;
    try {
      const data = loadFromStorage();
      if (data) {
        this.layout = data;
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

  clearStorage = (): void => {
    clearStorage();
    this.layout = {
      mode: 'grid',
      appMode: 'edit',
      iframes: [],
      order: [],
      panelSizes: {},
    };
  };

  get visibleIframes(): Iframe[] {
    return this.layout.iframes.filter((iframe) => iframe.isVisible);
  }

  get orderedIframes(): Iframe[] {
    return this.layout.order
      .map((id) => this.layout.iframes.find((i) => i.id === id))
      .filter((iframe): iframe is Iframe => iframe !== undefined && iframe.isVisible);
  }

  get currentMode(): Layout['mode'] {
    return this.layout.mode;
  }

  get appMode(): AppMode {
    return this.layout.appMode;
  }

  get sidePanelOpen(): boolean {
    return this.isSidePanelOpen;
  }
}

export const iframeLayoutStore = new IframeLayoutStore();
