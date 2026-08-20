import {
  iframeLayoutStore,
  modalStore,
  presetStore,
} from '@/stores'
import { X } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import {
  useEffect,
  useState,
} from 'react'

export const EditPresetModal = observer(() => {
  const [name, setName] = useState(() => modalStore.editingPreset?.name || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (modalStore.isEditPresetModalOpen) {
      const preset = modalStore.editingPreset;
      const mode = modalStore.presetModalMode;
      setName(mode === 'edit' && preset ? preset.name : mode === 'clone' && preset ? `${preset.name} (copy)` : '');
      setError(null);
    }
  }, [modalStore.isEditPresetModalOpen, modalStore.editingPreset?.name]);

  const currentMode = modalStore.presetModalMode;
  const title = currentMode === 'clone' ? 'Clone Preset' : currentMode === 'edit' ? 'Edit Preset' : 'New Preset';
  const submitLabel = currentMode === 'clone' ? 'Clone' : currentMode === 'edit' ? 'Save' : 'Create';

  const handleClose = () => {
    modalStore.closeEditPresetModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        if (currentMode === 'edit' && modalStore.editingPresetId) {
          const preset = presetStore.presets.get(modalStore.editingPresetId!);
          if (preset) {
            preset.name = name.trim();
            preset.mode = modalStore.editingPreset?.mode || 'layout-grid';
            presetStore.savePresets();
          }
        } else if (currentMode === 'clone' && modalStore.editingPresetId) {
          iframeLayoutStore.preset = presetStore.createPreset(name.trim(), { mode: modalStore.editingPreset?.mode || 'layout-grid' });
        } else if (currentMode === 'create') {
          iframeLayoutStore.preset = presetStore.createPreset(name.trim(), { mode: 'layout-grid' });
        }
        modalStore.closeEditPresetModal();
        setName('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit preset');
      }
    }
  };

  if (!modalStore.isEditPresetModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-gray-900 dark:text-gray-100">
          <div>
            <label htmlFor="preset-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preset Name
            </label>
            <input
              id="preset-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Enter preset name"
              className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                error ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});
