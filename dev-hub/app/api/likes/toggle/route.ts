import { NextResponse } from "next/server";

const API_Base = process.env.API_BASE_URL;

export async function POST(request: Request) {
  if (!API_Base) {
    return NextResponse.json({ error: "API_BASE_URL não definida" }, { status: 500 });
  }

  try {
    const { userId, targetType, targetId, isLiked } = await request.json();

    if (isLiked) {
      const response = await fetch(`${API_Base}/like/${userId}/${targetType}/${targetId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Erro ao deletar no back:", text);
        return NextResponse.json({ error: "Erro ao remover like" }, { status: response.status });
      }

      return NextResponse.json({ message: "Like removido" }, { status: 200 });
    } else {
      // REGRA: Se não está curtido, o clique deve "Curtir"
      // URL do Back: POST /likes
      const response = await fetch(`${API_Base}/likes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          target_type: targetType,
          target_id: targetId,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Erro ao postar no back:", text);
        return NextResponse.json({ error: "Erro ao adicionar like" }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json(data, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}