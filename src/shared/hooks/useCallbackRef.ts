import { useRef, useEffect, useCallback } from 'react';

type FN = (...args: any[]) => any;

export const useCallbackRef = <T extends FN>(
  fn: T | undefined,
  deps: any[] = [],
): T => {
  const ref = useRef(fn);

  useEffect(() => {
    ref.current = fn;
  });

  return useCallback(((...args) => {
    ref.current?.(...args);
  }) as T, deps);
};
