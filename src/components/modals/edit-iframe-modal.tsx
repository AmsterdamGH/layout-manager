import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { Iframe } from '@/types/iframe';
import { validateUrl } from '@/utils/validation';

interface EditIframeModalProps {
  iframe: Iframe | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, url: string, title: string) => void;
}

export function EditIframeModal({ iframe, isOpen, onClose, onSave }: EditIframeModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (iframe) {
      setUrl(iframe.url);
      setTitle(iframe.title);
      setError(null);
    }
  }, [iframe]);

  if (!isOpen || !iframe) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('URL is required');
      return;
    }
    
    if (!validateUrl(url)) {
      setError('Please enter a valid HTTP or HTTPS URL');
      return;
    }

    onSave(iframe.id, url.trim(), title.trim() || url.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true">
      <div className="w-full max-w-md mx-4 p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Edit Iframe</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="edit-url"
            label="URL"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            error={error || undefined}
            required
          />
          
          <Input
            id="edit-title"
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
