import type { RecoveryCode } from "./editor/utils";
import { navigate } from "svelte-routing";
import { compressLzString } from "./compression";

export const resetUrl = () => {
  navigate("");
};

export const rewriteUrlParams = (params: Array<["data", string]>) => {
  navigate(`/?${params.map((p) => p.join("=")).join("&")}`);
};

export const updateUrlParams = (params: Partial<RecoveryCode>) => {
  const currentParams = new URLSearchParams(window.location.search);
  const currentLzString = currentParams.get("data");
  if (currentLzString) {
    const currentLz: Partial<RecoveryCode> = JSON.parse(currentLzString);
    const updateParams = compressLzString(
      JSON.stringify({ ...currentLz, ...params })
    );
    rewriteUrlParams([["data", updateParams]]);
  } else {
    const updateParams = compressLzString(JSON.stringify(params));
    rewriteUrlParams([["data", updateParams]]);
  }
};
