import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { HoverZone } from './components/hover-zone';
import { SidePanel } from './components/side-panel/side-panel';
import { GridLayout } from './components/layout/grid-layout';
import { SplitLayout } from './components/layout/split-layout';
import { EditIframeModal } from './components/modals/edit-iframe-modal';
import { Loading } from './components/ui/loading';
import { iframeLayoutStore } from './stores';


export const App = observer(() => {
  useEffect(() => {
    iframeLayoutStore.loadFromStorage();
    return () => {
      iframeLayoutStore.dispose();
    };
  }, []);

  useEffect(() => {
    document.title = iframeLayoutStore.orderedIframes.map((i) => i.title).join(' | ') || 'Layout Manager';
  }, [iframeLayoutStore.orderedIframes]);

  const handleSaveIframe = (id: string, url: string, title: string) => {
    const existingIframe = iframeLayoutStore.orderedIframes.find((i) => i.id === id);
    if (existingIframe) {
      iframeLayoutStore.updateIframe(id, { url, title });
    } else {
      iframeLayoutStore.addIframe({
        id,
        url,
        title,
        isVisible: true,
        width: 100,
        height: 100,
        position: { x: 0, y: 0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  if (iframeLayoutStore.isLoading) {
    return <Loading text="Loading layout..." />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <HoverZone />
      <SidePanel
        isOpen={iframeLayoutStore.sidePanelOpen}
        onClose={() => iframeLayoutStore.closeSidePanel()}
        currentMode={iframeLayoutStore.currentMode}
        onModeChange={(mode) => iframeLayoutStore.switchLayout(mode)}
      />

      <main className="flex-1 p-2 overflow-auto">
        {iframeLayoutStore.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 dark:bg-red-900/50 dark:border-red-800 dark:text-red-200">
            {iframeLayoutStore.error}
          </div>
        )}

        {iframeLayoutStore.currentMode === 'layout-grid' && <GridLayout />}
        {iframeLayoutStore.currentMode === 'layout-horizontal' && (
          <SplitLayout orientation="horizontal" />
        )}
        {iframeLayoutStore.currentMode === 'layout-vertical' && (
          <SplitLayout orientation="vertical" />
        )}
      </main>

      <EditIframeModal
        iframe={iframeLayoutStore.editingIframeId ? iframeLayoutStore.orderedIframes.find((i) => i.id === iframeLayoutStore.editingIframeId) || null : null}
        isOpen={!!iframeLayoutStore.editingIframeId || iframeLayoutStore.isAddIframeModalOpen}
        onClose={() => iframeLayoutStore.closeEditModal()}
        onSave={handleSaveIframe}
        mode={iframeLayoutStore.currentModalMode}
      />
    </div>
  );
});
