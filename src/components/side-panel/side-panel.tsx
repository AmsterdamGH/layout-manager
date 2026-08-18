import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Pencil, Save, Sun, Moon, Download } from 'lucide-react';
import { LayoutSwitcher } from '../layout/layout-switcher';
import { EditPresetModal } from '../modals/edit-preset-modal';
import { ExportPresetModal } from '../modals/export-preset-modal';
import { PresetSelector } from './preset-selector';
import { IFrameList } from './iframe-list';
import { iframeLayoutStore } from '@/stores';
import { useTheme } from '@/providers/theme-provider';
import type { LayoutMode, AppMode, ModalMode } from '@/types/layout';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: LayoutMode;
  onModeChange: (mode: LayoutMode) => void;
}

export const SidePanel = observer(({
  isOpen,
  onClose,
  currentMode,
  onModeChange,
}: SidePanelProps) => {
  const [editPresetName, setEditPresetName] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const appMode: AppMode = iframeLayoutStore.appMode;
  const { theme, toggleTheme } = useTheme();

  const handlePanelMouseEnter = () => {
    iframeLayoutStore.setHoveringLeftEdge(true);
  };

  const handlePanelMouseLeave = () => {
    iframeLayoutStore.setHoveringLeftEdge(false);
  };

  const handleEditSubmit = (name: string) => {
    if (name.trim()) {
      if (modalMode === 'edit' && iframeLayoutStore.currentPresetId) {
        iframeLayoutStore.editPresetName(iframeLayoutStore.currentPresetId!, name.trim());
      } else if (modalMode === 'clone' && iframeLayoutStore.currentPresetId) {
        iframeLayoutStore.clonePreset(iframeLayoutStore.currentPresetId!, name.trim());
      } else if (modalMode === 'create') {
        iframeLayoutStore.createPreset(name.trim(), {
          mode: 'layout-grid',
          iframes: [],
          order: [],
        });
      }
      iframeLayoutStore.closeEditPresetModal();
      setEditPresetName('');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Panel */}
      <aside
        onMouseEnter={handlePanelMouseEnter}
        onMouseLeave={handlePanelMouseLeave}
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-800 shadow-xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'transform-translate-x-0' : 'transform-translate-x--full'}`}
        role="dialog"
        aria-label="Navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Layout Manager</h1>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-gray-900 dark:text-gray-100">
          {/* Presets */}
          <PresetSelector
            onClone={(presetId) => {
              if (presetId) {
                const preset = iframeLayoutStore.presetList.find((p) => p.id === presetId);
                setEditPresetName(preset ? `${preset.name} (copy)` : 'Preset (copy)');
                setModalMode('clone');
                iframeLayoutStore.openEditPresetModal();
              }
            }}
            onEdit={(presetId) => {
              const preset = iframeLayoutStore.presetList.find((p) => p.id === presetId);
              setEditPresetName(preset?.name || '');
              setModalMode('edit');
              iframeLayoutStore.openEditPresetModal();
            }}
            onCreate={() => {
              setEditPresetName('');
              setModalMode('create');
              iframeLayoutStore.openEditPresetModal();
            }}
          />

          {/* Layout Mode */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Layout Mode
            </label>
            <LayoutSwitcher
              currentMode={currentMode}
              onChange={onModeChange}
            />
          </div>

          {/* IFrame List */}
          <IFrameList />
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            {/* Edit/View Mode Toggle */}
            <button
              onClick={() => iframeLayoutStore.toggleAppMode()}
              className="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors bg-gray-500 dark:bg-gray-700 text-white dark:text-gray-100 hover:bg-gray-600 dark:hover:bg-gray-600 flex items-center justify-center"
              aria-label={appMode === 'edit' ? 'Switch to view mode' : 'Switch to edit mode'}
            >
              {appMode === 'edit' ? <Save className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
            </button>
            {/* Export Preset */}
            <button
              onClick={() => iframeLayoutStore.openExportModal()}
              className="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors bg-gray-500 dark:bg-gray-700 text-white dark:text-gray-100 hover:bg-gray-600 dark:hover:bg-gray-600 flex items-center justify-center"
              aria-label="Export preset as JSON"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
      <EditPresetModal
        isOpen={iframeLayoutStore.isEditPresetModalOpen}
        onClose={iframeLayoutStore.closeEditPresetModal}
        onSubmit={handleEditSubmit}
        initialName={editPresetName}
        mode={modalMode}
      />
      <ExportPresetModal
        isOpen={iframeLayoutStore.exportModalOpen}
        onClose={iframeLayoutStore.closeExportModal}
      />
    </>
  );
});
