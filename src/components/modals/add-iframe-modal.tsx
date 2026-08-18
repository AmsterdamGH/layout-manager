import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { validateUrl } from '@/utils/validation';

interface AddIframeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, title: string) => void;
}

export function AddIframeModal({ isOpen, onClose, onSubmit }: AddIframeModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

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

    onSubmit(url.trim(), title.trim() || url.trim());
    setUrl('');
    setTitle('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="dialog" aria-modal="true">
      <div className="w-full max-w-md mx-4 p-6 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add Iframe</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="url"
            label="URL"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            placeholder="https://example.com"
            error={error || undefined}
            required
          />
          
          <Input
            id="title"
            label="Title (optional)"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Iframe"
          />
          
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Iframe</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
