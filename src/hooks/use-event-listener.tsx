import { useEffect } from "react";

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
