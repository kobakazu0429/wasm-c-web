import { compileLogOut } from "../store";

type Response =
  | {
      code: 0;
      binary: BufferSource;
    }
  | {
      code: 10 | 90;
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
    await fetch("http://localhost:3001/compile", param)
  ).json();

  console.log("compiled");
  compileLogOut("compiled");

  return res as Response;
}
