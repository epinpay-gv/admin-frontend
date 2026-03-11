"use client";

import { useEffect, useState } from "react";
import { Blog } from "../types";
import { blogService } from "../service/blog.service";

export function useBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        blogService
        .getAll()
        .then(setBlogs)
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    }, []);

    return {blogs, loading, error};


}