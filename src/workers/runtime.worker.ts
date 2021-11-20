import * as Comlink from "comlink";
import { startWasiTask, testWasi } from "../runtime";

const exposed = { startWasiTask, testWasi };

Comlink.expose(exposed);

export type RuntimeWorkerExposes = typeof exposed;
