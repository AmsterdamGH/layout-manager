# Layout Manager

A React application for managing a dynamic layout of iframes with multiple layout modes, drag-and-drop reordering, and persistent state storage.

## Features

- **Multiple Layout Modes**: Grid, Split Horizontal, Split Vertical
- **Iframe Management**: Add, edit, remove, and toggle visibility of iframes
- **Persistent Storage**: Auto-save to localStorage with debounced writes
- **Responsive Design**: Built with Tailwind CSS
- **Type-Safe**: Full TypeScript support
- **State Management**: MobX for reactive state management

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

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

## Project Structure

```
src/
├── components/          # React components
│   ├── layout/          # Layout components (grid, split)
│   ├── toolbar/         # Toolbar components
│   ├── modals/          # Modal dialogs
│   └── ui/              # Reusable UI components
├── stores/              # MobX stores
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── styles/              # Global styles
└── app.tsx              # Main application component
```

## Architecture

### State Management

The application uses MobX for state management with two main stores:

1. **IframeLayoutStore**: Manages the overall layout state, including mode switching and iframe ordering
2. **IframeStore**: Manages individual iframe data and visibility

### Data Flow

```
Store (MobX) → React Components → UI
     ↑                              |
     └──── localStorage (persistence)
```

## Development

### Naming Conventions

- **Files/Folders**: lowercase-dash-separated (e.g., `add-iframe-button.tsx`)
- **Functions/Variables**: camelCase (e.g., `addIframe()`)
- **Classes/Interfaces**: PascalCase (e.g., `IframeLayoutStore`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_IFRAMES`)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run type-check` | Run TypeScript type checking |
| `npm run lint` | Run ESLint |

## Security Considerations

- All iframes use the `sandbox` attribute
- URLs are validated before loading
- Content-Security-Policy headers should be configured in production

## License

MIT
