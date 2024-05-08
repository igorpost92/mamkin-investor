import { useEffect, useRef } from 'react';

export const useUpdate = (callback: () => void, deps?: any[]) => {
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    callback();
  }, deps);
};
