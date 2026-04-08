'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { Like, LikeTargetType } from '@/types/like';
import { likesService } from '@/services/likes.service';

export function useLikes(targetType: LikeTargetType, targetId: string | null) {
	const { token, user } = useAuth();

	const [likes, setLikes] = useState<Like[]>([]);
	const [loading, setLoading] = useState(!!targetId);
	const [error, setError] = useState<string | null>(null);

	const fetchLikes = useCallback(async () => {
		if (!targetId) return;
		setLoading(true);
		setError(null);
		try {
			setLikes(
				await likesService.getByTarget(targetType, targetId, token ?? undefined),
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao buscar likes');
		} finally {
			setLoading(false);
		}
	}, [targetType, targetId, token]);

	useEffect(() => {
		fetchLikes();
	}, [fetchLikes]);

	const isLiked = !!user?.id && likes.some((l) => l.user_id === user.id);
	const count = likes.length;

	const toggle = useCallback(async () => {
		if (!user?.id || !token || !targetId) return;
		try {
			if (isLiked) {
				await likesService.unlike(user.id, targetType, targetId, token);
				setLikes((prev) => prev.filter((l) => l.user_id !== user.id));
			} else {
				const newLike = await likesService.like(
					{ user_id: user.id, target_type: targetType, target_id: targetId },
					token,
				);
				setLikes((prev) => [...prev, newLike]);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao curtir');
		}
	}, [user?.id, token, targetId, targetType, isLiked]);

	return { likes, count, isLiked, loading, error, toggle, refetch: fetchLikes };
}
