import { Tooltip } from '@/components/ui/tooltip'
import { iframeLayoutStore } from '@/stores'
import { modalStore } from '@/stores'
import type { Iframe } from '@/types/iframe'
import {
  CreditCard,
  Eye,
  EyeOff,
  Grip,
  Pencil,
  RectangleHorizontal,
  Trash2,
} from 'lucide-react'
import { observer } from 'mobx-react-lite'

interface PanelHeaderProps {
  iframe: Iframe;
}

export const PanelHeader = observer(({ iframe }: PanelHeaderProps) => {
  const isEditMode = iframeLayoutStore.appMode === 'edit';

  return (
    <div className={`absolute top-0 left-0 right-0 z-10 px-3 border-b transition-colors ${isEditMode || iframe.headerVisible ? 'bg-gray-100 dark:bg-gray-700 py-1.5 border-gray-200 dark:border-gray-600' : 'bg-transparent border-0'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEditMode && (
            <Grip className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-grab" aria-hidden="true" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{iframe.title}</span>
        </div>
        <div className="flex items-center gap-1">
          {isEditMode && (
            <>
              <Tooltip text={iframe.headerVisible ? 'Hide header' : 'Show header'}>
                <button
                  onClick={() => iframeLayoutStore.toggleHeaderVisibility(iframe.id)}
                  className="p-1 rounded transition-colors text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  aria-label={iframe.headerVisible ? 'Hide header' : 'Show header'}
                >
                  {iframe.headerVisible ? <CreditCard className="w-4 h-4" /> : <RectangleHorizontal className="w-4 h-4" />}
                </button>
              </Tooltip>
              <Tooltip text={iframe.isVisible ? 'Hide page' : 'Show page'}>
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
              </Tooltip>
              {isEditMode && (
                <Tooltip text="Edit page">
                  <button
                    onClick={() => modalStore.openEditIframeModal('edit', iframe.id)}
                    className="p-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    aria-label={`Edit ${iframe.title}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </Tooltip>
              )}
              {isEditMode && (
                <Tooltip text="Delete page">
                  <button
                    onClick={() => iframeLayoutStore.removeIframe(iframe.id)}
                    className="p-1 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    aria-label={`Delete ${iframe.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Tooltip>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});
