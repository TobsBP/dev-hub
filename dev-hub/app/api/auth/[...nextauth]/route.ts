import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // TODO: trocar pela rota correta quando souber
        const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) return null;

        const { token, user } = await response.json();

        // Retorna o user com o token junto pra salvar na sessão
        return {
          id: user.id,
          name: user.username,
          email: user.email,
          image: user.avatar_url,
          token, // <-- guarda o token
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Na primeira vez que loga, user vem preenchido
      if (user) token.accessToken = (user as any).token;
      return token;
    },
    async session({ session, token }) {
      // Expõe o token na sessão pra usar nos requests
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
});

export { handler as GET, handler as POST };