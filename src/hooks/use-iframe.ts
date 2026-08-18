import { useState, useEffect, useCallback } from 'react';

type IframeState = 'loading' | 'loaded' | 'error';

interface UseIframeResult {
  state: IframeState;
  error: string | null;
  onLoad: () => void;
  onError: (error: string) => void;
}

export const useIframe = (url: string): UseIframeResult => {
  const [state, setState] = useState<IframeState>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setState('loading');
    setError(null);
  }, [url]);

  const onLoad = useCallback(() => {
    setState('loaded');
  }, []);

  const onError = useCallback((errorMessage: string) => {
    setState('error');
    setError(errorMessage);
  }, []);

  return { state, error, onLoad, onError };
};
