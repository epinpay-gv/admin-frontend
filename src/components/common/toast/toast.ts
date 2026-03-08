import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message: string, description?: string) =>
    sonnerToast.success(message, {
      description,
      style: {
        borderLeft: "3px solid #00C6A2",
      },
    }),

  error: (message: string, description?: string) =>
    sonnerToast.error(message, {
      description,
      style: {
        borderLeft: "3px solid #FF5050",
      },
    }),

  warning: (message: string, description?: string) =>
    sonnerToast.warning(message, {
      description,
      style: {
        borderLeft: "3px solid #FFB400",
      },
    }),

  info: (message: string, description?: string) =>
    sonnerToast.info(message, {
      description,
      style: {
        borderLeft: "3px solid #0085FF",
      },
    }),

  loading: (message: string) =>
    sonnerToast.loading(message),

  dismiss: (id?: string | number) =>
    sonnerToast.dismiss(id),
};