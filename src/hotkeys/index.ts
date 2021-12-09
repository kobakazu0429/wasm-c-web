import tinykeys from "tinykeys";
import debounce from "just-debounce-it";
import { saveCode as saveCodeStorage } from "./../localStorage/index";
import { formatCode, getCode, newFile as newFileFn } from "../editor/utils";
import { compile } from "../runners/compile";
import { run } from "../runners/exec";
import { test } from "../runners/test";
import { normalToast } from "./../toast/index";

// from https://github.com/jamiebuilds/tinykeys/blob/main/README.md
// There is also a special $mod modifier that makes it easy to support cross platform keybindings:
// Mac: $mod = Meta (⌘)
// Windows/Linux: $mod = Control
const KEYS = {
  MOD: "$mod",
  ALT: "Alt",
  SHIFT: "Shift",
  SPACE: "Space",
  ENTER: "Enter",
  ESCAPE: "Escape",
} as const;

const joinKeyBinding = (keys: string[]) => keys.join("+");

const debouncer = (fn: Function) => {
  return debounce(fn, 500, true);
};

const saveCode = debouncer(() => {
  const { filename, value } = getCode();
  saveCodeStorage(filename ?? "main.c", value ?? "");
  normalToast("Saved code !");
});

const newFile = debouncer(() => {
  newFileFn();
  normalToast("New File !");
});

export const registerHotkeys = () => {
  return tinykeys(window, {
    // save code
    [joinKeyBinding([KEYS.MOD, "s"])]: async (e) => {
      e.preventDefault();
      await formatCode();
      saveCode();
    },

    // new file
    [joinKeyBinding([KEYS.MOD, "b"])]: (e) => {
      e.preventDefault();
      newFile();
    },

    // compile
    [joinKeyBinding([KEYS.MOD, KEYS.SHIFT, "c"])]: (e) => {
      e.preventDefault();
      compile();
    },

    // compile and run
    [joinKeyBinding([KEYS.MOD, KEYS.ENTER])]: (e) => {
      e.preventDefault();
      run();
    },

    // test
    [joinKeyBinding([KEYS.MOD, KEYS.SHIFT, "l"])]: (e) => {
      e.preventDefault();
      test();
    },
  });
};
