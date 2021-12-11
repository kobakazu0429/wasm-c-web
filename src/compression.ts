import {
  decompressFromEncodedURIComponent,
  compressToEncodedURIComponent,
} from "lz-string";

export const compressLzString = (input: string): string => {
  return compressToEncodedURIComponent(input);
};

export const decompressLzString = (input: string): string => {
  return decompressFromEncodedURIComponent(input);
};
