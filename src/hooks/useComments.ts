'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { Comment } from '@/types/comment';
import { commentsService } from '@/services/comments.service';

export function useComments(postId: string | null) {
	const { token, user } = useAuth();

	const [comments, setComments] = useState<Comment[]>([]);
	const [loading, setLoading] = useState(!!postId);
	const [error, setError] = useState<string | null>(null);

	const fetchComments = useCallback(async () => {
		if (!postId) return;
		setLoading(true);
		setError(null);
		try {
			setComments(await commentsService.getByPost(postId, token ?? undefined));
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao buscar comentários');
		} finally {
			setLoading(false);
		}
	}, [postId, token]);

	useEffect(() => {
		fetchComments();
	}, [fetchComments]);

	const createComment = useCallback(
		async (content: string, parentId?: string | null) => {
			if (!postId || !user?.id) return;
			await commentsService.create(
				{
					post_id: postId,
					user_id: user.id,
					parent_id: parentId ?? null,
					content,
				},
				token ?? undefined,
			);
			await fetchComments();
		},
		[postId, user?.id, token, fetchComments],
	);

	const deleteComment = useCallback(
		async (id: string) => {
			await commentsService.delete(id, token ?? undefined);
			setComments((prev) => prev.filter((c) => c.id !== id));
		},
		[token],
	);

	return {
		comments,
		loading,
		error,
		refetch: fetchComments,
		createComment,
		deleteComment,
	};
}
