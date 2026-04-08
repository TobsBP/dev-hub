'use client';

import { useState } from 'react';
import { authService } from '@/services/auth.service';

export function useRegister() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const register = async (data: {
		username: string;
		email: string;
		password: string;
		bio?: string;
		avatar?: File;
	}) => {
		setLoading(true);
		setError(null);
		try {
			await authService.register(data);
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Erro ao criar conta';
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { register, loading, error };
}
