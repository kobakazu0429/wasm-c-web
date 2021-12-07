import tinykeys from "tinykeys";
import debounce from "just-debounce-it";
import { toast } from "@zerodevx/svelte-toast";
import { saveCode as saveCodeStorage } from "./../localStorage/index";
import { getCode, newFile } from "../editor/utils";

// from https://github.com/jamiebuilds/tinykeys/blob/main/README.md
// There is also a special $mod modifier that makes it easy to support cross platform keybindings:
// Mac: $mod = Meta (⌘)
// Windows/Linux: $mod = Control

const MOD = "$mod";

const joinKeyBinding = (keys: string[]) => keys.join("+");

type KeyBinding = [keybinding: string, fn: (event: KeyboardEvent) => void];

const saveCode = debounce(
  () => {
    const { filename, value } = getCode();
    saveCodeStorage(filename ?? "main.c", value ?? "");
    toast.push("Saved code !");
  },
  500,
  true
);

const saveCodeHotkey: KeyBinding = [
  joinKeyBinding([MOD, "s"]),
  (e) => {
    e.preventDefault();
    saveCode();
  },
];

const newFileHotkey: KeyBinding = [
  joinKeyBinding([MOD, "n"]),
  (e) => {
    e.preventDefault();
    newFile();
  },
];

export const registerHotkeys = () => {
  return tinykeys(window, Object.fromEntries([saveCodeHotkey, newFileHotkey]));
};
