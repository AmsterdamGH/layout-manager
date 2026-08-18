import { AddIframeButton } from './add-iframe-button';
import { LayoutSwitcher } from '../layout/layout-switcher';
import type { LayoutMode } from '@/types/layout';

interface ToolbarProps {
  currentMode: LayoutMode;
  onModeChange: (mode: LayoutMode) => void;
  onAddIframe: () => void;
}

export function Toolbar({ currentMode, onModeChange, onAddIframe }: ToolbarProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900">Layout Manager</h1>
        <LayoutSwitcher currentMode={currentMode} onChange={onModeChange} />
      </div>
      <AddIframeButton onClick={onAddIframe} />
    </header>
  );
};
