"use client";

import { useEffect, useState } from "react";
import { Blog } from "../types/blog.types";
import { blogService } from "../service/blog.service";


export function useBlog(id: number) {
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        blogService
        .getById(id)
        .then(setBlog)
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    }, [id]);

    return {blog, loading, error}
}