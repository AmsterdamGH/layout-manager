# AGENTS.md

## Project Overview

A React application for managing a dynamic layout of iframes with multiple layout modes, drag-and-drop reordering, preset management with location hash support, export/import functionality, and a dark theme with toggle. The application starts in view mode by default.

## Tech Stack

- **Framework:** React 18+
- **Language:** TypeScript
- **State Management:** MobX
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

- **Build Tool:** Vite

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **File & Folder Names** | lowercase dash-separated | `add-iframe-button.tsx`, `layout-switcher.tsx` |
| **Function Names** | lower camelCase | `addIframe()`, `removeIframe()` |
| **Class Names** | PascalCase | `IframeLayoutStore`, `Panel` |
| **Interfaces/Types** | PascalCase | `Iframe`, `Layout` |
| **Variables** | lower camelCase | `iframeList`, `isOpen` |
| **Constants** | UPPER_SNAKE_CASE | `PRESETS_KEY` |
| **Props** | lower camelCase | `iframeUrl`, `panelSize` |
| **State Variables** | lower camelCase | `isOpen`, `selectedIframe` |
| **Hooks** | use + PascalCase prefix | `useDebounce` |
| **CSS Classes** | kebab-case | `iframe-panel`, `toolbar-item` |

## Architecture

### State Management (MobX)

```
┌─────────────────────────────────────┐
│           Store (MobX)              │
├─────────────────────────────────────┤
│  - iframe-layout-store              │
│  - modal-store                      │
│  - preset-store                     │
│  - theme-store                      │
└─────────────────────────────────────┘
```

### Folder Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── layout-switcher.tsx
│   │   ├── grid-layout.tsx
│   │   ├── split-layout.tsx
│   │   ├── panel.tsx
│   │   └── panel-header.tsx
│   ├── side-panel/
│   │   ├── add-iframe-button.tsx
│   │   ├── iframe-list.tsx
│   │   ├── preset-actions.tsx
│   │   ├── preset-selector.tsx
│   │   └── side-panel.tsx
│   ├── modals/
│   │   ├── delete-preset-modal.tsx
│   │   ├── edit-iframe-modal.tsx
│   │   ├── edit-preset-modal.tsx
│   │   ├── export-preset-modal.tsx
│   │   └── import-preset-modal.tsx
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── loading.tsx
│       └── tooltip.tsx
├── stores/
│   ├── iframe-layout-store.ts
│   ├── modal-store.ts
│   ├── preset-store.ts
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
│   ├── constants.ts
│   ├── debounce.ts
│   ├── hash.ts
│   ├── storage.ts
│   ├── validate-preset.ts
│   └── validation.ts
├── app.tsx
└── main.tsx
```

## Key Features

### 1. Iframe Management
- Add iframes with URL and optional title
- Edit iframe URLs and titles
- Remove iframes
- Toggle iframe visibility (via Eye/EyeOff button in panel header and iframe list)
- Toggle header visibility in edit mode (via RectangleHorizontal/CreditCard button in panel header)
- Load iframe with loading/error states
- Unified modal for adding and editing iframes (EditIframeModal)
- IFrameList component in side panel for managing iframes (shows all iframes, including hidden ones)
- Panel component shows all panels in edit mode

### 2. Layout Modes
- **Grid:** Equal-sized panels in a grid
- **Horizontal:** Panels arranged horizontally (side-by-side)
- **Vertical:** Panels arranged vertically (stacked)

### 3. Drag and Drop Reordering
- Drag panels using the grip handle (⋮⋮) in edit mode only
- Visual feedback during drag operations
- Drop zones highlighted with blue ring
- Order persisted to localStorage
- Panels are not draggable in view mode

### 5. Presets
- Save multiple layout configurations (presets) with different iframes and modes
- Switch between presets via dropdown selector (or listbox when ≤5 presets)
- Clone presets with a new name
- Edit preset names
- Delete presets (selects first preset after deletion if current preset is deleted)
- Create new presets with empty layout
- Import presets from JSON files via modal (Paste JSON or Upload File)
- Export presets as JSON files
- Presets stored in localStorage under key `'layout-manager-presets'`
- **PresetActions component:** Reusable component for preset action buttons (Delete, Clone, Edit) used in both dropdown and listbox views
- **Action button order:** Delete, Clone, Edit
- **Dropdown mode:** Action buttons appear inside the combobox after the chevron
- **Listbox mode:** Action buttons appear on each preset item
- **Import preset modal:** Opens via Import button next to New preset button
- **Duplicate handling:** Appends `-{timestamp}` suffix for duplicate names (case-sensitive)
- **Validation:** Preset data validated on import (name, mode, iframes, order)
- **Preset Store:** Dedicated store (`preset-store.ts`) handles all preset CRUD operations
- **Iframe Storage:** Iframes stored as `Record<string, Iframe>` object for efficient lookups

### 6. Location Hash Support
- Current preset reflected in URL hash using preset name (e.g., `#preset=My-Preset`)
- Hash updated when switching presets or creating new ones
- Browser back/forward buttons work correctly
- Hash validated on load - invalid presets are ignored
- On first load with no hash, a default preset is created and hash is set
- Hash management handled by layout store, not preset store

