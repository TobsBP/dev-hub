import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { API_BASE_URL } from '@/utils/consts/api';

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Senha', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: credentials.email,
						password: credentials.password,
					}),
				});
				if (!loginRes.ok) return null;

				const { token } = await loginRes.json();
				if (!token) return null;

				const usersRes = await fetch(`${API_BASE_URL}/users`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (!usersRes.ok) return null;

				const users = await usersRes.json();
				const user = users.find(
					(u: { email: string }) => u.email === credentials.email,
				);
				if (!user) return null;

				return {
					id: user.id,
					name: user.username,
					email: user.email,
					image: user.avatar_url,
					token,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.accessToken = (user as { token?: string }).token;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
			}
			session.accessToken = token.accessToken;
			return session;
		},
	},
	session: { strategy: 'jwt' },
	pages: { signIn: '/login' },
};
