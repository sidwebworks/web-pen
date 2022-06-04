import { useEffect, useLayoutEffect } from "react";

export const isSSR = typeof document === "undefined";

export const useIsomorphicEffect = isSSR ? useEffect : useLayoutEffect;
