import { useState, useRef, useCallback } from 'react';
import { iframeLayoutStore, modalStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import { X, Upload, Code, Loader2 } from 'lucide-react';
import { validatePreset } from '@/utils/validate-preset';

type ImportMode = 'text' | 'file';

export const ImportPresetModal = observer(() => {
  const [mode, setMode] = useState<ImportMode>('text');
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextImport = useCallback(() => {
    setError(null);
    if (!jsonInput.trim()) {
      setError('Please enter JSON data');
      return;
    }

    setIsLoading(true);
    try {
      const parsed = JSON.parse(jsonInput);
      const validationError = validatePreset(parsed);
      if (validationError) {
        setError(validationError);
        return;
      }

      const name = parsed.name ?? `Imported-${Date.now()}`;
      iframeLayoutStore.createPreset(name, parsed);
      modalStore.closeImportPresetModal();
      setJsonInput('');
      setError(null);
    } catch (err) {
      setError('Invalid JSON format or import failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [jsonInput, validatePreset]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        const validationError = validatePreset(parsed);
        if (validationError) {
          setError(validationError);
          return;
        }

        const name = parsed.name ?? `Imported-${Date.now()}`;
        iframeLayoutStore.createPreset(name, parsed);
        modalStore.closeImportPresetModal();
        setError(null);
      } catch (err) {
        setError('Invalid JSON file format or import failed');
        console.error(err);
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.onerror = () => {
      setError('Failed to read file');
      setIsLoading(false);
    };
    reader.readAsText(file);
  }, [validatePreset]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextImport();
    }
  }, [handleTextImport]);

  if (!modalStore.importPresetModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={() => modalStore.closeImportPresetModal()}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-h-[90vh] flex flex-col"
        role="dialog"
        aria-labelledby="import-preset-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 id="import-preset-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Import Preset
          </h2>
          <button
            onClick={() => modalStore.closeImportPresetModal()}
            className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2" role="tablist" aria-label="Import method">
            <button
              role="tab"
              aria-selected={mode === 'text'}
              onClick={() => setMode('text')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                mode === 'text'
                  ? 'bg-blue-500 dark:bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Code className="w-4 h-4" />
              Paste JSON
            </button>
            <button
              role="tab"
              aria-selected={mode === 'file'}
              onClick={() => setMode('file')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                mode === 'file'
                  ? 'bg-blue-500 dark:bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
          </div>

          {/* Text Input Mode */}
          {mode === 'text' && (
            <div className="space-y-2">
              <label htmlFor="preset-json" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Paste preset JSON
              </label>
              <textarea
                id="preset-json"
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='{"name": "My Preset", "mode": "layout-grid", "iframes": [], "order": []}'
                className="w-full h-48 px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none font-mono"
                aria-describedby="json-hint"
              />
              <p id="json-hint" className="text-xs text-gray-500 dark:text-gray-400">
                Paste the preset JSON exported from another layout or from the export dialog.
              </p>
            </div>
          )}

          {/* File Upload Mode */}
          {mode === 'file' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Upload preset JSON file
              </label>
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label="Click to upload preset file"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Preset file"
                />
                <Upload className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to select a JSON file
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  .json files only
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div
              className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 rounded-md border border-red-200 dark:border-red-800"
              role="alert"
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => modalStore.closeImportPresetModal()}
            className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          {mode === 'text' && (
            <button
              onClick={handleTextImport}
              disabled={isLoading || !jsonInput.trim()}
              className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:text-gray-500 dark:disabled:text-gray-400 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Import
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
