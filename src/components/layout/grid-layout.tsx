import { observer } from 'mobx-react-lite';
import { iframeLayoutStore, modalStore } from '@/stores';
import { Panel } from './panel';
import { AddIframeButton } from '../side-panel/add-iframe-button';

export const GridLayout = observer(() => {
  const orderedIframes = iframeLayoutStore.orderedIframes;
  const count = orderedIframes.length;

  if (count === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <AddIframeButton onClick={() => {
          modalStore.openEditIframeModal('create');
        }} />
      </div>
    );
  }

  const getGridClass = () => {
    switch (count) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
      case 4:
        return 'grid-cols-2';
      default:
        return 'grid-cols-3';
    }
  };

  return (
    <div className={`grid ${getGridClass()} gap-2 h-full`}>
      {orderedIframes.map((iframe) => (
        <Panel
          key={iframe.id}
          iframe={iframe}
          className="h-full"
        />
      ))}
    </div>
  );
});
