import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import { ThemeProvider } from './providers/theme-provider';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
