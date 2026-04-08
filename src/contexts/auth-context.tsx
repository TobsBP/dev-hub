'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { usersService } from '@/services/users.service';

export interface AuthUser {
	id: string;
	username: string;
	email: string;
	avatar_url: string | null;
}

interface AuthContextValue {
	user: AuthUser | null;
	token: string | null;
	initialized: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'devhub_auth';

interface StoredAuth {
	token: string;
	expireAt: string;
	user: AuthUser;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const [user, setUser] = useState<AuthUser | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const stored: StoredAuth = JSON.parse(raw);
				if (new Date(stored.expireAt) > new Date()) {
					setToken(stored.token);
					setUser(stored.user);
				} else {
					localStorage.removeItem(STORAGE_KEY);
				}
			}
		} catch {
			localStorage.removeItem(STORAGE_KEY);
		} finally {
			setInitialized(true);
		}
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setUser(null);
		localStorage.removeItem(STORAGE_KEY);
		router.push('/login');
	}, [router]);

	const login = useCallback(
		async (email: string, password: string) => {
			const { token: newToken, expireAt } = await authService.login(
				email,
				password,
			);
			const users = await usersService.getAll(newToken);
			const found = users.find((u) => u.email === email);
			if (!found) throw new Error('Usuário não encontrado');

			const authUser: AuthUser = {
				id: found.id,
				username: found.username,
				email: found.email,
				avatar_url: found.avatar_url,
			};

			setToken(newToken);
			setUser(authUser);
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ token: newToken, expireAt, user: authUser }),
			);
		},
		[],
	);

	useEffect(() => {
		const handler = () => logout();
		window.addEventListener('auth:unauthorized', handler);
		return () => window.removeEventListener('auth:unauthorized', handler);
	}, [logout]);

	return (
		<AuthContext.Provider value={{ user, token, initialized, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
	return ctx;
}
