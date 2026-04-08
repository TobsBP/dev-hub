'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import type { User, UserMap } from '@/types/user';
import { usersService } from '@/services/users.service';

export function useUsers() {
	const { token } = useAuth();

	const [users, setUsers] = useState<User[]>([]);
	const [usersMap, setUsersMap] = useState<UserMap>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchUsers = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await usersService.getAll(token ?? undefined);
			setUsers(data);
			const map: UserMap = {};
			for (const u of data) map[u.id] = u;
			setUsersMap(map);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro ao buscar usuários');
		} finally {
			setLoading(false);
		}
	}, [token]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	return { users, usersMap, loading, error, refetch: fetchUsers };
}

export function useUser(id: string | null) {
	const { token } = useAuth();

	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(!!id);
	const [error, setError] = useState<string | null>(null);

	const fetchUser = useCallback(async () => {
		if (!id) return;
		setLoading(true);
		setError(null);
		try {
			setUser(await usersService.getById(id, token ?? undefined));
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erro');
		} finally {
			setLoading(false);
		}
	}, [id, token]);

	useEffect(() => {
		fetchUser();
	}, [fetchUser]);

	const updateUser = useCallback(
		async (data: {
			username?: string;
			email?: string;
			bio?: string;
			avatar?: File;
		}) => {
			if (!id) return;
			await usersService.update(id, data, token ?? undefined);
			await fetchUser();
		},
		[id, token, fetchUser],
	);

	return { user, loading, error, refetch: fetchUser, updateUser };
}
