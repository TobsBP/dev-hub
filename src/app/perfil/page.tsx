'use client';

import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import PostCard from '@/components/PostCard';
import type { Post } from '@/types/post';
import type { UserMap } from '@/types/user';

interface UserProfile {
	id: string;
	username: string;
	email: string;
	bio?: string;
	avatar_url?: string;
}

interface Bookmark {
	post_id: string;
}

export default function PerfilPage() {
	const { data: session, update } = useSession();
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const [editing, setEditing] = useState(false);
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [bio, setBio] = useState('');

	const [avatar, setAvatar] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
	const [usersMap, setUsersMap] = useState<UserMap>({});
	const [loadingBookmarks, setLoadingBookmarks] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const userId = session?.user?.id;
		if (!userId) return;

		setLoadingBookmarks(true);
		Promise.all([
			fetch(`/api/bookmarks?user_id=${userId}`).then((r) =>
				r.ok ? r.json() : [],
			),
			fetch('/api/posts').then((r) => (r.ok ? r.json() : [])),
			fetch('/api/users').then((r) => (r.ok ? r.json() : [])),
		])
			.then(
				([bookmarks, posts, users]: [Bookmark[], Post[], UserProfile[]]) => {
					const bookmarkedIds = new Set(bookmarks.map((b) => b.post_id));
					setBookmarkedPosts(
						(Array.isArray(posts) ? posts : []).filter((p) =>
							bookmarkedIds.has(p.id),
						),
					);
					const map: UserMap = {};
					if (Array.isArray(users)) {
						for (const u of users) {
							if ((u as UserProfile & { id: string }).id) {
								map[(u as UserProfile & { id: string }).id] = u;
							}
						}
					}
					setUsersMap(map);
				},
			)
			.catch(() => {})
			.finally(() => setLoadingBookmarks(false));
	}, [session?.user?.id]);

	useEffect(() => {
		if (!session?.user?.id) return;
		fetch(`/api/users/${session.user.id}`)
			.then((r) => r.json())
			.then((data) => {
				setProfile(data);
				setUsername(data.username ?? '');
				setEmail(data.email ?? '');
				setBio(data.bio ?? '');
			})
			.catch(() => {});
	}, [session?.user?.id]);

	function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] ?? null;
		setAvatar(file);
		setPreview(file ? URL.createObjectURL(file) : null);
	}

	async function handleSave(e: React.FormEvent) {
		e.preventDefault();
		if (!session?.user?.id) return;
		setLoading(true);
		setError(null);

		const formData = new FormData();
		formData.append('username', username);
		formData.append('email', email);
		formData.append('bio', bio);
		if (avatar) formData.append('avatar', avatar);

		const response = await fetch(`/api/users/${session.user.id}`, {
			method: 'PATCH',
			body: formData,
		});

		setLoading(false);

		if (!response.ok) {
			setError('Erro ao atualizar perfil.');
			return;
		}

		const updated: UserProfile = await response.json();
		setProfile(updated);

		setAvatar(null);
		setPreview(null);
		if (fileInputRef.current) fileInputRef.current.value = '';
		setSuccess(true);
		setEditing(false);
		await update();
		setTimeout(() => setSuccess(false), 2500);
	}

	const avatarSrc = preview ?? profile?.avatar_url ?? null;
	const initials = (
		profile?.username?.[0] ??
		session?.user?.email?.[0] ??
		'?'
	).toUpperCase();

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
							disabled={loading}
							className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-md text-sm font-semibold transition-colors"
						>
							{loading ? 'Salvando...' : 'Salvar'}
						</button>
						<button
							type="button"
							onClick={() => {
								setEditing(false);
								setAvatar(null);
								setPreview(null);
								setError(null);
								setUsername(profile?.username ?? '');
								setEmail(profile?.email ?? '');
								setBio(profile?.bio ?? '');

								if (fileInputRef.current) fileInputRef.current.value = '';
							}}
							className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-md text-sm font-semibold transition-colors"
						>
							Cancelar
						</button>
					</div>
				</form>
			) : (
				<div className="text-center flex flex-col gap-1">
					<p className="text-lg font-semibold">
						{profile?.username ?? session?.user?.name ?? '—'}
					</p>
					<p className="text-zinc-400 text-sm">
						{profile?.email ?? session?.user?.email ?? '—'}
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
						onClick={() => setEditing(true)}
						className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
					>
						Editar perfil
					</button>
					<button
						type="button"
						onClick={() => signOut({ callbackUrl: '/login' })}
						className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
					>
						Sair
					</button>
				</div>
			)}

			{/* Bookmarks */}
			{!editing && (
				<div className="w-full max-w-xl mt-4">
					<h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
						<svg
							width="14"
							height="14"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							fill="currentColor"
						>
							<title>Bookmarks</title>
							<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
						</svg>
						Posts salvos
					</h2>

					{loadingBookmarks && (
						<p className="text-zinc-600 text-sm text-center py-6">
							Carregando...
						</p>
					)}

					{!loadingBookmarks && bookmarkedPosts.length === 0 && (
						<p className="text-zinc-600 text-sm text-center py-6">
							Nenhum post salvo ainda.
						</p>
					)}

					{!loadingBookmarks &&
						bookmarkedPosts.map((post) => (
							<PostCard
								key={post.id}
								post={post}
								user={usersMap[post.user_id]}
								users={usersMap}
								initialBookmarked
							/>
						))}
				</div>
			)}
		</div>
	);
}
