'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import type { Comment } from '@/types/comment';
import type { Like } from '@/types/like';
import type { Post } from '@/types/post';
import type { User, UserMap } from '@/types/user';
import { TYPE_LABELS } from '@/utils/consts/post';
import { formatDate } from '@/utils/formatDate';
import { initials } from '@/utils/initials';

export default function PostCard({
	post,
	user,
	initialCommentCount = 0,
	initialBookmarked = false,
	users = {},
}: {
	post: Post;
	user?: User;
	initialCommentCount?: number;
	initialBookmarked?: boolean;
	users?: UserMap;
}) {
	const { data: session } = useSession();
	const [liked, setLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);
	const [bookmarked, setBookmarked] = useState(initialBookmarked);
	const [showComments, setShowComments] = useState(false);
	const [comments, setComments] = useState<Comment[]>([]);
	const [commentCount, setCommentCount] = useState(initialCommentCount);
	const [commentText, setCommentText] = useState('');
	const [loadingComments, setLoadingComments] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	// --- BUSCAR ESTADO INICIAL DE BOOKMARK ---
	useEffect(() => {
		const userId = session?.user?.id;
		if (!userId || initialBookmarked) return;

		fetch(`/api/bookmarks?user_id=${userId}`)
			.then((r) => (r.ok ? r.json() : []))
			.then((data: Array<{ post_id: string }>) => {
				if (Array.isArray(data)) {
					setBookmarked(data.some((b) => b.post_id === post.id));
				}
			})
			.catch(() => {});
	}, [post.id, session, initialBookmarked]);

	// --- BUSCAR ESTADO INICIAL DE LIKES ---
	useEffect(() => {
		const fetchLikes = async () => {
			const userId = session?.user?.id;
			try {
				const res = await fetch(`/api/likes?type=post&id=${post.id}`);
				if (res.ok) {
					const data = await res.json();
					if (Array.isArray(data)) {
						setLikesCount(data.length);
						if (userId) {
							const hasLiked = data.some(
								(like: Like) => like.user_id === userId,
							);
							setLiked(hasLiked);
						}
					}
				}
			} catch (err) {
				console.error('Erro ao carregar likes:', err);
			}
		};

		fetchLikes();
	}, [post.id, session]);

	// --- BUSCAR COMENTÁRIOS ---
	useEffect(() => {
		if (!showComments) return;
		setLoadingComments(true);
		fetch(`/api/comments/${post.id}`)
			.then((r) => r.json())
			.then((data) => setComments(Array.isArray(data) ? data : []))
			.finally(() => setLoadingComments(false));
	}, [showComments, post.id]);

	// --- LOGICA DE CURTIR/DESCURTIR ---
	const toggleLike = async () => {
		const userId = session?.user?.id;
		if (!userId) {
			alert('Você precisa estar logado para curtir!');
			return;
		}

		// Optimistic UI: Muda na tela antes de ir pro banco
		const previousLiked = liked;
		const previousCount = likesCount;

		setLiked(!previousLiked);
		setLikesCount((prev) => (previousLiked ? prev - 1 : prev + 1));

		try {
			const res = await fetch('/api/likes/toggle', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: userId,
					targetId: post.id,
					targetType: 'post',
					isLiked: previousLiked,
				}),
			});

			if (!res.ok) throw new Error('Erro na API');
		} catch (error) {
			// Reverte se der erro
			setLiked(previousLiked);
			setLikesCount(previousCount);
			console.error('Erro ao curtir:', error);
		}
	};

	// --- LÓGICA DE BOOKMARK ---
	const toggleBookmark = async () => {
		const userId = session?.user?.id;
		if (!userId) {
			alert('Você precisa estar logado para salvar posts!');
			return;
		}

		const previousBookmarked = bookmarked;
		setBookmarked(!previousBookmarked);

		try {
			if (previousBookmarked) {
				const res = await fetch(`/api/bookmarks/${post.id}?user_id=${userId}`, {
					method: 'DELETE',
				});
				if (!res.ok) throw new Error('Erro ao remover bookmark');
			} else {
				const res = await fetch('/api/bookmarks', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ user_id: userId, post_id: post.id }),
				});
				if (!res.ok) throw new Error('Erro ao adicionar bookmark');
			}
		} catch (error) {
			setBookmarked(previousBookmarked);
			console.error('Erro ao salvar bookmark:', error);
		}
	};

	const submitComment = async () => {
		if (commentText.trim().length < 2 || submitting) return;
		setSubmitting(true);
		const res = await fetch(`/api/comments/${post.id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				user_id: session?.user?.id,
				content: commentText.trim(),
			}),
		});
		if (res.ok) {
			const newComment = await res.json();
			setComments((prev) => [...prev, newComment]);
			setCommentCount((c) => c + 1);
			setCommentText('');
		}
		setSubmitting(false);
	};

	return (
		<article className="w-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden mb-4">
			{/* Header */}
			<div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
				<div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 text-sm font-medium shrink-0 overflow-hidden">
					{user?.avatar_url ? (
						<Image
							src={user.avatar_url}
							alt={user.username ?? 'avatar'}
							width={36}
							height={36}
							className="w-full h-full object-cover"
						/>
					) : (
						initials(user)
					)}
				</div>
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium text-white truncate">
						{user?.username ?? user?.email ?? `${post.user_id.slice(0, 8)}...`}
					</p>
					<p className="text-xs text-zinc-500">{formatDate(post.created_at)}</p>
				</div>
				<span className="text-xs bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-full text-zinc-400">
					{TYPE_LABELS[post.type] ?? post.type}
				</span>
			</div>

			{/* Content */}
			<div className="px-4 py-4">
				{post.type === 'code' ? (
					<div className="rounded-lg overflow-hidden border border-zinc-800 text-sm">
						<SyntaxHighlighter
							language="auto"
							style={atomOneDark}
							customStyle={{
								margin: 0,
								borderRadius: 0,
								background: '#18181b',
							}}
							showLineNumbers
							wrapLongLines
						>
							{post.content}
						</SyntaxHighlighter>
					</div>
				) : post.type === 'image' ? (
					<div className="space-y-2">
						{post.image_url && (
							<div className="relative w-full overflow-hidden rounded-lg border border-zinc-800">
								<Image
									src={post.image_url}
									alt={post.content || 'Imagem do post'}
									width={800}
									height={600}
									className="w-full h-auto object-cover"
								/>
							</div>
						)}
						{post.content && (
							<p className="text-zinc-400 text-sm leading-relaxed">
								{post.content}
							</p>
						)}
					</div>
				) : post.type === 'question' ? (
					<div className="flex gap-3 p-3 bg-amber-950/30 border border-amber-900/50 rounded-lg">
						<span className="text-amber-400 text-lg leading-none mt-0.5">
							?
						</span>
						<p className="text-zinc-200 text-sm leading-relaxed">
							{post.content}
						</p>
					</div>
				) : (
					<p className="text-zinc-200 text-sm leading-relaxed">
						{post.content}
					</p>
				)}
			</div>

			{/* Actions */}
			<div className="flex items-center gap-5 px-4 pb-3">
				<button
					type="button"
					onClick={toggleLike}
					className={`flex items-center gap-1.5 text-sm transition-colors ${
						liked ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'
					}`}
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="1.8"
						fill={liked ? 'currentColor' : 'none'}
					>
						<title>{liked ? 'Curtido' : 'Curtir'}</title>
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
					</svg>
					<span>{likesCount}</span>
				</button>

				<button
					type="submit"
					onClick={() => setShowComments((v) => !v)}
					className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
					>
						<title>{commentCount === 0 ? 'Comentar' : 'Comentários'}</title>
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
					</svg>
					<span>
						{commentCount} {commentCount === 1 ? 'comentário' : 'comentários'}
					</span>
				</button>

				<button
					type="button"
					onClick={toggleBookmark}
					className={`flex items-center gap-1.5 text-sm transition-colors ml-auto ${
						bookmarked ? 'text-blue-400' : 'text-zinc-500 hover:text-zinc-300'
					}`}
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth="1.8"
						fill={bookmarked ? 'currentColor' : 'none'}
					>
						<title>{bookmarked ? 'Salvo' : 'Salvar'}</title>
						<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
					</svg>
				</button>
			</div>

			{/* Comments Area... */}
			{showComments && (
				<div className="border-t border-zinc-800 px-4 py-3 space-y-3 w-full overflow-hidden">
					{loadingComments && (
						<p className="text-xs text-zinc-600">Carregando...</p>
					)}
					{!loadingComments && comments.length === 0 && (
						<p className="text-xs text-zinc-600">Nenhum comentário ainda.</p>
					)}
					{comments.map((c) => {
						const isMe = c.user_id === session?.user?.id;
						const commentUser = users[c.user_id];
						const displayName = isMe
							? 'Você'
							: (commentUser?.username ?? commentUser?.email ?? 'Usuário');
						const initial = isMe
							? (
									user?.username?.[0] ??
									session?.user?.email?.[0] ??
									'V'
								).toUpperCase()
							: (
									commentUser?.username?.[0] ??
									commentUser?.email?.[0] ??
									'?'
								).toUpperCase();
						return (
							<div key={c.id} className="flex gap-2 items-start">
								<div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-zinc-400 shrink-0">
									{initial}
								</div>
								<div className="bg-zinc-900 rounded-lg px-3 py-2 flex-1 min-w-0">
									<p className="text-xs font-medium text-zinc-400 mb-0.5">
										{displayName}
									</p>
									<p className="text-sm text-zinc-300 leading-snug">
										{c.content}
									</p>
								</div>
							</div>
						);
					})}

					<div className="flex gap-2 pt-1 min-w-0">
						<input
							type="text"
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && !e.shiftKey) {
									e.preventDefault();
									submitComment();
								}
							}}
							placeholder="Comentar... (Enter para enviar)"
							className="flex-1 min-w-0 bg-zinc-900 text-zinc-200 text-sm border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-600 placeholder:text-zinc-600"
						/>
						<button
							type="submit"
							onClick={submitComment}
							disabled={commentText.trim().length < 2 || submitting}
							className="text-sm px-3 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white rounded-lg transition-colors shrink-0"
						>
							{submitting ? '...' : 'Publicar'}
						</button>
					</div>
				</div>
			)}
		</article>
	);
}
