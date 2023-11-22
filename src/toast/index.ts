import { toast } from "@zerodevx/svelte-toast";

export const normalToast = (msg: string) => {
  toast.push(msg);
};

export const greenToast = (msg: string) => {
  toast.push(msg, {
    theme: {
      "--toastBackground": "#48BB78",
      "--toastBarBackground": "#2F855A"
    }
  });
};

export const redToast = (msg: string) => {
  toast.push(msg, {
    theme: {
      "--toastBackground": "#F56565",
      "--toastBarBackground": "#C53030"
    }
  });
};
