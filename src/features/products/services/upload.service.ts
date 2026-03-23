import { FetcherError } from "@/lib/api/types";

export interface UploadResponse {
  url: string;
  fileName: string;
  size: number;
  type: string;
}

function createUploadError(message: string, statusCode: number, code?: string): FetcherError {
  const error = new Error(message) as FetcherError;
  error.statusCode = statusCode;
  error.code = code;
  return error;
}
// Bu servis FormData kullanarak görsel yükleme işlemi yapıyor 
// BaseFetcher ise Json ile işlem yapıyor.
// Bu sebeple bu serviste fetch kullanıyoruz. Hata yönetimi için özel bir hata oluşturma fonksiyonu eklendi.
export const uploadService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    let response: Response;

    try {
      response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
    } catch {
      throw createUploadError(
        "Sunucuya bağlanılamadı.",
        0,
        "NETWORK_ERROR"
      );
    }

    let json: unknown;

    try {
      json = await response.json();
    } catch {
      throw createUploadError(
        "Sunucudan geçersiz yanıt alındı.",
        response.status,
        "INVALID_JSON"
      );
    }

    if (!response.ok) {
      const err = json as { message?: string; code?: string };
      throw createUploadError(
        err.message ?? "Görsel yüklenemedi.",
        response.status,
        err.code
      );
    }

    return json as UploadResponse;
  },
};