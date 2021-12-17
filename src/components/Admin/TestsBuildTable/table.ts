export type HeaderKey =
  | "testName"
  | "functionName"
  | "argumentsValue"
  | "returnValue"
  | "returnPrecision";

export type Row = Record<HeaderKey, any> & { id: string };
