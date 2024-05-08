import { useEffect, useRef, useState } from 'react';
import { useCallbackRef } from './useCallbackRef';

interface Params<T> {
  initialLoading?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

type PromiseResult<PromiseLike extends Promise<any>> = PromiseLike extends Promise<infer T>
  ? T
  : never;

export function usePromise<
  T extends (...args: any[]) => Promise<any>,
  R = PromiseResult<ReturnType<T>>,
>(fn: T, params?: Params<R>) {
  const [isLoading, setLoading] = useState(params?.initialLoading ?? false);
  const [data, setData] = useState<R>();
  const [error, setError] = useState<unknown>();

  const callIdRef = useRef(0);

  const send = async (...args: Parameters<T>) => {
    const currentId = ++callIdRef.current;

    setLoading(true);
    setData(undefined);
    setError(undefined);

    try {
      const result = await fn(...args);
      if (currentId !== callIdRef.current) {
        return;
      }

      setData(result);
      params?.onSuccess?.(result);
    } catch (e) {
      if (currentId !== callIdRef.current) {
        return;
      }

      setError(e);
      params?.onError?.(e);
    }

    setLoading(false);
  };

  // TODO: reset?

  const reset = useCallbackRef(() => {
    ++callIdRef.current;

    setLoading(false);
    setData(undefined);
    setError(undefined);
  });

  return { isLoading, data, error, send };
}

export function usePromiseOnMount<T extends () => Promise<any>, R = PromiseResult<ReturnType<T>>>(
  fn: T,
  params?: Params<R>,
) {
  const promise = usePromise(fn, {
    ...params,
    initialLoading: params?.initialLoading ?? true,
  });

  useEffect(() => {
    promise.send(...([] as Parameters<T>));
  }, []);

  return promise;
}
