import type { RecoveryCode } from "./editor/utils";
import { navigate } from "svelte-routing";
import { compressLzString } from "./compression";

export const resetUrl = () => {
  navigate("");
};

export const rewriteUrlParams = (params: Array<["data", string]>) => {
  navigate(`/?${params.map((p) => p.join("=")).join("&")}`);
};

};
