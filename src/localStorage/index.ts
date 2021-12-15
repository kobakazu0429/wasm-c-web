import store from "store2";
import type { Tests } from "../jest";

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
  tests?: Tests;
}

export const saveCode = (filename: string, data: string, tests?: Tests) => {
  store.local.set(CODE_KEY, {
    timestamp: Date.now(),
    filename,
    code: data,
    tests,
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
