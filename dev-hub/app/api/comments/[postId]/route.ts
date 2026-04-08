import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/utils/consts/api';

export async function GET(
	_: Request,
	{ params }: { params: Promise<{ postId: string }> },
) {
	const { postId } = await params;
	const response = await fetch(`${API_BASE_URL}/comments/${postId}`);
	if (!response.ok)
		return NextResponse.json(
			{ error: 'Erro ao buscar comentários' },
			{ status: response.status },
		);
	const data = await response.json();
	return NextResponse.json(data);
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ postId: string }> },
) {
	const { postId } = await params;
	const body = await request.json();
	const response = await fetch(`${API_BASE_URL}/comments`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ ...body, post_id: postId, parent_id: null }),
	});
	if (!response.ok)
		return NextResponse.json(
			{ error: 'Erro ao criar comentário' },
			{ status: response.status },
		);
	const data = await response.json();
	return NextResponse.json(data, { status: 201 });
}
