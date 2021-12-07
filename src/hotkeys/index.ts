import tinykeys from "tinykeys";
import { toast } from "@zerodevx/svelte-toast";
import { saveCode as saveCodeStorage } from "./../localStorage/index";
import { getCode } from "../editor/utils";

// from https://github.com/jamiebuilds/tinykeys/blob/main/README.md
// There is also a special $mod modifier that makes it easy to support cross platform keybindings:
// Mac: $mod = Meta (⌘)
// Windows/Linux: $mod = Control

const MOD = "$mod";

const joinKeyBinding = (keys: string[]) => keys.join("+");

type KeyBinding = [keybinding: string, fn: (event: KeyboardEvent) => void];

const saveCode: KeyBinding = [
  joinKeyBinding([MOD, "s"]),
  (e) => {
    e.preventDefault();
    const { filename, value } = getCode();
    saveCodeStorage(filename ?? "main.c", value ?? "");
    toast.push("Saved code !");
  },
];

const newFile: KeyBinding = [
  joinKeyBinding([MOD, "n"]),
  (e) => {
    e.preventDefault();
  },
];

export const registerHotkeys = () => {
  tinykeys(window, Object.fromEntries([saveCode, newFile]));
};
