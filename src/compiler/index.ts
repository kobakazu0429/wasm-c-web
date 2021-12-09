import { _ } from "../i18n";
import type { STATUS_CODE } from "../runners/status";
import { compileLogOut } from "../store";

type Response =
  | {
      code: typeof STATUS_CODE.OK;
      binary: BufferSource;
    }
  | {
      code: typeof STATUS_CODE.ERROR | typeof STATUS_CODE.UNKNOWN;
      message: string;
    };

export async function compiler(src: string) {
  compileLogOut(_("compiler.start"));

  const param = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ src }),
  };

  const res = await (
    await fetch(`${import.meta.env.VITE_API_SERVER_URL}/compile`, param)
  ).json();

  compileLogOut(_("compiler.finished"));

  return res as Response;
}
