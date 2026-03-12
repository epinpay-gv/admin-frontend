import { Blog } from "@/features/blog/types";
import { MOCK_BLOGS } from "@/mocks/blog";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ article: string }> }
) {
  const { article } = await params;
  const blog = MOCK_BLOGS.find((b) => b.id === Number(article));

  if (!blog) {
    return NextResponse.json({ message: "Blog bulunamadı." }, { status: 404 });
  }

  return NextResponse.json<Blog>(blog);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ article: string }> }
) {
  const { article } = await params;
  const body = await req.json();
  const index = MOCK_BLOGS.findIndex((b) => b.id === Number(article));

  if (index === -1) {
    return NextResponse.json({ message: "Blog bulunamadı." }, { status: 404 });
  }

  const updated = { ...MOCK_BLOGS[index], ...body };
  MOCK_BLOGS[index] = updated;

  return NextResponse.json<Blog>(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ article: string }> }
) {
  const { article } = await params;
  const index = MOCK_BLOGS.findIndex((b) => b.id === Number(article));

  if (index === -1) {
    return NextResponse.json({ message: "Blog bulunamadı." }, { status: 404 });
  }

  MOCK_BLOGS.splice(index, 1);
  return NextResponse.json({ message: "Blog silindi." });
}