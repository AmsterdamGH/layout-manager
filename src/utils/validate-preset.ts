import type { Preset } from '@/types/layout';

export function validatePreset(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return 'Invalid preset data';
  }
  const preset = data as Partial<Preset>;
  if (!preset.name || typeof preset.name !== 'string') {
    return 'Preset must have a name';
  }
  if (preset.mode && !['layout-grid', 'layout-horizontal', 'layout-vertical'].includes(preset.mode)) {
    return 'Invalid layout mode';
  }
  if (preset.iframes && !Array.isArray(preset.iframes)) {
    return 'Iframes must be an array';
  }
  if (preset.order && !Array.isArray(preset.order)) {
    return 'Order must be an array';
  }
  return null;
}
