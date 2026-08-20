import { observer } from 'mobx-react-lite';
import { iframeLayoutStore, modalStore } from '@/stores';
import { Plus, Eye, EyeOff } from 'lucide-react';

export const IFrameList = observer(() => {
  const orderedIframes = iframeLayoutStore.orderedIframes;

  return (
    <div>
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Pages
      </label>
      <ul className="space-y-1 max-h-64 overflow-auto" role="list">
        {orderedIframes.map((iframe) => (
          <li key={iframe.id}>
            <div className="flex items-center gap-1">
              <button
                className="flex-1 text-left px-2 py-1.5 text-sm rounded-md transition-colors bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 truncate"
                onClick={() => modalStore.openEditIframeModal('edit', iframe.id)}
                aria-label={`Edit ${iframe.title}`}
              >
                {iframe.title || iframe.url}
              </button>
              <button
                onClick={() => iframeLayoutStore.toggleVisibility(iframe.id)}
                className={`p-1 rounded transition-colors flex-shrink-0 ${
                  iframe.isVisible
                    ? 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                    : 'text-gray-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                aria-label={iframe.isVisible ? `Hide ${iframe.title}` : `Show ${iframe.title}`}
              >
                {iframe.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </li>
        ))}
        <li>
          <button
            onClick={() => modalStore.openEditIframeModal('create')}
            className="w-full px-2 py-1.5 text-sm rounded-md transition-colors bg-gray-500 dark:bg-gray-700 text-white dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
            aria-label="Add page"
          >
            <Plus className="w-4 h-4" />
            Add Page
          </button>
        </li>
      </ul>
    </div>
  );
});
