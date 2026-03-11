import { Blog } from "@/features/blog/types";
import { MOCK_BLOGS } from "@/mocks/blog";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
  return NextResponse.json<Blog[]>(MOCK_BLOGS);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newBlog: Blog = { ...body, id: Date.now() };
  MOCK_BLOGS.push(newBlog);
  return NextResponse.json<Blog>(newBlog, { status: 201 });
}