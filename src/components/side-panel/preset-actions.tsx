import { observer } from 'mobx-react-lite';
import { Copy, Pencil, Trash2 } from 'lucide-react';

interface PresetActionsProps {
  presetId: string;
  presetName: string;
  onClone: (presetId: string) => void;
  onEdit: (presetId: string) => void;
  onDelete: (presetId: string, e: React.MouseEvent) => void;
}

export const PresetActions = observer(({
  presetId,
  presetName,
  onClone,
  onEdit,
  onDelete,
}: PresetActionsProps) => {
  const handleClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClone(presetId);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(presetId);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(presetId, e);
  };

  return (
    <>
      <button
        onClick={handleDelete}
        className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md transition-colors"
        aria-label={`Delete ${presetName}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <button
        onClick={handleClone}
        className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
        aria-label={`Clone ${presetName}`}
      >
        <Copy className="w-4 h-4" />
      </button>
      <button
        onClick={handleEdit}
        className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
        aria-label={`Edit ${presetName}`}
      >
        <Pencil className="w-4 h-4" />
      </button>
    </>
  );
});
