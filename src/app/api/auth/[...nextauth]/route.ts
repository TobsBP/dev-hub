import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { API_BASE_URL } from '@/utils/consts/api';

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Senha', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;

				const response = await fetch(`${API_BASE_URL}/users`);
				if (!response.ok) return null;

				const users = await response.json();
				const user = users.find(
					(u: { email: string }) => u.email === credentials.email,
				);
				if (!user) return null;

				const valid = await bcrypt.compare(
					credentials.password,
					user.password_hash,
				);
				if (!valid) return null;

				return {
					id: user.id,
					name: user.username,
					email: user.email,
					image: user.avatar_url,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id;
			}
			return session;
		},
	},
	session: { strategy: 'jwt' },
	pages: { signIn: '/login' },
});

export { handler as GET, handler as POST };
