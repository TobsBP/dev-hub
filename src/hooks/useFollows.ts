'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { Follow } from '@/types/follow';
import { followsService } from '@/services/follows.service';

export function useFollowers(userId: string | null) {
	const { token } = useAuth();

	const [followers, setFollowers] = useState<Follow[]>([]);
	const [loading, setLoading] = useState(!!userId);
	const [error, setError] = useState<string | null>(null);

	const fetchFollowers = useCallback(async () => {
		if (!userId) return;
		setLoading(true);
		setError(null);
		try {
			setFollowers(
				await followsService.getFollowers(userId, token ?? undefined),
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro');
		} finally {
			setLoading(false);
		}
	}, [userId, token]);

	useEffect(() => {
		fetchFollowers();
	}, [fetchFollowers]);

	return { followers, loading, error, refetch: fetchFollowers };
}

export function useFollowing(userId: string | null) {
	const { token } = useAuth();

	const [following, setFollowing] = useState<Follow[]>([]);
	const [loading, setLoading] = useState(!!userId);
	const [error, setError] = useState<string | null>(null);

	const fetchFollowing = useCallback(async () => {
		if (!userId) return;
		setLoading(true);
		setError(null);
		try {
			setFollowing(
				await followsService.getFollowing(userId, token ?? undefined),
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro');
		} finally {
			setLoading(false);
		}
	}, [userId, token]);

	useEffect(() => {
		fetchFollowing();
	}, [fetchFollowing]);

	return { following, loading, error, refetch: fetchFollowing };
}

export function useFollow(targetUserId: string | null) {
	const { token, user } = useAuth();
	const { followers, refetch } = useFollowers(targetUserId);

	const isFollowing =
		!!user?.id && followers.some((f) => f.follower_id === user.id);

	const toggle = useCallback(async () => {
		if (!user?.id || !token || !targetUserId) return;
		if (isFollowing) {
			await followsService.unfollow(user.id, targetUserId, token);
		} else {
			await followsService.follow(
				{ follower_id: user.id, following_id: targetUserId },
				token,
			);
		}
		await refetch();
	}, [user?.id, token, targetUserId, isFollowing, refetch]);

	return { isFollowing, toggle };
}
