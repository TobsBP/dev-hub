import { getServerSession } from 'next-auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { API_BASE_URL } from '@/utils/consts/api';

async function bearerHeader(): Promise<Record<string, string>> {
	const session = await getServerSession(authOptions);
	return session?.accessToken
		? { Authorization: `Bearer ${session.accessToken}` }
		: {};
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ postId: string }> },
) {
	if (!API_BASE_URL) {
		return NextResponse.json(
			{ error: 'API_BASE_URL não definida' },
			{ status: 500 },
		);
	}

	const { postId } = await params;
	const { searchParams } = new URL(req.url);
	const userId = searchParams.get('user_id');

	if (!userId) {
		return NextResponse.json({ error: 'user_id ausente' }, { status: 400 });
	}

	try {
		const response = await fetch(
			`${API_BASE_URL}/bookmark/${userId}/${postId}`,
			{
				method: 'DELETE',
				headers: await bearerHeader(),
			},
		);

		if (!response.ok) {
			const text = await response.text();
			console.error('Erro ao remover bookmark:', text);
			return NextResponse.json(
				{ error: 'Erro ao remover bookmark' },
				{ status: response.status },
			);
		}

		return new NextResponse(null, { status: 200 });
	} catch (_error) {
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}
