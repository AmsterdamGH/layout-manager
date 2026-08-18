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
