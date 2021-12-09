import { addMessages, init } from "svelte-i18n";

import en from "./locales/en.json";
import ja from "./locales/ja.json";

export const initI18n = () => {
  addMessages("en", en);
  addMessages("ja", ja);
  init({
    fallbackLocale: "en",
    initialLocale: "ja",
  });
};
