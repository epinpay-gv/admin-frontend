import { FetcherError } from "@/lib/api/types";

export interface UploadResponse {
  imageKey: string;
  imageUrl: string;
}

function createUploadError(message: string, statusCode: number, code?: string): FetcherError {
  const error = new Error(message) as FetcherError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
}

export const uploadService = {
  uploadImage: async (
    file: File,
    folder: "products" | "categories",
  ): Promise<UploadResponse> => {

    const base =  process.env.NEXT_PUBLIC_API_URL ?? "https://admin-gateway-ahj0yeia.ew.gateway.dev";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    // Strip extension for a clean R2 filename
    formData.append("name", file.name.replace(/\.[^.]+$/, ""));

    let response: Response;

    try {
      response = await fetch(`${base}/api/features/catalog/media/upload`, {
        method: "POST",
        body: formData,
        // DO NOT set Content-Type 
      });
    } catch {
      throw createUploadError("Sunucuya bağlanılamadı.", 0, "NETWORK_ERROR");
    }

    let json: unknown;
    try {
      json = await response.json();
    } catch {
      throw createUploadError(
        "Sunucudan geçersiz yanıt alındı.",
        response.status,
        "INVALID_JSON",
      );
    }

    if (!response.ok) {
      const err = json as { message?: string; code?: string };
      throw createUploadError(
        err.message ?? "Görsel yüklenemedi.",
        response.status,
        err.code,
      );
    }

    return json as UploadResponse;
  },
};