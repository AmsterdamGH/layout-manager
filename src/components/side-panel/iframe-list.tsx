import { observer } from 'mobx-react-lite';
import { Plus } from 'lucide-react';
import { iframeLayoutStore } from '@/stores';

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
            <button
              className="w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 truncate"
              onClick={() => iframeLayoutStore.editIframe(iframe.id)}
              aria-label={`Edit ${iframe.title}`}
            >
              {iframe.title || iframe.url}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => iframeLayoutStore.openAddIframeModal()}
            className="w-full px-2 py-1.5 text-sm rounded-md transition-colors bg-gray-500 dark:bg-gray-700 text-white dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
            aria-label="Add page"
          >
            <Plus className="w-4 h-4" />
          </button>
        </li>
      </ul>
    </div>
  );
});
