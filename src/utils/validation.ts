export const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

export const generateId = (): string => {
  return `iframe-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const isValidPanelSize = (width: number, height: number): boolean => {
  return width > 0 && height > 0 && width <= 100 && height <= 100;
};
