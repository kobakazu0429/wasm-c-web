import store from "store2";
import { ulid } from "ulid";
import type { Test } from "../test";
import { settings } from "../store";

const joinKey = (keys: string | string[]) => {
  const PREFIX = "wasm_c_web";
  return [PREFIX, keys].flat().join("-");
};

const CODE_KEY = joinKey("auto_saved");
const VISITED_KEY = joinKey("visited");
const USER_KEY = joinKey("user");
const LATEST_USER_VERSION = 1;
type UserV1 = {
  version: 1;
  id: string;
};
type User = UserV1;

interface SavedCode {
  timestamp: number;
  filename: string;
  code: string;
  tests?: Test[];
}

export const saveCodeStorage = (filename: string, data: string, tests?: Test[]) => {
  store.local.set(CODE_KEY, {
    timestamp: Date.now(),
    filename,
    code: data,
    tests
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
  if (store.local.has(USER_KEY)) {
    const user = store.local.get(USER_KEY) as User;
    switch (user.version) {
      case 1:
        store.local.set(USER_KEY, { ...user, version: LATEST_USER_VERSION });
    }
  } else {
    store.local.set(USER_KEY, {
      version: LATEST_USER_VERSION,
      id: import.meta.env.DEV ? "__I_AM_DEV_USER__" : ulid()
    });
  }

  const user = getUser();
  settings.update((self) => {
    const config = self.config.find((c) => c.key === "User ID");
    if (config) config.value = user.id;
    return self;
  });
};

export const isVisited = () => {
  return (store.local.get(VISITED_KEY) as boolean | null) ?? false;
};

export const getUser = (): User => {
  const user = store.local.get(USER_KEY);
  return user;
};

export const updateUser = (user: Partial<User>) => {
  const prevUser = getUser();
  const newUser: User = { ...prevUser, ...user };
  store.local.set(USER_KEY, newUser);
};
