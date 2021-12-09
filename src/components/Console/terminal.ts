import { FitAddon } from "xterm-addon-fit";
import { LocalEchoAddon } from "@kobakazu0429/xterm-local-echo";

export const localEchoAddon = new LocalEchoAddon();
export const fitAddon = new FitAddon();

export const readLine = async () => {
  const input = (await localEchoAddon.read("")) as string;
  return input;
};
