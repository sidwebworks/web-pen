import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const useEventListener = <T extends keyof WindowEventMap>(
  name: T,
  handler: (data: WindowEventMap[T]) => void,
  target?: Window
) => {
  useEffect(() => {
    const _target = target || window;

    _target.addEventListener(name, handler);

    return () => {
      _target.removeEventListener(name, handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export const isSSR = typeof document === "undefined";

export const useIsomorphicEffect = isSSR ? useEffect : useLayoutEffect;

export const useLocalContext = <T>(data: T) => {
  const ctx = useRef<T>(data);
  ctx.current = data;
  return ctx;
};

export const useDomElement = (selector: string) => {
  const [element, setElement] = useState<HTMLElement | null>();

  useIsomorphicEffect(() => {
    const elem = document.querySelector<HTMLElement>(selector);
    if (elem) {
      setElement(elem);
    }
  }, [selector]);

  return element;
};
