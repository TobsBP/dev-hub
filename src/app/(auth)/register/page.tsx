'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useRegister } from '@/hooks/useAuth';

export default function RegisterPage() {
	const router = useRouter();
	const { register, loading, error } = useRegister();
	const [avatar, setAvatar] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] ?? null;
		setAvatar(file);
		setPreview(file ? URL.createObjectURL(file) : null);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const form = e.currentTarget;

		try {
			await register({
				username: (form.elements.namedItem('username') as HTMLInputElement).value,
				email: (form.elements.namedItem('email') as HTMLInputElement).value,
				password: (form.elements.namedItem('password') as HTMLInputElement).value,
				avatar: avatar ?? undefined,
			});
			router.push('/login');
		} catch {
			// error is already set in hook
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="w-full max-w-sm flex flex-col gap-6">
				<h1 className="text-2xl font-bold text-center">Criar conta</h1>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					{/* Avatar */}
					<div className="flex flex-col items-center gap-2">
						<label htmlFor="register-avatar" className="cursor-pointer group">
							<div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-dashed border-zinc-600 group-hover:border-zinc-400 flex items-center justify-center overflow-hidden transition-colors">
								{preview ? (
									<Image
										src={preview}
										alt="Preview"
										width={80}
										height={80}
										className="w-full h-full object-cover"
									/>
								) : (
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.5"
										className="text-zinc-500"
									>
										<title>Adicionar foto</title>
										<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
										<circle cx="12" cy="7" r="4" />
									</svg>
								)}
							</div>
						</label>
						<input
							id="register-avatar"
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleAvatarChange}
							className="sr-only"
						/>
						<span className="text-xs text-zinc-500">
							{avatar ? avatar.name : 'Foto de perfil (opcional)'}
						</span>
					</div>

					<input
						name="username"
						type="text"
						placeholder="Username"
						required
						className="border rounded px-3 py-2 w-full"
					/>
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
						{loading ? 'Criando...' : 'Criar conta'}
					</button>
				</form>

				<p className="text-center text-sm">
					Já tem conta?{' '}
					<a href="/login" className="underline">
						Entrar
					</a>
				</p>
			</div>
		</div>
	);
}
