import { get } from "svelte/store";
import screenfull from "screenfull";
import { editorRef } from "./../store";

export const enableFullScreenEditor = () => {
  if (!screenfull.isEnabled) {
    window.alert("このデバイスはフルスクリーンに対応していません。");
    return;
  }
  const ref = get(editorRef);
  if (!ref) return;
  screenfull.request(ref);
};
