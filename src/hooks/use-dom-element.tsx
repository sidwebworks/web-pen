import { useState } from "react";
import { useIsomorphicEffect } from "./use-isomorphic-effect";

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
