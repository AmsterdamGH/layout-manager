import { observer } from 'mobx-react-lite';
import { iframeLayoutStore, modalStore } from '@/stores';
import { Panel } from './panel';
import { AddIframeButton } from '../side-panel/add-iframe-button';

interface SplitLayoutProps {
  orientation?: 'horizontal' | 'vertical';
}

export const SplitLayout = observer(({ orientation = 'horizontal' }: SplitLayoutProps) => {
  const orderedIframes = iframeLayoutStore.orderedIframes;

  if (orderedIframes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        <AddIframeButton onClick={() => {
          modalStore.openEditIframeModal('create');
        }} />
      </div>
    );
  }

  const containerClass = orientation === 'horizontal' ? 'flex-row' : 'flex-col';

  return (
    <div className={`flex ${containerClass} gap-2 h-full`}>
      {orderedIframes.map((iframe) => (
        <div key={iframe.id} className="flex-1 min-w-0">
          <Panel iframe={iframe} className="h-full" />
        </div>
      ))}
    </div>
  );
});
