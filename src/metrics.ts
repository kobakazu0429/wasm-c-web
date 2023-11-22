import { getUser } from "./localStorage/index";
type MetricsType =
  | "header.new_file"
  | "header.compile"
  | "header.run"
  | "header.test"
  | "header.format"
  | "header.download"
  | "header.fullscreen_editor"
  | "header.setting";

export const metricsSend = async (type: MetricsType) => {
  const user = getUser();

  const res = await fetch(import.meta.env.VITE_METRICS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user,
      metrics: {
        type,
      },
    }),
  });

  console.log(await res.json());
};
