import { observer } from 'mobx-react-lite';

type LayoutMode = 'grid' | 'split-horizontal' | 'split-vertical';

interface LayoutSwitcherProps {
  currentMode: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

export const LayoutSwitcher = observer(({ currentMode, onChange }: LayoutSwitcherProps) => {
  const layouts = [
    { id: 'grid' as const, label: 'Grid', icon: '⊞' },
    { id: 'split-horizontal' as const, label: 'Split Horizontal', icon: '◧' },
    { id: 'split-vertical' as const, label: 'Split Vertical', icon: '◪' },
  ];

  return (
    <div className="inline-flex items-center gap-1 p-1 bg-gray-100 rounded-md" role="radiogroup" aria-label="Layout mode">
      {layouts.map((layout) => (
        <button
          key={layout.id}
          role="radio"
          aria-checked={currentMode === layout.id}
          onClick={() => onChange(layout.id)}
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
            currentMode === layout.id
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
        >
          <span className="mr-1.5">{layout.icon}</span>
          {layout.label}
        </button>
      ))}
    </div>
  );
});
