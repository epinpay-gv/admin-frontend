export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const fetcher = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};