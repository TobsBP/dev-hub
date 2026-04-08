'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { postsService } from '@/services/posts.service';

export function useCreatePost() {
	const { token } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createPost = async (data: {
		user_id: string;
		content: string;
		type: string;
		image?: File;
	}) => {
		setLoading(true);
		setError(null);
		try {
			await postsService.create(data, token ?? undefined);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Erro ao criar post';
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { createPost, loading, error };
}
