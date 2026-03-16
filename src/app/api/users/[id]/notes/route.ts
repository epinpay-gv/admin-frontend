

import { NextRequest, NextResponse } from "next/server";
import { AdminNote, AdminNotePayload } from "@/features/users/types";
import { mockAdminNotes } from "@/mocks/users";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  _req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;


  const notes = Number(id) === 1 ? mockAdminNotes : [];

  return NextResponse.json<AdminNote[]>(notes);
}

export async function POST(
  req: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params;
  const body: AdminNotePayload = await req.json();

  if (!body.content?.trim()) {
    return NextResponse.json({ message: "Not içeriği boş olamaz." }, { status: 400 });
  }

  const newNote: AdminNote = {
    id: Date.now(),
    content: body.content,
    createdBy: "admin@epinpay.com", 
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  mockAdminNotes.push(newNote);

  return NextResponse.json<AdminNote>(newNote, { status: 201 });
}