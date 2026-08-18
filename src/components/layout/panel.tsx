import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import type { Iframe } from '@/types/iframe';
import { Loading } from '../ui/loading';
import { iframeLayoutStore } from '@/stores';
import { Grip, Pencil, Trash2 } from 'lucide-react';

interface PanelProps {
  iframe: Iframe;
  className?: string;
  isEditMode?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const Panel = observer(({ iframe, className = '', isEditMode = true, onEdit, onDelete }: PanelProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isDragged = iframeLayoutStore.draggedIframeId === iframe.id;
  const isDragOver = iframeLayoutStore.dragOverIframeId === iframe.id;

  const handleDragStart = () => {
    setIsDragging(true);
    iframeLayoutStore.startDrag(iframe.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragged) {
      iframeLayoutStore.dragOver(iframe.id);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    iframeLayoutStore.drop(iframe.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    iframeLayoutStore.endDrag();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={`relative overflow-hidden rounded-lg bg-white transition-all ${
        isDragging ? 'opacity-50 cursor-grabbing' : 'cursor-grab'
      } ${isDragOver ? 'ring-2 ring-blue-600 border-blue-600' : 'border border-gray-200'} ${className}`}
      role="region"
      aria-label={iframe.title || 'Iframe panel'}
    >
      {isEditMode && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gray-100 px-3 py-1.5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grip className="w-4 h-4 text-gray-400 cursor-grab" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-700 truncate">{iframe.title}</span>
            </div>
            <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(iframe.id)}
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-gray-200 rounded transition-colors"
                aria-label={`Edit ${iframe.title}`}
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(iframe.id)}
                className="p-1 text-gray-600 hover:text-red-600 hover:bg-gray-200 rounded transition-colors"
                aria-label={`Delete ${iframe.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            </div>
          </div>
        </div>
      )}
      <div className={`${isEditMode ? 'pt-8' : ''} h-full`}>
        {isLoading && <Loading size="sm" text="Loading..." />}
        {hasError && (
          <div className="flex items-center justify-center h-full text-red-500">
            Failed to load iframe
          </div>
        )}
        <iframe
          key={iframe.url}
          src={iframe.url}
          title={iframe.title}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full border-0"
          style={{ pointerEvents: 'none' }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
        />
      </div>
    </div>
  );
});
