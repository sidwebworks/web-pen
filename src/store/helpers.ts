import { createInstance } from "localforage";

export const createStorage = (key: string) => {
  const instance = createInstance({ name: key });

  return {
    async getItem<T>(key: string) {
      const found = await instance.getItem<T>(key);
      return found;
    },
    async setItem<T>(key: string, data: T) {
      await instance.setItem<T>(key, data);
      return true;
    },
    async removeItem<T>(key: string) {
      await instance.removeItem(key);
      return true;
    },
    async exists(key: string) {
      const exists = await instance.getItem(key);
      if (exists) return true;
      return false;
    },
  };
};