### 7. Dark Theme
- Toggle between light and dark themes via button in side panel header
- Theme preference persisted to localStorage
- Tailwind CSS `dark:` variant classes used for styling
- CSS variables for theme colors in `global.css`
- No flash of unstyled content (FOUC) with inline script in `index.html`
- Theme provider wraps the app with React context

### 8. Export/Import Presets
- Export current preset as JSON via modal with textarea
- Copy preset JSON to clipboard
- Download preset as JSON file
- Import presets via modal with two modes:
  - **Paste JSON:** Textarea for pasting preset JSON data
  - **Upload File:** Click-to-upload area for selecting a JSON file
- Import validation checks preset structure (name, mode, iframes, order)
- Duplicate preset names handled automatically with `-{timestamp}` suffix
- **Preset Storage Format:** Stores both `presets` array and `iframes` array separately in localStorage

### 9. Side Panel Behavior
- Panel opens/closes via ESC key toggle
- Panel stays open when any modal is active (iframe edit, export, preset edit, or import)
- Preset dropdown closes when clicking outside or when panel closes
- **Add page button:** Has text caption "Add Page" next to Plus icon
- **Preset actions:** Inline in combobox (dropdown mode) or on each item (listbox mode)
- **Import preset button:** Located next to New preset button in PresetSelector
- **IFrame list:** Displays all iframes (including hidden ones) with visibility toggle button on each item
- **Panel header:** Visible in both view and edit modes; shows grip icon and action buttons only in edit mode
- **Preset Selector:** Uses `presetStore.getPresetList()` for dropdown options

### 10. Tooltip Component
- Reusable tooltip component (`src/components/ui/tooltip.tsx`) using `createPortal`
- Intelligent positioning algorithm that tries sides in clockwise order (top → right → bottom → left)
- Automatically selects the first side where the tooltip fits within the viewport
- Accounts for tooltip size and transform when calculating position
- Arrow indicator points towards the trigger element

### 11. Modal Store Architecture
- Modal store (`src/stores/modal-store.ts`) manages all modal UI state
- Modal store delegates preset actions to `presetStore`

### 12. Header Visibility Toggle
- Toggle button in panel header to show/hide header in edit mode
- Header is always visible in edit mode (regardless of `headerVisible` property)
- Uses `RectangleHorizontal` icon to hide header, `CreditCard` to show header
- `headerVisible` property added to `Iframe` interface

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
| `Grip`, `Pencil`, `Trash2`, `Eye`, `EyeOff`, `RectangleHorizontal`, `CreditCard` | Panel header actions |
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
  headerVisible: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Preset
```typescript
interface Preset {
  id: string;
  name: string;
  mode: 'layout-grid' | 'layout-horizontal' | 'layout-vertical';
  iframes: Record<string, Iframe>;
  order: string[];
}
```

