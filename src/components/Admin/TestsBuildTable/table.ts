export type HeaderKey =
  | "name"
  | "functionName"
  | "arguments"
  | "return"
  | "returnPrecision";

export type Row = Record<HeaderKey, any> & { id: string };
