import { useRef } from "react";

export const useLocalContext = <T,>(data: T) => {
  const ctx = useRef<T>(data);
  ctx.current = data;
  return ctx;
};
