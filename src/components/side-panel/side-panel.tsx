import { observer } from 'mobx-react-lite';
import { X, Pencil, Save } from 'lucide-react';
import { LayoutSwitcher } from '../layout/layout-switcher';
import { AddIframeButton } from '../toolbar/add-iframe-button';
import { iframeLayoutStore } from '@/stores';
import type { LayoutMode, AppMode } from '@/types/layout';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: LayoutMode;
  onModeChange: (mode: LayoutMode) => void;
  onAddIframe: () => void;
}

export const SidePanel = observer(({
  isOpen,
  onClose,
  currentMode,
  onModeChange,
  onAddIframe,
}: SidePanelProps) => {
  const appMode: AppMode = iframeLayoutStore.appMode;
  const handlePanelMouseEnter = () => {
    iframeLayoutStore.setHoveringLeftEdge(true);
  };

  const handlePanelMouseLeave = () => {
    iframeLayoutStore.setHoveringLeftEdge(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Panel */}
      <aside
        onMouseEnter={handlePanelMouseEnter}
        onMouseLeave={handlePanelMouseLeave}
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'transform-translate-x-0' : 'transform-translate-x--full'}`}
        role="dialog"
        aria-label="Navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h1 className="text-lg font-semibold text-gray-900">Layout Manager</h1>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Layout Mode */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Layout Mode
            </label>
            <LayoutSwitcher
              currentMode={currentMode}
              onChange={onModeChange}
            />
          </div>

          {/* Add Iframe */}
          <div className="space-y-2">
            <AddIframeButton onClick={onAddIframe} />
          </div>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          {/* Edit/View Mode Toggle */}
          <button
            onClick={() => iframeLayoutStore.toggleAppMode()}
            className="w-full px-3 py-1.5 text-sm font-medium rounded-md transition-colors bg-gray-500 text-white hover:bg-gray-600 flex items-center justify-center"
            aria-label={appMode === 'edit' ? 'Switch to view mode' : 'Switch to edit mode'}
          >
            {appMode === 'edit' ? <Save className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
          </button>
        </div>
      </aside>
    </>
  );
});
