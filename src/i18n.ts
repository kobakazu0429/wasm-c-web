import { get } from "svelte/store";
import { addMessages, init, format } from "svelte-i18n";
import en from "./locales/en.json";
import ja from "./locales/ja.json";
import type { UnReadable } from "./utilTypes";

export const initI18n = () => {
  addMessages("en", en as any);
  addMessages("ja", ja as any);
  init({
    fallbackLocale: "en",
    initialLocale: "ja",
  });
};

export const _: UnReadable<typeof format> = (id, options) => {
  return get(format)(id, options);
};
