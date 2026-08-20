import { debounce } from './debounce';
import { SAVE_DEBOUNCE_MS } from './constants';

const get = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Failed to load from localStorage (${key}):`, error);
    return null;
  }
};

const set = debounce((key: string, data: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error);
  }
}, SAVE_DEBOUNCE_MS);

const remove = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to clear localStorage (${key}):`, error);
  }
};

export { get, set, remove };
