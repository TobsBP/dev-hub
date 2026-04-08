'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useUser } from '@/hooks/useUsers';

export default function PerfilPage() {
	const { user: authUser, logout } = useAuth();
	const { user: profile, loading, updateUser } = useUser(authUser?.id ?? null);

	const [editing, setEditing] = useState(false);
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [bio, setBio] = useState('');
	const [avatar, setAvatar] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	function startEditing() {
		setUsername(profile?.username ?? '');
		setEmail(profile?.email ?? '');
		setBio(profile?.bio ?? '');
		setEditing(true);
	}

	function cancelEditing() {
		setEditing(false);
		setAvatar(null);
		setPreview(null);
		setError(null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	}

	function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] ?? null;
		setAvatar(file);
		setPreview(file ? URL.createObjectURL(file) : null);
	}

	async function handleSave(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);
		setError(null);
		try {
			await updateUser({ username, email, bio, avatar: avatar ?? undefined });
			setAvatar(null);
			setPreview(null);
			if (fileInputRef.current) fileInputRef.current.value = '';
			setSuccess(true);
			setEditing(false);
			setTimeout(() => setSuccess(false), 2500);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil.');
		} finally {
			setSaving(false);
		}
	}

	const avatarSrc = preview ?? profile?.avatar_url ?? null;
	const initials = (
		profile?.username?.[0] ??
		authUser?.email?.[0] ??
		'?'
	).toUpperCase();

	if (loading) {
		return (
			<div className="min-h-screen bg-black text-white flex items-center justify-center">
				<p className="text-zinc-500 text-sm">Carregando...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white flex flex-col items-center gap-6 px-4 py-10">
			{/* Avatar */}
			<div className="relative">
				<div className="w-20 h-20 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 text-2xl font-bold overflow-hidden">
					{avatarSrc ? (
						<Image
							src={avatarSrc}
							alt="Avatar"
							width={80}
							height={80}
							className="w-full h-full object-cover"
						/>
					) : (
						initials
					)}
				</div>
				{editing && (
					<label
						htmlFor="avatar-upload"
						className="absolute -bottom-1 -right-1 w-7 h-7 bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 rounded-full flex items-center justify-center cursor-pointer transition-colors"
					>
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<title>Alterar foto</title>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="17 8 12 3 7 8" />
							<line x1="12" y1="3" x2="12" y2="15" />
						</svg>
					</label>
				)}
				<input
					id="avatar-upload"
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleAvatarChange}
					className="sr-only"
				/>
			</div>

			{/* Info / Form */}
			{editing ? (
				<form
					onSubmit={handleSave}
					className="w-full max-w-sm flex flex-col gap-3"
				>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Username"
						className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
					/>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
						className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500"
					/>
					<textarea
						value={bio}
						onChange={(e) => setBio(e.target.value)}
						placeholder="Bio (opcional)"
						rows={3}
						maxLength={300}
						className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-zinc-500 resize-none"
					/>
					{error && <p className="text-red-400 text-sm">{error}</p>}

					<div className="flex gap-2">
						<button
							type="submit"
							disabled={saving}
							className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-md text-sm font-semibold transition-colors"
						>
							{saving ? 'Salvando...' : 'Salvar'}
						</button>
						<button
							type="button"
							onClick={cancelEditing}
							className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-md text-sm font-semibold transition-colors"
						>
							Cancelar
						</button>
					</div>
				</form>
			) : (
				<div className="text-center flex flex-col gap-1">
					<p className="text-lg font-semibold">
						{profile?.username ?? authUser?.username ?? '—'}
					</p>
					<p className="text-zinc-400 text-sm">
						{profile?.email ?? authUser?.email ?? '—'}
					</p>
					{profile?.bio && (
						<p className="text-zinc-500 text-sm mt-1 max-w-xs">{profile.bio}</p>
					)}
					{success && (
						<p className="text-green-400 text-sm mt-1">✓ Perfil atualizado!</p>
					)}
				</div>
			)}

			{/* Actions */}
			{!editing && (
				<div className="flex flex-col gap-3 w-full max-w-sm">
					<button
						type="button"
						onClick={startEditing}
						className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
					>
						Editar perfil
					</button>
					<button
						type="button"
						onClick={logout}
						className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
					>
						Sair
					</button>
				</div>
			)}
		</div>
	);
}
