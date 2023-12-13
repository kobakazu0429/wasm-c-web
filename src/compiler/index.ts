import { _ } from "../i18n";
import { getUser } from "../localStorage";
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

  const userId = getUser()?.id;

  const res = await (
    await fetch(import.meta.env.VITE_COMPILER_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ src, userId })
    })
  ).json();

  compileLogOut(_("compiler.finished"));

  return res as Response;
}
