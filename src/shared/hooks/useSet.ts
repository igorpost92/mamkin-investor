import { useCallback, useMemo, useState } from 'react';

export const useSet = <T>(initial?: Set<T>) => {
  const [set, setSet] = useState(initial || new Set<T>());

  const stableActions = useMemo(() => {
    const add = (value: T) => {
      setSet(prev => new Set([...prev, value]));
    };

    const remove = (value: T) => {
      setSet(prev => {
        const newSet = new Set(prev);
        newSet.delete(value);
        return newSet;
      });
    };

    const toggle = (value: T) => {
      setSet(prev => {
        const newSet = new Set(prev);

        if (newSet.has(value)) {
          newSet.delete(value);
        } else {
          newSet.add(value);
        }

        return newSet;
      });
    };

    const reset = () => {
      setSet(initial || new Set());
    };

    const clear = () => {
      setSet(new Set());
    };

    return {
      add,
      remove,
      toggle,
      reset,
      clear,
    };
  }, [setSet]);

  const has = useCallback((value: T) => set.has(value), [set]);

  const actions = {
    ...stableActions,
    has,
  };

  return [set, actions] as const;
};
