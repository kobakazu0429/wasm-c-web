import { compileLogOut } from "./store";

export async function c2wasm(src: string) {
  console.log("sending...");
  compileLogOut("compile start");
  // excuteButton.disabled = true;

  const param = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ src }),
  };

  const { result, data } = await (
    await fetch("http://localhost:3001/c2wasm", param)
  ).json();

  console.log("compiled !");
  compileLogOut("compiled !");

  // console.log(result);
  // console.log(data);

  const binary = data.data as ArrayBuffer;
  const info = result as Record<string, string>;

  return { info, binary };
}
