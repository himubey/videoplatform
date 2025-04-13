import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

// Demo users configuration
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
  },
  {
    id: "3",
    email: "student@demo.com",
    password: "student123",
    name: "Demo Student",
    role: "student"
  }
];

export const authOptions = {
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
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both email and password');
        }

        const user = demoUsers.find(u => 
          u.email === credentials.email && 
          u.password === credentials.password
        );

        if (!user) {
          throw new Error('Invalid email or password');
        }

        // Check if user exists in database
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // If user doesn't exist, create one
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              role: user.role,
            },
          });
        }

        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
          session.user.name = dbUser.name;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}; 