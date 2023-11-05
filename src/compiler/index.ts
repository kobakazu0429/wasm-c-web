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

  const res = await (
    await fetch("/compile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ src }),
    })
  ).json();

  compileLogOut(_("compiler.finished"));

  return res as Response;
}
