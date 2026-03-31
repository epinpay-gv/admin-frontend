"use client";

import { useEffect, useState, useCallback } from "react";
import { Blog, BlogFilters } from "../types";
import { blogService } from "../service/blog.service";

export function useBlogs(filters: BlogFilters = {}) {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        try {    
            const data = await blogService.getAll(filters);
            setBlogs(data);
            setError(null);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Bloglar yüklenirken bir hata oluştu";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [filters]);
    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    return { 
        blogs, 
        loading, 
        error, 
        refresh: fetchBlogs
    };
}