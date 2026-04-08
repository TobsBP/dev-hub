import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { API_BASE_URL } from '@/utils/consts/api';

async function bearerHeader() {
	const session = await getServerSession(authOptions);
	return session?.accessToken
		? { Authorization: `Bearer ${session.accessToken}` }
		: {};
}

export async function POST(request: Request) {
	if (!API_BASE_URL) {
		return NextResponse.json(
			{ error: 'API_BASE_URL não definida' },
			{ status: 500 },
		);
	}

	try {
		const { userId, targetType, targetId, isLiked } = await request.json();
		const auth = await bearerHeader();

		if (isLiked) {
			const response = await fetch(
				`${API_BASE_URL}/like/${userId}/${targetType}/${targetId}`,
				{
					method: 'DELETE',
					headers: auth,
				},
			);

			if (!response.ok) {
				const text = await response.text();
				console.error('Erro ao deletar no back:', text);
				return NextResponse.json(
					{ error: 'Erro ao remover like' },
					{ status: response.status },
				);
			}

			return NextResponse.json({ message: 'Like removido' }, { status: 200 });
		}

		const response = await fetch(`${API_BASE_URL}/likes`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...auth },
			body: JSON.stringify({
				user_id: userId,
				target_type: targetType,
				target_id: targetId,
			}),
		});

		if (!response.ok) {
			const text = await response.text();
			console.error('Erro ao postar no back:', text);
			return NextResponse.json(
				{ error: 'Erro ao adicionar like' },
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 201 });
	} catch (_error) {
		return NextResponse.json(
			{ error: 'Erro interno no servidor' },
			{ status: 500 },
		);
	}
}
