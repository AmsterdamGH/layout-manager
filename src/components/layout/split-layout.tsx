import { observer } from 'mobx-react-lite';
import { Panel } from './panel';
import { iframeLayoutStore } from '@/stores';

interface SplitLayoutProps {
  orientation?: 'horizontal' | 'vertical';
}

export const SplitLayout = observer(({ orientation = 'horizontal' }: SplitLayoutProps) => {
  const orderedIframes = iframeLayoutStore.orderedIframes;

  const handleEdit = (id: string) => {
    iframeLayoutStore.editIframe(id);
  };

  const handleDelete = (id: string) => {
    iframeLayoutStore.removeIframe(id);
  };

  if (orderedIframes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No iframes to display. Add one using the toolbar.
      </div>
    );
  }

  const firstIframe = orderedIframes[0];
  const secondIframe = orderedIframes.length > 1 ? orderedIframes[1] : null;

  const containerClass = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  return (
    <div className={`flex ${containerClass} gap-4 h-full`}>
      <div className="flex-1 min-w-0">
        <Panel
          iframe={firstIframe}
          className="h-full"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {secondIframe && (
        <div className="flex-1 min-w-0">
          <Panel
            iframe={secondIframe}
            className="h-full"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
});
