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

export async function GET() {
	if (!API_BASE_URL) {
		return NextResponse.json(
			{ error: 'API_BASE_URL não definida' },
			{ status: 500 },
		);
	}

	const response = await fetch(`${API_BASE_URL}/users`, {
		headers: await bearerHeader(),
	});

	if (!response.ok) {
		const text = await response.text();
		console.error('Erro da API:', response.status, text.slice(0, 200));
		return NextResponse.json(
			{ error: `API retornou ${response.status}` },
			{ status: response.status },
		);
	}

	const data = await response.json();
	return NextResponse.json(data, { status: 200 });
}

export async function POST(request: Request) {
	if (!API_BASE_URL) {
		return NextResponse.json(
			{ error: 'API_BASE_URL não definida' },
			{ status: 500 },
		);
	}

	const formData = await request.formData();
	const response = await fetch(`${API_BASE_URL}/user`, {
		method: 'POST',
		headers: await bearerHeader(),
		body: formData,
	});

	if (!response.ok) {
		const text = await response.text();
		console.error('Erro da API:', response.status, text.slice(0, 200));
		return NextResponse.json(
			{ error: `API retornou ${response.status}` },
			{ status: response.status },
		);
	}

	const data = await response.json();
	return NextResponse.json(data, { status: 201 });
}
