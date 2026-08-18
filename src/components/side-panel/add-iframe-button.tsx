import { Plus } from 'lucide-react';

interface AddIframeButtonProps {
  onClick: () => void;
}

export function AddIframeButton({ onClick }: AddIframeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-900 text-white dark:text-blue-100 hover:bg-blue-700 dark:hover:bg-blue-800 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 transition-colors"
      aria-label="Add new iframe"
    >
      <Plus className="w-4 h-4" />
      <span className="text-sm font-medium">Add Page</span>
    </button>
  );
};
