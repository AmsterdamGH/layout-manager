# AGENTS.md

## Project Overview

A React application for managing a dynamic layout of iframes with multiple layout modes, drag-and-drop reordering, and persistent state storage.

## Tech Stack

- **Framework:** React 18+
- **Language:** TypeScript
- **State Management:** MobX
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Persistence:** localStorage
- **Build Tool:** Vite

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **File & Folder Names** | lowercase dash-separated | `add-iframe-button.tsx`, `layout-switcher.tsx` |
| **Function Names** | lower camelCase | `addIframe()`, `removeIframe()` |
| **Class Names** | PascalCase | `IframeLayoutStore`, `Panel` |
| **Interfaces/Types** | PascalCase | `Iframe`, `Layout` |
| **Variables** | lower camelCase | `iframeList`, `isLoading` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_IFRAMES`, `STORAGE_KEY` |
| **Props** | lower camelCase | `iframeUrl`, `panelSize` |
| **State Variables** | lower camelCase | `isOpen`, `selectedIframe` |
| **Hooks** | use + PascalCase prefix | `useLocalStorage`, `useDebounce` |
| **CSS Classes** | kebab-case | `iframe-panel`, `toolbar-item` |

## Architecture

### State Management (MobX)

```
┌─────────────────────────────────────┐
│           Store (MobX)              │
├─────────────────────────────────────┤
│  - iframe-layout-store              │
│  - iframe-store                     │
└─────────────────────────────────────┘
              ↓
    ┌─────────────────────┐
    │  localStorage       │
    └─────────────────────┘
```

### Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── layout-switcher.tsx
│   │   ├── grid-layout.tsx
│   │   ├── split-layout.tsx
│   │   └── panel.tsx
│   ├── toolbar/
│   │   ├── toolbar.tsx
│   │   ├── add-iframe-button.tsx
│   │   └── layout-switcher.tsx
│   ├── modals/
│   │   ├── add-iframe-modal.tsx
│   │   └── edit-iframe-modal.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── loading.tsx
├── stores/
│   ├── iframe-layout-store.ts
│   ├── iframe-store.ts
│   └── index.ts
├── hooks/
│   ├── use-local-storage.ts
│   ├── use-debounce.ts
│   └── use-iframe.ts
├── types/
│   ├── iframe.ts
│   └── layout.ts
├── utils/
│   ├── storage.ts
│   ├── validation.ts
│   └── constants.ts
├── app.tsx
└── main.tsx
```

## Key Features

### 1. Iframe Management
- Add iframes with URL and optional title
- Edit iframe URLs and titles
- Remove iframes
- Toggle iframe visibility
- Load iframe with loading/error states

### 2. Layout Modes
- **Grid:** Equal-sized panels in a grid
- **Split Horizontal:** Two panels side-by-side
- **Split Vertical:** Two panels stacked

### 3. Drag and Drop Reordering
- Drag panels using the grip handle (⋮⋮)
- Visual feedback during drag operations
- Drop zones highlighted with blue ring
- Order persisted to localStorage

### 4. Persistence
- Auto-save to localStorage on changes
- Load saved layout on initialization
- Debounced saves (500ms)
- Error handling for localStorage

## Data Models

### Iframe
```typescript
interface Iframe {
  id: string;
  url: string;
  title: string;
  isVisible: boolean;
  width: number;
  height: number;
  position: { x: number; y: number };
  createdAt: string;
  updatedAt: string;
}
```

### Layout
```typescript
interface Layout {
  mode: 'grid' | 'split-horizontal' | 'split-vertical';
  iframes: Iframe[];
  order: string[]; // iframe IDs in order
  panelSizes: Record<string, { width: number; height: number }>;
}
```

## MobX Store Structure

### iframe-layout-store
```typescript
class IframeLayoutStore {
  @observable layout: Layout = { mode: 'grid', iframes: [], order: [], panelSizes: {} };
  @observable isLoading: boolean = false;
  @observable error: string | null = null;
  @observable editingIframeId: string | null = null;
  @observable draggedIframeId: string | null = null;
  @observable dragOverIframeId: string | null = null;
  
  // Actions
  @action addIframe(iframe: Iframe): void;
  @action removeIframe(id: string): void;
  @action updateIframe(id: string, updates: Partial<Iframe>): void;
  @action switchLayout(mode: Layout['mode']): void;
  @action reorderIframes(order: string[]): void;
  @action editIframe(id: string): void;
  @action closeEditModal(): void;
  @action startDrag(id: string): void;
  @action dragOver(id: string): void;
  @action drop(targetId: string): void;
  @action endDrag(): void;
  @action loadFromStorage(): void;
  @action saveToStorage(): void;
  @action clearStorage(): void;
}
```

### iframe-store
```typescript
class IframeStore {
  @observable iframes: Map<string, Iframe> = new Map();
  
  @action addIframe(iframe: Iframe): void;
  @action updateIframe(id: string, updates: Partial<Iframe>): void;
  @action removeIframe(id: string): void;
  @action toggleVisibility(id: string): void;
}
```

## Security Considerations

1. **Iframe Sandboxing:** Always use `sandbox` attribute on iframes
2. **URL Validation:** Validate URLs before loading
3. **CSP Headers:** Configure Content-Security-Policy headers
4. **XSS Protection:** Ensure proper headers are set

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run type-check

# Run linter
npm run lint
```

## Testing Strategy

- **Unit Tests:** Test MobX stores and utility functions
- **Component Tests:** Test UI components in isolation
- **Integration Tests:** Test iframe loading and layout switching
- **E2E Tests:** Test full user flows (optional)

## Performance Optimizations

1. **Debounced saves** to localStorage
2. **Lazy loading** of iframe content
3. **Virtual scrolling** for large iframe lists
4. **Memoization** with `useMemo` and `useCallback`
5. **Code splitting** for route-based components

## Accessibility

- ARIA labels for all interactive elements
- Keyboard navigation support
- Focus management for modals
- Screen reader announcements for state changes
