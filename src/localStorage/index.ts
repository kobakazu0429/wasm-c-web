import store from "store2";

const KEY = "auto_saved";

interface SavedCode {
  timestamp: number;
  filename: string;
  code: string;
}

export const saveCode = (filename: string, data: string) => {
  store.local.set(KEY, {
    timestamp: Date.now(),
    filename,
    code: data,
  });
};

export const getPreviousCode = (): SavedCode | null => {
  return store.local.get(KEY);
};

export const clearCode = () => {
  store.local.remove(KEY);
};
