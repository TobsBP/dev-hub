import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { API_BASE_URL } from '@/utils/consts/api';

async function bearerHeader(): Promise<Record<string, string>> {
	const session = await getServerSession(authOptions);
	return session?.accessToken
		? { Authorization: `Bearer ${session.accessToken}` }
		: {};
}

export async function GET(request: Request) {
	if (!API_BASE_URL) {
		return NextResponse.json(
			{ error: 'API_BASE_URL não definida' },
			{ status: 500 },
		);
	}

	const { searchParams } = new URL(request.url);
	const targetType = searchParams.get('type');
	const targetId = searchParams.get('id');

	if (!targetType || !targetId) {
		return NextResponse.json({ error: 'Parâmetros ausentes' }, { status: 400 });
	}

	try {
		const response = await fetch(
			`${API_BASE_URL}/likes/${targetType}/${targetId}`,
			{
				cache: 'no-store',
				headers: await bearerHeader(),
			},
		);

		if (!response.ok) {
			return NextResponse.json([]);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (_error) {
		return NextResponse.json([], { status: 200 });
	}
}
