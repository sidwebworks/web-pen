import { useDeferredValue, useMemo, useRef, useState } from "react";

import type Fuse from "fuse.js";

function useFuseSearch<T>(list: T[], options?: Fuse.IFuseOptions<T>) {
  const [state, setState] = useState<T[]>([]);
  const instance = useRef<Fuse<T> | null>(null);

  const filter = useDeferredValue(state);

  const handleChange = async (q: string) => {
    if (!instance.current) {
      const Fuse = (await import("fuse.js")).default;
      instance.current = new Fuse<T>(list, options);
    }

    const result = instance.current.search(q).map((el) => el.item);

    setState(result);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(
    () => ({ handleChange, state: filter, setList: setState }),
    [filter, list]
  );
}

export default useFuseSearch;
