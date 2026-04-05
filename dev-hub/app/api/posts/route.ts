import { NextResponse } from "next/server";

const API_Base = process.env.API_BASE_URL;

export async function GET() {
  if (!API_Base) {
    return NextResponse.json({ error: "API_BASE_URL não definida" }, { status: 500 });
  }

  const response = await fetch(`${API_Base}/posts`);

  if (!response.ok) {
    const text = await response.text();
    console.error("Erro da API:", response.status, text.slice(0, 200));
    return NextResponse.json({ error: `API retornou ${response.status}` }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
  if (!API_Base) {
    return NextResponse.json({ error: "API_BASE_URL não definida" }, { status: 500 });
  }

  const body = await request.json();
  const response = await fetch(`${API_Base}/post`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Erro da API:", response.status, text.slice(0, 200));
    return NextResponse.json({ error: `API retornou ${response.status}` }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: 201 }); // POST bem-sucedido → 201
}