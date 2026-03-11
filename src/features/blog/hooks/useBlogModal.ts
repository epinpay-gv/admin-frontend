"use client";

import { useState } from "react";
import { Blog } from "../types";

export function useBlogModal() {
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

    return {isOpen, selectedBlog, open, close};
}