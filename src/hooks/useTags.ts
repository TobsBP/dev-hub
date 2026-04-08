'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { Tag } from '@/types/tag';
import { tagsService } from '@/services/tags.service';

export function useTags() {
	const { token } = useAuth();

	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchTags = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			setTags(await tagsService.getAll(token ?? undefined));
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao buscar tags');
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchTags();
	}, [fetchTags]);

	return { tags, loading, error, refetch: fetchTags };
}

export function usePostTags(postId: string | null) {
	const { token } = useAuth();

	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(!!postId);
	const [error, setError] = useState<string | null>(null);

	const fetchTags = useCallback(async () => {
		if (!postId) return;
		setLoading(true);
		setError(null);
		try {
			setTags(await tagsService.getByPost(postId, token ?? undefined));
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro');
		} finally {
			setLoading(false);
		}
	}, [postId, token]);

	useEffect(() => {
		fetchTags();
	}, [fetchTags]);

	return { tags, loading, error, refetch: fetchTags };
}
