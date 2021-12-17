export type HeaderKey =
  | "name"
  | "functionName"
  | "arguments"
  | "returnValue"
  | "returnPrecision";

export type Row = Record<HeaderKey, any> & { id: string };
