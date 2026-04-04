import { NextResponse } from "next/server";

const API_Base = process.env.API_BASE_URL;

export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  if (!API_Base) {
    return NextResponse.json({ error: "API_BASE_URL não definida" }, { status: 500 });
  }

  const response = await fetch(`${API_Base}/user/${params.id}`);

  if (!response.ok) {
    const text = await response.text();
    console.error("Erro da API:", response.status, text.slice(0, 200));
    return NextResponse.json({ error: `API retornou ${response.status}` }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: 200 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!API_Base) {
    return NextResponse.json({ error: "API_BASE_URL não definida" }, { status: 500 });
  }

  // Também multipart/form-data — repassa direto
  const formData = await request.formData();
  const response = await fetch(`${API_Base}/user/${params.id}`, {
    method: "PATCH",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Erro da API:", response.status, text.slice(0, 200));
    return NextResponse.json({ error: `API retornou ${response.status}` }, { status: response.status });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  if (!API_Base) {
    return NextResponse.json({ error: "API_BASE_URL não definida" }, { status: 500 });
  }

  const response = await fetch(`${API_Base}/user/${params.id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Erro da API:", response.status, text.slice(0, 200));
    return NextResponse.json({ error: `API retornou ${response.status}` }, { status: response.status });
  }

  return new NextResponse(null, { status: 200 });
}