## MobX Store Structure

### iframe-layout-store
```typescript
class IframeLayoutStore {
  appMode: AppMode = 'view';
  presetId: string | null = null;
  isSidePanelOpen: boolean = false;
  draggedIframeId: string | null = null;
  dragOverIframeId: string | null = null;
  
  // Actions
  @action addIframe(iframe: Iframe): void;
  @action removeIframe(id: string): void;
  @action updateIframe(id: string, updates: Partial<Iframe>): void;
  @action switchLayout(mode: Preset['mode']): void;
  @action startDrag(id: string): void;
  @action dragOver(id: string): void;
  @action drop(targetId: string): void;
  @action endDrag(): void;
  @action selectPreset(presetId: string): void;
  @action toggleAppMode(): void;
  @action openSidePanel(): void;
  @action closeSidePanel(): void;
  @action toggleVisibility(id: string): void;
  @action toggleHeaderVisibility(id: string): void;
  
  // Getters
  get orderedIframes(): Iframe[];
  get currentMode(): Preset['mode'];
  getIFrameById(id: string): Iframe | undefined;
  get preset(): Preset | undefined;
  get sidePanelOpen(): boolean;
  get exportedJson(): string;
  get currentPresetId(): string | null;
  
  // Private methods
  private initializeFromHash(): void;
  private handleHashChange(): void;
}
```

### preset-store
```typescript
class PresetStore {
  presets: Map<string, Preset> = new Map();
  
  // Actions
  @action createPreset(name: string, initialPreset?: Partial<Preset>): Preset;
  @action deletePreset(presetId: string): void;
  @action clonePreset(sourceId: string, newName: string): Preset;
  @action editPresetName(presetId: string, newName: string): void;
  @action updateIframe(presetId: string, iframeId: string, updates: Partial<Iframe>): void;
  @action removeIframe(presetId: string, iframeId: string): void;
  @action toggleIframeVisibility(presetId: string, iframeId: string): void;
  @action toggleIframeHeaderVisibility(presetId: string, iframeId: string): void;
  @action addIframe(presetId: string, iframe: Iframe): void;
  @action savePresets(): void;
  @action createDefaultPreset(): Preset;
  @action clearPresets(): void;
  
  // Getters
  getPresetById(id: string): Preset | undefined;
  getPresetByName(name: string): Preset | undefined;
  getPresetList(): Preset[];
  getIframeByPresetId(presetId: string, iframeId: string): Iframe | undefined;
}
```

### modal-store
```typescript
class ModalStore {
  isEditIframeModalOpen: boolean = false;
  isExportPresetModalOpen: boolean = false;
  isEditPresetModalOpen: boolean = false;
  isImportPresetModalOpen: boolean = false;
  isDeletePresetModalOpen: boolean = false;
  iframeModalMode: ModalMode = 'create';
  presetModalMode: ModalMode = 'create';
  editingIframeId: string | null = null;
  editingPresetId: string | null = null;
  deletePresetId: string | null = null;
  
  // Actions
  @action openEditIframeModal(mode: ModalMode, id?: string): void;
  @action closeEditIframeModal(): void;
  @action openEditPresetModal(mode: ModalMode, presetId?: string): void;
  @action closeEditPresetModal(): void;
  @action openDeletePresetModal(presetId: string): void;
  @action closeDeletePresetModal(): void;
  @action openImportPresetModal(): void;
  @action closeImportPresetModal(): void;
  @action openExportPresetModal(): void;
  @action closeExportPresetModal(): void;
  @action closeAllModals(): void;
  
  // Getters
  get editingIframe(): Iframe | null;
  get editingPreset(): Preset | null;
  
  // Computed properties
  get isAnyModalOpen(): boolean;
  get editIframeModalOpen(): boolean;
  get exportPresetModalOpen(): boolean;
  get importPresetModalOpen(): boolean;
  get deletePresetModalOpen(): boolean;
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
