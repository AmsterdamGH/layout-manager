import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import type { Iframe } from '@/types/iframe';
import { Loading } from '../ui/loading';
import { iframeLayoutStore } from '@/stores';
import { PanelHeader } from './panel-header';

interface PanelProps {
  iframe: Iframe;
  className?: string;
}

export const Panel = observer(({ iframe, className = '' }: PanelProps) => {
  const isEditMode = iframeLayoutStore.appMode === 'edit';
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

  if (!isEditMode && !iframe.isVisible) {
    return null;
  }

  return (
    <div
      draggable={isEditMode}
      onDragStart={isEditMode ? handleDragStart : undefined}
      onDragOver={isEditMode ? handleDragOver : undefined}
      onDrop={isEditMode ? handleDrop : undefined}
      onDragEnd={isEditMode ? handleDragEnd : undefined}
      className={`relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 transition-all ${
        isDragging ? 'opacity-50 cursor-grabbing' : isEditMode ? 'cursor-grab' : 'cursor-default'
      } ${isDragOver ? 'ring-2 ring-blue-600 border-blue-600' : 'border dark:border-gray-700 border-gray-200'} ${className}`}
      role="region"
      aria-label={iframe.title || 'Page panel'}
    >
      {(isEditMode || iframe.headerVisible) && <PanelHeader iframe={iframe} />}
      <div className={`h-full ${isEditMode || iframe.headerVisible ? 'pt-8' : ''}`}>
        {isLoading && <Loading size="sm" text="Loading..." />}
        {hasError && (
          <div className="flex items-center justify-center h-full text-red-500">
            Failed to load page
          </div>
        )}
        <iframe
          key={iframe.url}
          src={iframe.url}
          title={iframe.title}
          onLoad={handleLoad}
          onError={handleError}
          className="w-full h-full border-0"
          style={{ pointerEvents: isEditMode ? 'none' : 'auto' }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
        />
      </div>
    </div>
  );
});
