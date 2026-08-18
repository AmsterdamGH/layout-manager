const HASH_KEY = 'preset';

export const getHashPreset = (): string | null => {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.slice(1);
  if (hash.startsWith(`${HASH_KEY}=`)) {
    return decodeURIComponent(hash.slice(HASH_KEY.length + 1));
  }
  return null;
};

export const setHashPreset = (presetName: string): void => {
  if (typeof window === 'undefined') return;
  const newHash = `#${HASH_KEY}=${encodeURIComponent(presetName)}`;
  if (window.location.hash !== newHash) {
    window.history.replaceState(null, '', newHash);
  }
};

export const removeHashPreset = (): void => {
  if (typeof window === 'undefined') return;
  const hash = window.location.hash;
  if (hash) {
    window.history.replaceState(null, '', hash.replace(/#preset=[^&]*/, ''));
  }
};
