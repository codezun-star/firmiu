export type ToastType = "success" | "error" | "info" | "warning";

function dispatch(message: string, type: ToastType, duration?: number) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("firmiu:toast", { detail: { message, type, duration } })
  );
}

export const toast = {
  success: (message: string, duration?: number) => dispatch(message, "success", duration),
  error:   (message: string, duration?: number) => dispatch(message, "error",   duration),
  info:    (message: string, duration?: number) => dispatch(message, "info",    duration),
  warning: (message: string, duration?: number) => dispatch(message, "warning", duration),
};
