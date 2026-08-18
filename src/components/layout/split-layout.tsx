import { observer } from 'mobx-react-lite';
import { Panel } from './panel';
import { AddIframeButton } from '../side-panel/add-iframe-button';
import { iframeLayoutStore } from '@/stores';
import type { AppMode } from '@/types/layout';

interface SplitLayoutProps {
  orientation?: 'horizontal' | 'vertical';
}

export const SplitLayout = observer(({ orientation = 'horizontal' }: SplitLayoutProps) => {
  const orderedIframes = iframeLayoutStore.orderedIframes;
  const appMode: AppMode = iframeLayoutStore.appMode;
  const isEditMode = appMode === 'edit';

  const handleEdit = (id: string) => {
    iframeLayoutStore.editIframe(id);
  };

  const handleDelete = (id: string) => {
    iframeLayoutStore.removeIframe(id);
  };

  if (orderedIframes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <AddIframeButton onClick={() => iframeLayoutStore.openAddIframeModal()} />
      </div>
    );
  }

  const containerClass = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  return (
    <div className={`flex ${containerClass} gap-2 h-full`}>
      {orderedIframes.map((iframe) => (
        <div key={iframe.id} className="flex-1 min-w-0">
          <Panel
            iframe={iframe}
            className="h-full"
            isEditMode={isEditMode}
            onEdit={isEditMode ? handleEdit : undefined}
            onDelete={isEditMode ? handleDelete : undefined}
          />
        </div>
      ))}
    </div>
  );
});
