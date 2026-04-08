'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { Post } from '@/types/post';
import { postsService } from '@/services/posts.service';

export function usePosts() {
	const { token } = useAuth();

	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchPosts = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await postsService.getAll(token ?? undefined);
			setPosts(
				data.sort(
					(a, b) =>
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
				),
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao buscar posts');
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	const createPost = useCallback(
		async (data: {
			user_id: string;
			content: string;
			type: string;
			image?: File;
		}) => {
			await postsService.create(data, token ?? undefined);
			await fetchPosts();
		},
		[token, fetchPosts],
	);

	return { posts, loading, error, refetch: fetchPosts, createPost };
}

export function usePost(id: string | null) {
	const { token } = useAuth();

	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(!!id);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		setError(null);
		postsService
			.getById(id, token ?? undefined)
			.then(setPost)
			.catch((err) => setError(err instanceof Error ? err.message : 'Erro'))
			.finally(() => setLoading(false));
	}, [id, token]);

	return { post, loading, error };
}

export function useUserPosts(userId: string | null) {
	const { token } = useAuth();

	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(!!userId);
	const [error, setError] = useState<string | null>(null);

	const fetchPosts = useCallback(async () => {
		if (!userId) return;
		setLoading(true);
		setError(null);
		try {
			const data = await postsService.getByUser(userId, token ?? undefined);
			setPosts(
				data.sort(
					(a, b) =>
						new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
				),
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro');
		} finally {
			setLoading(false);
		}
	}, [userId, token]);

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	return { posts, loading, error, refetch: fetchPosts };
}
