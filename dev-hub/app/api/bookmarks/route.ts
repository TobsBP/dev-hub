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
	const userId = searchParams.get('user_id');

	if (!userId) {
		return NextResponse.json({ error: 'user_id ausente' }, { status: 400 });
	}

	try {
		const response = await fetch(`${API_BASE_URL}/bookmarks/${userId}`, {
			cache: 'no-store',
		});

		if (!response.ok) {
			return NextResponse.json([]);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (_error) {
		return NextResponse.json([], { status: 200 });
	}
}

export async function POST(request: Request) {
	if (!API_BASE_URL) {
		return NextResponse.json(
			{ error: 'API_BASE_URL não definida' },
			{ status: 500 },
		);
	}

	try {
		const { user_id, post_id } = await request.json();

		const response = await fetch(`${API_BASE_URL}/bookmarks`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ user_id, post_id }),
		});

		if (!response.ok) {
			const text = await response.text();
			console.error('Erro ao criar bookmark:', text);
			return NextResponse.json(
				{ error: 'Erro ao adicionar bookmark' },
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 201 });
	} catch (_error) {
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}
