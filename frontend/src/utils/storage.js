import { load } from '@tauri-apps/plugin-store';

let storeInstance = null;
const STORE_NAME = 'settings.json';

const isTauri = () => {
  return typeof window !== 'undefined' && (window.__TAURI_INTERNALS__ !== undefined || window.__TAURI__ !== undefined);
};

const getStore = async () => {
  if (!storeInstance && isTauri()) {
    storeInstance = await load(STORE_NAME, { autoSave: false });
  }
  return storeInstance;
};

export const storage = {
  async getItem(key) {
    if (isTauri()) {
      const store = await getStore();
      return await store.get(key);
    }
    return localStorage.getItem(key);
  },
  
  async setItem(key, value) {
    if (isTauri()) {
      const store = await getStore();
      await store.set(key, value);
      await store.save();
      return;
    }
    localStorage.setItem(key, value);
  },
  
  async removeItem(key) {
    if (isTauri()) {
      const store = await getStore();
      await store.delete(key);
      await store.save();
      return;
    }
    localStorage.removeItem(key);
  }
};
