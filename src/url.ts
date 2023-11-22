import type { RecoveryCode } from "./editor/utils";
import { navigate } from "svelte-routing";
import { compressLzString, decompressLzString } from "./compression";

export const resetUrl = () => {
  navigate("/");
};

export const buildUrlParams = (params: Array<["data", string]>) => {
  return `/?${params.map((p) => p.join("=")).join("&")}`;
};

export const rewriteUrlParams = (params: Array<["data", string]>) => {
  navigate(buildUrlParams(params));
};

export const updateUrlParams = (params: Partial<RecoveryCode>) => {
  const currentParams = new URLSearchParams(window.location.search);
  const currentLzString = currentParams.get("data");
  if (currentLzString) {
    const currentLz: Partial<RecoveryCode> = JSON.parse(decompressLzString(currentLzString));
    const updateParams = compressLzString(JSON.stringify({ ...currentLz, ...params }));
    rewriteUrlParams([["data", updateParams]]);
  } else {
    const updateParams = compressLzString(JSON.stringify(params));
    rewriteUrlParams([["data", updateParams]]);
  }
};
