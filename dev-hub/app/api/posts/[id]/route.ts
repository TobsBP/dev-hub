import { NextResponse } from "next/server";

const API_Base = process.env.API_BASE_URL;

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const response = await fetch(`${API_Base}/post/${params.id}`);
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const response = await fetch(`${API_Base}/post/${params.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const response = await fetch(`${API_Base}/post/${params.id}`, {
    method: "DELETE",
  });
  return NextResponse.json({}, { status: response.status });
}