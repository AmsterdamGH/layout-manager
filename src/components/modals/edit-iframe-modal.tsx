import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { X } from 'lucide-react';
import { modalStore } from '@/stores';

export const EditIframeModal = observer(() => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (modalStore.editIframeModalOpen) {
      setUrl(modalStore.editingIframe?.url || '');
      setTitle(modalStore.editingIframe?.title || '');
      setError(null);
    }
  }, [modalStore.editIframeModalOpen, modalStore.editingIframe]);

  if (!modalStore.editIframeModalOpen) return null;

  const titleText = modalStore.iframeModalMode === 'edit' ? 'Edit Page' : 'Add Page';
  const submitLabel = modalStore.iframeModalMode === 'edit' ? 'Save Changes' : 'Add Page';

  const handleClose = () => {
    modalStore.closeEditIframeModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && title.trim()) {
      try {
        if (modalStore.editingIframe) {
          modalStore.updateIframe(url.trim(), title.trim());
        } else {
          modalStore.addIframe(url.trim(), title.trim());
        }
        modalStore.closeEditIframeModal();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save page');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{titleText}</h2>
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
            <label htmlFor="iframe-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Page URL
            </label>
            <input
              id="iframe-url"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              placeholder="https://example.com"
              className={`w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                error ? 'border-red-500 focus:ring-red-500' : ''
              }`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            )}
          </div>
          <div>
            <label htmlFor="iframe-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Page Title
            </label>
            <input
              id="iframe-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder="Page title"
              className="w-full px-3 py-2 text-sm rounded-md border focus:outline-none focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
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
              disabled={!url.trim() || !title.trim()}
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
