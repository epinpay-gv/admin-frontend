export interface UploadResponse {
  url: string;
  fileName: string;
  size: number;
  type: string;
}

export const uploadService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message ?? "Görsel yüklenemedi.");
    }

    return res.json();
  },
};