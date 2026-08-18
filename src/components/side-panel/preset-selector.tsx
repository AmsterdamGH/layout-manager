import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Plus, Trash2, ChevronDown, Copy, Pencil } from 'lucide-react';
import { iframeLayoutStore } from '@/stores';

interface PresetSelectorProps {
  onClone: (presetId: string) => void;
  onEdit: (presetId: string) => void;
  onCreate: () => void;
}

const MAX_LISTBOX_PRESETS = 5;

export const PresetSelector = observer(({
  onClone,
  onEdit,
  onCreate,
}: PresetSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const presets = iframeLayoutStore.presetList;
  const currentPresetId = iframeLayoutStore.currentPresetId;
  const isListbox = presets.length < MAX_LISTBOX_PRESETS;

  const handleClonePreset = (presetId: string) => {
    if (presetId) {
      onClone(presetId);
    }
  };

  const handleCreatePreset = () => {
    onCreate();
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this preset?')) {
      iframeLayoutStore.deletePreset(id);
    }
  };

  const handleSelect = (presetId: string) => {
    iframeLayoutStore.switchPreset(presetId);
    if (!isListbox) {
      setIsOpen(false);
    }
  };

  const renderPresetItem = (preset: typeof presets[0]) => (
    <div
      key={preset.id}
      role="option"
      aria-selected={currentPresetId === preset.id}
      onClick={() => handleSelect(preset.id)}
      className={`px-3 py-2 text-sm flex items-center justify-between cursor-pointer ${
        currentPresetId === preset.id
          ? 'bg-blue-50 text-blue-900'
          : 'text-gray-900 hover:bg-gray-50'
      }`}
    >
      <span className="truncate">{preset.name}</span>
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => handleDeletePreset(preset.id, e)}
          className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          aria-label={`Delete ${preset.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleClonePreset(preset.id)}
          className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
          aria-label={`Clone ${preset.name}`}
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => onEdit(preset.id)}
          className="p-1 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
          aria-label={`Edit ${preset.name}`}
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const renderPresetList = () => (
    <div className="w-full">
      {presets.length === 0 && (
        <div className="px-3 py-2 text-sm text-gray-500">No presets</div>
      )}
      {presets.map(renderPresetItem)}
    </div>
  );

  const renderDropdown = () => (
    <div className="relative flex-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1.5 text-sm rounded-md border border-gray-300 bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">
          {currentPresetId ? presets.find((p) => p.id === currentPresetId)?.name || 'Select preset' : 'Select preset'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {renderPresetList()}
        </div>
      )}
    </div>
  );

  const renderListbox = () => (
    <div role="listbox" className="w-full space-y-1">
      {renderPresetList()}
    </div>
  );

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        Presets
      </label>
      <div className="flex items-center gap-1">
        {isListbox ? renderListbox() : renderDropdown()}
        <button
          onClick={handleCreatePreset}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-md transition-colors"
          aria-label="Create new preset"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
});
