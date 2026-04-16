"use client"
import { useEffect, useState, useCallback } from "react";
import { blogService } from "../service/blog.service";
import { BlogFilters, Blog, BlogListResponse } from "../types/blog.types";

export function useBlogs(filters: BlogFilters = {}) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState<BlogListResponse["pagination"]>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await blogService.getAll(filters);
      setBlogs(result.data);
      setPagination(result.pagination);
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Bloglar yüklenirken bir hata oluştu";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const open = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSelectedBlog(null);
  };

  return {
    blogs,
    pagination,
    loading,
    error,
    refresh: fetchBlogs,
    isOpen,
    selectedBlog,
    open,
    close,
  };
}