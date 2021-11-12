import { get } from "svelte/store";
import screenfull from "screenfull";
import { editor, editorRef, editorPreviousSize } from "./../store";

export const enableFullScreenEditor = () => {
  if (!screenfull.isEnabled) {
    window.alert("このデバイスはフルスクリーンに対応していません。");
    return;
  }
  const ref = get(editorRef);
  if (!ref) return;
  storedEditorSize(ref);
  screenfull.request(ref);
};

export const setupFullscreenEditor = () => {
  screenfull.on("change", () => {
    if (!screenfull.isFullscreen) {
      undoEditorSize();
    }
  });
};

export const storedEditorSize = (ref: HTMLDivElement) => {
  const rect = ref.getBoundingClientRect();
  editorPreviousSize.set({ width: rect.width, height: rect.height });
};

export const undoEditorSize = () => {
  const size = get(editorPreviousSize);
  if (!size || size.width === 0 || size.height === 0) return;
  get(editor)?.layout(size);
};
