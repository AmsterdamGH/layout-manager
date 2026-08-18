# AGENTS.md

## Project Overview

A React application for managing a dynamic layout of iframes with multiple layout modes, drag-and-drop reordering, persistent state storage, preset management with location hash support, and a dark theme with toggle.

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
│   ├── side-panel/
│   │   ├── side-panel.tsx
│   │   ├── preset-selector.tsx
│   │   ├── iframe-list.tsx
│   │   └── page-list.tsx
│   ├── modals/
│   │   ├── edit-iframe-modal.tsx
│   │   └── edit-preset-modal.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       └── loading.tsx
├── stores/
│   ├── iframe-layout-store.ts
│   ├── iframe-store.ts
│   ├── theme-store.ts
│   └── index.ts
├── providers/
│   └── theme-provider.tsx
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
│   ├── constants.ts
│   └── hash.ts
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
- Unified modal for adding and editing iframes (EditIframeModal)
- IFrameList component in side panel for managing iframes

### 2. Layout Modes
- **Grid:** Equal-sized panels in a grid
- **Horizontal:** Panels arranged horizontally (side-by-side)
- **Vertical:** Panels arranged vertically (stacked)

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

### 5. Presets
- Save multiple layout configurations (presets) with different iframes and modes
- Switch between presets via dropdown selector (or listbox when ≤5 presets)
- Clone presets with a new name
- Edit preset names
- Delete presets
- Create new presets with empty layout
- Presets stored in localStorage under key `'presets'`

### 6. Location Hash Support
- Current preset reflected in URL hash using preset name (e.g., `#preset=My-Preset`)
- Hash updated when switching presets or creating new ones
- Browser back/forward buttons work correctly
- Hash validated on load - invalid presets are ignored
- On first load with no hash, a default preset is created and hash is set

### 7. Dark Theme
- Toggle between light and dark themes via button in side panel header
- Theme preference persisted to localStorage
- Tailwind CSS `dark:` variant classes used for styling
- CSS variables for theme colors in `global.css`
- No flash of unstyled content (FOUC) with inline script in `index.html`
- Theme provider wraps the app with React context

## Icons

The application uses Lucide React icons for consistent iconography:

| Icon | Usage |
|------|-------|
| `Grid3x3` | Grid layout mode |
| `Columns3` | Horizontal layout mode |
| `Rows3` | Vertical layout mode |
| `Plus` | Add page button (in IFrameList and side panel) |
| `Pencil`, `Save` | Edit mode toggle |
| `X` | Close buttons |
| `Loader2` | Loading states |
| `Grip`, `Pencil`, `Trash2` | Panel actions |
| `Copy` | Clone preset button |
| `ChevronDown` | Dropdown toggle |
| `Sun`, `Moon` | Theme toggle (side panel header) |

Icons are imported from `lucide-react` and used as React components with consistent sizing (`h-4 w-4`). Layout switcher buttons display only icons (no labels) centered in a row.

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
  appMode: 'edit' | 'view';
  preset: Preset;
  presetId: string | null;
}
```

### Preset
```typescript
interface Preset {
  id: string;
  name: string;
  mode: 'layout-grid' | 'layout-horizontal' | 'layout-vertical';
  iframes: Iframe[];
  order: string[];
  panelSizes: Record<string, { width: number; height: number }>;
}
```

## MobX Store Structure

### iframe-layout-store
```typescript
class IframeLayoutStore {
  preset: Preset = { id: 'default', name: 'Default', mode: 'layout-grid', iframes: [], order: [], panelSizes: {} };
  layout: Layout = { appMode: 'edit', preset: this.preset, presetId: null };
  presets: Map<string, Preset> = new Map();
  isLoading: boolean = false;
  error: string | null = null;
  editingIframeId: string | null = null;
  draggedIframeId: string | null = null;
  dragOverIframeId: string | null = null;
  isAddIframeModalOpen: boolean = false;
  modalMode: ModalMode = 'create';
  isHoveringLeftEdge: boolean = false;
  hoverTimeout: ReturnType<typeof setTimeout> | null = null;
  openTimeout: ReturnType<typeof setTimeout> | null = null;
  
  // Actions
  @action addIframe(iframe: Iframe): void;
  @action removeIframe(id: string): void;
  @action updateIframe(id: string, updates: Partial<Iframe>): void;
  @action switchLayout(mode: Preset['mode']): void;
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
  @action createPreset(name: string, initialPreset?: Partial<Preset>): string;
  @action switchPreset(presetId: string): void;
  @action deletePreset(presetId: string): void;
  @action clonePreset(sourceId: string, newName: string): string;
  @action editPresetName(presetId: string, newName: string): void;
  @action openAddIframeModal(): void;
  @action openEditModal(id: string): void;
  @action toggleAppMode(): void;
  @action toggleSidePanel(): void;
  @action openSidePanel(): void;
  @action closeSidePanel(): void;
  @action openSidePanelDelayed(): void;
  @action setHoveringLeftEdge(isHovering: boolean): void;
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

### theme-store
```typescript
class ThemeStore {
  theme: Theme = 'light';
  
  // Actions
  @action setTheme(theme: Theme): void;
  @action toggleTheme(): void;
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
