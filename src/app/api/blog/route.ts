import { Blog, BLOG_TRANSLATION_STATUS } from "@/features/blog/types/blog.types";
import { MOCK_BLOGS } from "@/mocks/blog";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase();
  const status = searchParams.get("status");
  const sourceLanguage = searchParams.get("sourceLanguage");

  let filteredBlogs = [...MOCK_BLOGS];

  if (search) {
    filteredBlogs = filteredBlogs.filter((blog) => {
      return blog.translations.some(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.slug.toLowerCase().includes(search)
      );
    });
  }

  if (status && status !== "all") {
    filteredBlogs = filteredBlogs.filter((blog) => {
      const sourceTranslation = blog.translations.find(
        (t) => t.language === blog.sourceLanguage
      );
      return sourceTranslation?.status === status;
    });
  }

  if (sourceLanguage && sourceLanguage !== "all") {
    filteredBlogs = filteredBlogs.filter(
      (blog) => blog.sourceLanguage === sourceLanguage
    );
  }
  return NextResponse.json<Blog[]>(filteredBlogs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newBlog: Blog = { ...body, id: Date.now() };
  MOCK_BLOGS.push(newBlog);
  return NextResponse.json<Blog>(newBlog, { status: 201 });
}