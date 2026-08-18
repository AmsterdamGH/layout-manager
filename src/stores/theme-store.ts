import { makeAutoObservable } from 'mobx';

const THEME_STORAGE_KEY = 'theme-preference';
const LIGHT = 'light' as const;
const DARK = 'dark' as const;

export type Theme = typeof LIGHT | typeof DARK;

class ThemeStore {
  theme: Theme = LIGHT;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    this.loadTheme();
  }

  private loadTheme(): void {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === LIGHT || stored === DARK) {
        this.theme = stored;
        this.applyTheme();
      }
    } catch (err) {
      console.error('Failed to load theme:', err);
    }
  }

  private applyTheme(): void {
    document.documentElement.classList.remove(LIGHT, DARK);
    document.documentElement.classList.add(this.theme);
    // Toggle 'dark' class for Tailwind dark: variant
    if (this.theme === DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  setTheme(theme: Theme): void {
    try {
      this.theme = theme;
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      this.applyTheme();
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  }

  toggleTheme(): void {
    this.setTheme(this.theme === LIGHT ? DARK : LIGHT);
  }
}

export const themeStore = new ThemeStore();
