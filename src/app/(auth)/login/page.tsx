'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
	const router = useRouter();
	const { login } = useAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError('');

		const form = e.currentTarget;
		const email = (form.elements.namedItem('email') as HTMLInputElement).value;
		const password = (form.elements.namedItem('password') as HTMLInputElement).value;

		try {
			await login(email, password);
			router.push('/');
		} catch {
			setError('Email ou senha inválidos.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="w-full max-w-sm flex flex-col gap-6">
				<h1 className="text-2xl font-bold text-center">Entrar</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<input
						name="email"
						type="email"
						placeholder="Email"
						required
						className="border rounded px-3 py-2 w-full"
					/>
					<input
						name="password"
						type="password"
						placeholder="Senha"
						required
						className="border rounded px-3 py-2 w-full"
					/>

					{error && <p className="text-red-500 text-sm">{error}</p>}

					<button
						type="submit"
						disabled={loading}
						className="bg-black text-white rounded px-3 py-2 hover:opacity-80 disabled:opacity-50"
					>
						{loading ? 'Entrando...' : 'Entrar'}
					</button>
				</form>

				<p className="text-center text-sm">
					Não tem conta?{' '}
					<a href="/register" className="underline">
						Cadastre-se
					</a>
				</p>
			</div>
		</div>
	);
}
