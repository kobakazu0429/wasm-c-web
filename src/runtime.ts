import { WASI } from "@wasmer/wasi";
import { lowerI64Imports } from "@wasmer/wasm-transformer";
import { WasmFs } from "@wasmer/wasmfs";
import * as Asyncify from "asyncify-wasm";
import type { Node } from "memfs/lib/node";

import { get } from "svelte/store";
import { settings as _settings } from "./store";

const readLine = async () => {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve("10\n4\n"), 1000);
  });
};

export const startWasiTask = async (
  wasmBinary: any,
  consolePrintln: any
  // readLine: () => Promise<string>
) => {
  const wasmFs = new WasmFs();
  // const ioDevices = new IoDevices(wasmFs);

  let readStdinCounter = 0;
  const stdinRead = async (
    stdinBuffer: any,
    _off: any,
    _len: any,
    _pos: any,
    input: string
  ) => {
    // Per the C API, first read should be the string
    // Second read would be the end of the string
    if (readStdinCounter % 2 !== 0) {
      readStdinCounter++;
      return 0;
    }
    // Use window.prompt to synchronously get input from the user
    // This will block the entire main thread until this finishes.
    // To do this more clean-ly, it would be best to use a Web Worker
    // and Shared Array Buffer. And use prompt as a fallback
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer
    // https://github.com/wasmerio/wasmer-js/blob/master/packages/wasm-terminal/src/process/process.ts#L174

    // const sab = new SharedArrayBuffer(8);
    // const s32ar = new Int32Array(sab);
    // Atomics.wait(s32ar, 0, 0, 100); // 100ms待つ
    // let input = "10\n3\n";
    console.log("input", input);

    if (!input.endsWith("\n")) input += "\n";

    const buffer = new TextEncoder().encode(input);
    for (let x = 0; x < buffer.length; ++x) {
      stdinBuffer[x] = buffer[x]!;
    }

    return buffer.length;
  };

  // Assign all reads to fd 0 (in this case, /dev/stdin) to our custom function

  const stdoutWrite: Node["write"] = (buf, _off, len, _pos) => {
    const string = new TextDecoder().decode(buf);
    console.log(string);
    consolePrintln(string);
    return len!;
  };

  // @ts-expect-error
  wasmFs.volume.fds[0]!.node.read = (...args: any) => {
    readLine().then((input) => {
      console.log(args, input);
      // @ts-expect-error
      stdinRead(...args, input);
    });
  };
  wasmFs.volume.fds[1]!.node.write = stdoutWrite;

  const settings = get(_settings);
  const args = settings.argvs.map((a) => a.value);
  const env = Object.fromEntries(settings.env.map((e) => [e.key, e.value]));
  console.log(WASI.defaultBindings);

  const wasi = new WASI({
    preopenDirectories: {},
    args,
    env,
    bindings: {
      ...WASI.defaultBindings,
      fs: wasmFs.fs,
    },
  });

  const lowered_wasm = await lowerI64Imports(wasmBinary);
  const module = await WebAssembly.compile(lowered_wasm);
  console.log(wasi.getImports(module));
  const instance = await Asyncify.instantiate(module, {
    ...wasi.getImports(module),
  });

  // console.log(wasi);
  // console.log(instance);

  wasi.start(instance);

  const stdout = await wasmFs.getStdOut();
  console.log(stdout);
};
