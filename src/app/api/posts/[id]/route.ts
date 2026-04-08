import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { API_BASE_URL } from '@/utils/consts/api';

type Params = Promise<{ id: string }>;

async function bearerHeader() {
	const session = await getServerSession(authOptions);
	return session?.accessToken
		? { Authorization: `Bearer ${session.accessToken}` }
		: {};
}

export async function GET(_: Request, { params }: { params: Params }) {
	if (!API_BASE_URL) {
		return NextResponse.json(
			{ error: 'API_BASE_URL não definida' },
			{ status: 500 },
		);
	}

	const { id } = await params;
	const response = await fetch(`${API_BASE_URL}/post/${id}`, {
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

export async function PATCH(request: Request, { params }: { params: Params }) {
	if (!API_BASE_URL) {
		return NextResponse.json(
			{ error: 'API_BASE_URL não definida' },
			{ status: 500 },
		);
	}

	const { id } = await params;
	const body = await request.json();
	const response = await fetch(`${API_BASE_URL}/post/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json', ...(await bearerHeader()) },
		body: JSON.stringify(body),
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

export async function DELETE(_: Request, { params }: { params: Params }) {
	if (!API_BASE_URL) {
		return NextResponse.json(
			{ error: 'API_BASE_URL não definida' },
			{ status: 500 },
		);
	}

	const { id } = await params;
	const response = await fetch(`${API_BASE_URL}/post/${id}`, {
		method: 'DELETE',
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

	return new NextResponse(null, { status: 200 });
}
