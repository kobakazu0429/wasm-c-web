import store from "store2";

const joinKey = (keys: string | string[]) => {
  const PREFIX = "wasm_c_web";
  return [PREFIX, keys].flat().join("-");
};

const CODE_KEY = joinKey("auto_saved");
const VISITED_KEY = joinKey("visited");

interface SavedCode {
  timestamp: number;
  filename: string;
  code: string;
}

export const saveCode = (filename: string, data: string) => {
  store.local.set(CODE_KEY, {
    timestamp: Date.now(),
    filename,
    code: data,
  });
};

export const getPreviousCode = (): SavedCode | null => {
  return store.local.get(CODE_KEY);
};

export const clearCode = () => {
  store.local.remove(CODE_KEY);
};

export const visited = () => {
  store.local.set(VISITED_KEY, true);
};

export const isVisited = () => {
  return (store.local.get(VISITED_KEY) as boolean | null) ?? false;
};
