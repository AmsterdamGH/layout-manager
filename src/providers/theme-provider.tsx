import { createContext, useContext, ReactNode } from 'react';
import { observer } from 'mobx-react-lite';
import { themeStore, type Theme } from '@/stores/theme-store';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider = observer(({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={{ theme: themeStore.theme, toggleTheme: () => themeStore.toggleTheme() }}>
      {children}
    </ThemeContext.Provider>
  );
});

export const useTheme = () => useContext(ThemeContext);
