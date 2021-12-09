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
  console.log("compile start");
  compileLogOut("compile start");

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

  console.log("compiled");
  compileLogOut("compiled");

  return res as Response;
}
