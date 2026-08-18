import { observer } from 'mobx-react-lite';
import { Panel } from './panel';
import { iframeLayoutStore } from '@/stores';

export const GridLayout = observer(() => {
  const orderedIframes = iframeLayoutStore.orderedIframes;
  const count = orderedIframes.length;

  const handleEdit = (id: string) => {
    iframeLayoutStore.editIframe(id);
  };

  const handleDelete = (id: string) => {
    iframeLayoutStore.removeIframe(id);
  };

  if (count === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No iframes to display. Add one using the toolbar.
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
    <div className={`grid ${getGridClass()} gap-4 h-full`}>
      {orderedIframes.map((iframe) => (
        <Panel
          key={iframe.id}
          iframe={iframe}
          className="h-full"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
});
