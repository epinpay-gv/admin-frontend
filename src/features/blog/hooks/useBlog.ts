"use client";

import { useEffect, useState } from "react";
import { BlogDetail } from "../types/blog.types";
import { blogService } from "../service/blog.service";

export function useBlog(id: string | null) {
  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    setLoading(true);
    blogService
      .getById(id)
      .then(setBlog)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { blog, loading, error };
}