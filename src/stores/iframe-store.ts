import { makeAutoObservable } from 'mobx';
import type { Iframe } from '@/types/iframe';

class IframeStore {
  iframes: Map<string, Iframe> = new Map();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  addIframe = (iframe: Iframe): void => {
    this.iframes.set(iframe.id, iframe);
  };

  updateIframe = (id: string, updates: Partial<Iframe>): void => {
    const iframe = this.iframes.get(id);
    if (iframe) {
      Object.assign(iframe, updates);
    }
  };

  removeIframe = (id: string): void => {
    this.iframes.delete(id);
  };

  toggleVisibility = (id: string): void => {
    const iframe = this.iframes.get(id);
    if (iframe) {
      iframe.isVisible = !iframe.isVisible;
    }
  };

  getIframe = (id: string): Iframe | undefined => {
    return this.iframes.get(id);
  };

  getAllIframes = (): Iframe[] => {
    return Array.from(this.iframes.values());
  };
}

export const iframeStore = new IframeStore();
