import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { SidePanel } from './components/side-panel/side-panel';
import { GridLayout } from './components/layout/grid-layout';
import { SplitLayout } from './components/layout/split-layout';
import { EditIframeModal } from './components/modals/edit-iframe-modal';
import { EditPresetModal } from './components/modals/edit-preset-modal';
import { ExportPresetModal } from './components/modals/export-preset-modal';
import { ImportPresetModal } from './components/modals/import-preset-modal';
import DeletePresetModal from './components/modals/delete-preset-modal';
import { iframeLayoutStore, modalStore } from './stores';


export const App = observer(() => {
  useEffect(() => {
    return () => {
      iframeLayoutStore.dispose();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (modalStore.isAnyModalOpen) {
          modalStore.closeAllModals();
        } else if (iframeLayoutStore.sidePanelOpen) {
          iframeLayoutStore.closeSidePanel();
        } else {
          iframeLayoutStore.openSidePanel();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.title = iframeLayoutStore.orderedIframes.map((i) => i.title).join(' | ') || 'Layout Manager';
  }, [iframeLayoutStore.orderedIframes]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <SidePanel
        isOpen={iframeLayoutStore.sidePanelOpen}
        onClose={() => iframeLayoutStore.closeSidePanel()}
        currentMode={iframeLayoutStore.currentMode}
        onModeChange={(mode) => iframeLayoutStore.switchLayout(mode)}
      />

      <main className="flex-1 p-2 overflow-auto">

        {iframeLayoutStore.currentMode === 'layout-grid' && <GridLayout />}
        {iframeLayoutStore.currentMode === 'layout-horizontal' && (
          <SplitLayout orientation="horizontal" />
        )}
        {iframeLayoutStore.currentMode === 'layout-vertical' && (
          <SplitLayout orientation="vertical" />
        )}
      </main>

      <EditIframeModal />
      <EditPresetModal />
      <ExportPresetModal />
      <ImportPresetModal />
      <DeletePresetModal />
    </div>
  );
});
