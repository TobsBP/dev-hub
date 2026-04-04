import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${process.env.AUTH_BASE_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Erro no registro:", response.status, text.slice(0, 200));
    return NextResponse.json({ error: `Erro ${response.status}` }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: 201 });
}