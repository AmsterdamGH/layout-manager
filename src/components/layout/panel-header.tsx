import { observer } from 'mobx-react-lite';
import type { Iframe } from '@/types/iframe';
import { iframeLayoutStore } from '@/stores';
import { Grip, Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';

interface PanelHeaderProps {
  iframe: Iframe;
  isEditMode?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const PanelHeader = observer(({ iframe, isEditMode = true, onEdit, onDelete }: PanelHeaderProps) => (
  <div className="absolute top-0 left-0 right-0 z-10 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 border-b border-gray-200 dark:border-gray-600">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {isEditMode && (
          <Grip className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-grab" aria-hidden="true" />
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{iframe.title}</span>
      </div>
      {isEditMode && (
        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(iframe.id)}
              className="p-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              aria-label={`Edit ${iframe.title}`}
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => iframeLayoutStore.toggleVisibility(iframe.id)}
            className={`p-1 rounded transition-colors ${
              iframe.isVisible
                ? 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-label={iframe.isVisible ? `Hide ${iframe.title}` : `Show ${iframe.title}`}
          >
            {iframe.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(iframe.id)}
              className="p-1 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              aria-label={`Delete ${iframe.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  </div>
));
