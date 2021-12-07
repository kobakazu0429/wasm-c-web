import tinykeys from "tinykeys";
import debounce from "just-debounce-it";
import { toast } from "@zerodevx/svelte-toast";
import { saveCode as saveCodeStorage } from "./../localStorage/index";
import { getCode, newFile as newFileFn } from "../editor/utils";

// from https://github.com/jamiebuilds/tinykeys/blob/main/README.md
// There is also a special $mod modifier that makes it easy to support cross platform keybindings:
// Mac: $mod = Meta (⌘)
// Windows/Linux: $mod = Control

const MOD = "$mod";

const joinKeyBinding = (keys: string[]) => keys.join("+");

const debouncer = (fn: Function) => {
  return debounce(fn, 500, true);
};

const saveCode = debouncer(() => {
  const { filename, value } = getCode();
  saveCodeStorage(filename ?? "main.c", value ?? "");
  toast.push("Saved code !");
});

const newFile = debouncer(() => {
  newFileFn();
  toast.push("New File !");
});

export const registerHotkeys = () => {
  return tinykeys(window, {
    // save code
    [joinKeyBinding([MOD, "s"])]: (e) => {
      e.preventDefault();
      saveCode();
    },

    // new file
    [joinKeyBinding([MOD, "b"])]: (e) => {
      e.preventDefault();
      newFile();
    },
  });
};
