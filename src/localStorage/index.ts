import store from "store2";

const PREFIX = "wasm_c_web";
const KEY = "auto_saved";
const VISITED = `${PREFIX}-visited`;

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

export const visited = () => {
  store.local.set(VISITED, true);
};

export const isVisited = () => {
  return (store.local.get(VISITED) as boolean | null) ?? false;
};
