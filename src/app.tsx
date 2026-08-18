import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { HoverZone } from './components/hover-zone';
import { SidePanel } from './components/side-panel/side-panel';
import { GridLayout } from './components/layout/grid-layout';
import { SplitLayout } from './components/layout/split-layout';
import { AddIframeModal } from './components/modals/add-iframe-modal';
import { EditIframeModal } from './components/modals/edit-iframe-modal';
import { Loading } from './components/ui/loading';
import { iframeLayoutStore } from './stores';


export const App = observer(() => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    iframeLayoutStore.loadFromStorage();
  }, []);

  useEffect(() => {
    document.title = iframeLayoutStore.orderedIframes.map((i) => i.title).join(' | ') || 'Layout Manager';
  }, [iframeLayoutStore.orderedIframes]);

  const handleAddIframe = (url: string, title: string) => {
    iframeLayoutStore.addIframe({
      id: `iframe-${Date.now()}`,
      url,
      title,
      isVisible: true,
      width: 100,
      height: 100,
      position: { x: 0, y: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleEditIframe = (id: string, url: string, title: string) => {
    iframeLayoutStore.updateIframe(id, { url, title });
    iframeLayoutStore.closeEditModal();
  };

  if (iframeLayoutStore.isLoading) {
    return <Loading text="Loading layout..." />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <HoverZone />
      <SidePanel
        isOpen={iframeLayoutStore.sidePanelOpen}
        onClose={() => iframeLayoutStore.closeSidePanel()}
        currentMode={iframeLayoutStore.currentMode}
        onModeChange={(mode) => iframeLayoutStore.switchLayout(mode)}
        onAddIframe={() => setIsAddModalOpen(true)}
      />

      <main className="flex-1 p-2 overflow-auto">
        {iframeLayoutStore.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            {iframeLayoutStore.error}
          </div>
        )}

        {iframeLayoutStore.currentMode === 'grid' && <GridLayout />}
        {iframeLayoutStore.currentMode === 'split-horizontal' && (
          <SplitLayout orientation="horizontal" />
        )}
        {iframeLayoutStore.currentMode === 'split-vertical' && (
          <SplitLayout orientation="vertical" />
        )}
      </main>

      <AddIframeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddIframe}
      />

      <EditIframeModal
        iframe={iframeLayoutStore.editingIframeId ? iframeLayoutStore.orderedIframes.find((i) => i.id === iframeLayoutStore.editingIframeId) || null : null}
        isOpen={!!iframeLayoutStore.editingIframeId}
        onClose={() => iframeLayoutStore.closeEditModal()}
        onSave={handleEditIframe}
      />
    </div>
  );
});
