import * as Comlink from "comlink";
import { startWasiTask } from "../runtime";

Comlink.expose(startWasiTask);
