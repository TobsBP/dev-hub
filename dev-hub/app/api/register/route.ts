import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/utils/consts/api';

export async function POST(request: Request) {
	const body = await request.json();

	const formData = new FormData();
	for (const [key, value] of Object.entries(body)) {
		formData.append(key, value as string);
	}

	const response = await fetch(`${API_BASE_URL}/user`, {
		method: 'POST',
		body: formData,
	});

	if (!response.ok) {
		const text = await response.text();
		console.error('Erro no registro:', response.status, text.slice(0, 200));
		return NextResponse.json(
			{ error: `Erro ${response.status}` },
			{ status: response.status },
		);
	}

	const data = await response.json();
	return NextResponse.json(data, { status: 201 });
}
