import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Demo Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Demo users
        const demoUsers = [
          {
            id: "1",
            email: "admin@demo.com",
            password: "admin123",
            name: "Demo Admin",
            role: "admin"
          },
          {
            id: "2",
            email: "teacher@demo.com",
            password: "teacher123",
            name: "Demo Teacher",
            role: "teacher"
          }
        ];

        const user = demoUsers.find(u => 
          u.email === credentials.email && 
          u.password === credentials.password
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const isAdmin = user.email === process.env.ADMIN_EMAIL;
        user.role = isAdmin ? 'admin' : 'teacher';
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 