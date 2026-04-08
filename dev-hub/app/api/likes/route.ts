import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/utils/consts/api';

export async function GET(request: Request) {
	if (!API_BASE_URL) {
		return NextResponse.json(
			{ error: 'API_BASE_URL não definida' },
			{ status: 500 },
		);
	}

	const { searchParams } = new URL(request.url);
	const targetType = searchParams.get('type'); // 'post'
	const targetId = searchParams.get('id'); // 'uuid-do-post'

	if (!targetType || !targetId) {
		return NextResponse.json({ error: 'Parâmetros ausentes' }, { status: 400 });
	}

	try {
		const response = await fetch(
			`${API_BASE_URL}/likes/${targetType}/${targetId}`,
			{
				cache: 'no-store', // Garante que pegue o dado mais atualizado
			},
		);

		if (!response.ok) {
			// Se a API retornar erro (ex: 404 pq não tem likes ainda), retornamos lista vazia
			return NextResponse.json([]);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (_error) {
		return NextResponse.json([], { status: 200 });
	}
}
