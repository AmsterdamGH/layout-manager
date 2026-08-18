import { observer } from 'mobx-react-lite';
import { Columns3, Grid3x3, Rows3 } from 'lucide-react';
import type { LayoutMode } from '@/types/layout';

interface LayoutSwitcherProps {
  currentMode: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

export const LayoutSwitcher = observer(({ currentMode, onChange }: LayoutSwitcherProps) => {
  const layouts = [
    { id: 'layout-grid' as const, icon: Grid3x3 },
    { id: 'layout-horizontal' as const, icon: Columns3 },
    { id: 'layout-vertical' as const, icon: Rows3 },
  ];

  return (
    <div className="flex flex-row items-center justify-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-md" role="radiogroup" aria-label="Layout mode">
      {layouts.map((layout) => (
        <button
          key={layout.id}
          role="radio"
          aria-checked={currentMode === layout.id}
          onClick={() => onChange(layout.id)}
          className={`px-2.5 py-2 text-sm rounded-md transition-colors ${
            currentMode === layout.id
              ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-gray-100'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <layout.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
});
