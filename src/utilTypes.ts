import type { Readable } from "svelte/store";

export type UnReadable<T extends Readable<any>> = T extends Readable<infer P>
  ? P
  : never;
