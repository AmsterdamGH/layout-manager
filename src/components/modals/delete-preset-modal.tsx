import {
  iframeLayoutStore,
  modalStore,
  presetStore,
} from '@/stores'
import {
  AlertTriangle,
  X,
} from 'lucide-react'
import { observer } from 'mobx-react-lite'
import {
  useEffect,
  useState,
} from 'react'
import {
  removeHashPreset,
  setHashPreset,
} from '../../utils/hash.ts'

const DeletePresetModal = observer(() => {
  const [presetName, setPresetName] = useState('');

  useEffect(() => {
    if (modalStore.deletePresetModalOpen && modalStore.deletePresetId) {
      const preset = presetStore.getPresetById(modalStore.deletePresetId);
      setPresetName(preset?.name || 'Unknown');
    }
  }, [modalStore.deletePresetModalOpen, modalStore.deletePresetId]);

  if (!modalStore.deletePresetModalOpen) return null;

  const handleDelete = () => {
    if (!modalStore.deletePresetId) {
      return
    }
    presetStore.deletePreset(modalStore.deletePresetId)
    if (iframeLayoutStore.presetId === modalStore.deletePresetId) {
      iframeLayoutStore.preset = presetStore.getPresetList()[0]
    }
    modalStore.closeDeletePresetModal()
  };

  const handleClose = () => {
    modalStore.closeDeletePresetModal();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete Preset</h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4 text-gray-900 dark:text-gray-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p>Are you sure you want to delete "{presetName}"? This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});
export default DeletePresetModal
