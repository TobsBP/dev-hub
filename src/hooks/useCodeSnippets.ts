'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { CodeSnippet } from '@/types/code-snippet';
import { codeSnippetsService } from '@/services/code-snippets.service';

export function useCodeSnippets(postId: string | null) {
	const { token } = useAuth();

	const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
	const [loading, setLoading] = useState(!!postId);
	const [error, setError] = useState<string | null>(null);

	const fetchSnippets = useCallback(async () => {
		if (!postId) return;
		setLoading(true);
		setError(null);
		try {
			setSnippets(
				await codeSnippetsService.getByPost(postId, token ?? undefined),
			);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao buscar snippets');
		} finally {
			setLoading(false);
		}
	}, [postId, token]);

	useEffect(() => {
		fetchSnippets();
	}, [fetchSnippets]);

	return { snippets, loading, error, refetch: fetchSnippets };
}
