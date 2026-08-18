import { Plus } from 'lucide-react';

interface AddIframeButtonProps {
  onClick: () => void;
}

export function AddIframeButton({ onClick }: AddIframeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 transition-colors"
      aria-label="Add new iframe"
    >
      <Plus className="w-4 h-4" />
      <span className="text-sm font-medium">Add Page</span>
    </button>
  );
};
