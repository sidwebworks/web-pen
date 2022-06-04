import { useCallback, useState } from "react";
import { useIsomorphicEffect } from "./use-isomorphic-effect";

type Dimensions = { width: number; height: number };

export const useWindowDimensions = (defaults?: Dimensions) => {
  const [dimensions, setDimensions] = useState<Dimensions>(() => {
    return defaults || { width: 500, height: 500 };
  });

  const changeHandler = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useIsomorphicEffect(() => {
    let timer: void | NodeJS.Timeout;

    changeHandler();

    window.addEventListener("resize", (e) => {
      e.stopPropagation();

      timer = setTimeout(async () => changeHandler(), 200);
    });

    return () => {
      if (timer) {
        timer = clearTimeout(timer);
      }
      window.removeEventListener("resize", (e) => {
        e.stopPropagation();
        if (timer) {
          timer = clearTimeout(timer);
        }
        timer = setTimeout(async () => changeHandler(), 200);
      });
    };
  }, [changeHandler]);

  return dimensions;
};
