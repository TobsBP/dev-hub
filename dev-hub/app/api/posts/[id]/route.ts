import { NextResponse } from "next/server";

const API_Base = process.env.API_BASE_URL;

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const response = await fetch(`${API_Base}/post/${id}`);
  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ error: `API retornou ${response.status}` }, { status: response.status });
  }
  const data = await response.json();
  return NextResponse.json(data, { status: 200 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const response = await fetch(`${API_Base}/post/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    return NextResponse.json({ error: `API retornou ${response.status}` }, { status: response.status });
  }
  const data = await response.json();
  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const response = await fetch(`${API_Base}/post/${id}`, { method: "DELETE" });
  if (!response.ok) {
    return NextResponse.json({ error: `API retornou ${response.status}` }, { status: response.status });
  }
  return new NextResponse(null, { status: 200 });
}
