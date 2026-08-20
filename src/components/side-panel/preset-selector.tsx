import { useState, useEffect } from 'react';
import { iframeLayoutStore, modalStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import { Plus, ChevronDown, Upload } from 'lucide-react';
import { PresetActions } from './preset-actions';
import { getPresetUrl } from '@/utils/hash';

const MAX_LISTBOX_PRESETS = 5;

export const PresetSelector = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const presets = iframeLayoutStore.presetList;
  const currentPresetId = iframeLayoutStore.currentPresetId;
  const isListbox = presets.length < MAX_LISTBOX_PRESETS;

  const handleClonePreset = (presetId: string) => {
    if (presetId) {
      modalStore.openEditPresetModal('clone', presetId);
    }
  };

  const handleEditPreset = (presetId: string) => {
    if (presetId) {
      modalStore.openEditPresetModal('edit', presetId);
    }
  };

  const handleCreatePreset = () => {
    modalStore.openEditPresetModal('create');
    setIsOpen(false);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    modalStore.openDeletePresetModal(id);
  };

  const handleSelect = (presetId: string) => {
    iframeLayoutStore.switchPreset(presetId);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !e.target) return;
      const target = e.target as HTMLElement;
      const dropdown = document.querySelector('[data-dropdown="preset-selector"]');
      if (dropdown && !dropdown.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handlePresetClick = (presetId: string, e: React.MouseEvent) => {
    // Allow opening in new tab via right-click, middle-click, or ctrl/cmd+click
    if (e.button === 1 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
      return;
    }
    e.preventDefault();
    handleSelect(presetId);
  };

  const renderPresetItem = (preset: typeof presets[0]) => (
    <div
      key={preset.id}
      role="option"
      aria-selected={currentPresetId === preset.id}
      onClick={(e) => handlePresetClick(preset.id, e)}
      className={`px-3 py-2 text-sm flex items-center justify-between ${
        currentPresetId === preset.id
          ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200'
          : 'text-gray-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <a
        href={getPresetUrl(preset.name)}
        className="truncate hover:underline"
        title={`Open "${preset.name}" in new tab`}
      >
        {preset.name}
      </a>
      <div className="flex items-center gap-1">
        <PresetActions
          presetId={preset.id}
          presetName={preset.name}
          onClone={handleClonePreset}
          onEdit={handleEditPreset}
          onDelete={handleDeletePreset}
        />
      </div>
    </div>
  );

  const renderPresetList = () => (
    <div className="w-full text-gray-900 dark:text-gray-100">
      {presets.length === 0 && (
        <div className="px-3 py-2 text-sm text-gray-500">No presets</div>
      )}
      {presets.map(renderPresetItem)}
    </div>
  );

  const renderDropdown = () => {
    const currentPreset = currentPresetId ? presets.find((p) => p.id === currentPresetId) : null;
    return (
      <div className="relative flex-1" data-dropdown="preset-selector">
        <div
          onClick={() => setIsOpen(!isOpen)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent flex items-center justify-between cursor-pointer"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="truncate">
            {currentPresetId ? currentPreset?.name || 'Select preset' : 'Select preset'}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            {currentPreset && (
              <PresetActions
                presetId={currentPreset.id}
                presetName={currentPreset.name}
                onClone={handleClonePreset}
                onEdit={handleEditPreset}
                onDelete={handleDeletePreset}
              />
            )}
          </div>
        </div>
        {isOpen && (
          <div
            role="listbox"
            className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {renderPresetList()}
          </div>
        )}
      </div>
    );
  };

  const renderListbox = () => (
    <div role="listbox" className="w-full space-y-1">
      {renderPresetList()}
    </div>
  );

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Presets
      </label>
      <div className="space-y-1">
        {isListbox ? renderListbox() : renderDropdown()}
        <div className="flex gap-1">
          <button
            onClick={handleCreatePreset}
            className="flex-1 px-2 py-1.5 text-sm rounded-md transition-colors bg-gray-500 dark:bg-gray-700 text-white dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
            aria-label="Create new preset"
          >
            <Plus className="w-4 h-4" />
            New preset
          </button>
          <button
            onClick={() => modalStore.openImportPresetModal()}
            className="p-2 rounded-md transition-colors bg-gray-500 dark:bg-gray-700 text-white dark:text-gray-200 hover:bg-gray-600 dark:hover:bg-gray-600"
            aria-label="Import preset"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
