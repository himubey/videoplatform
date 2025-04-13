import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Ensure NEXTAUTH_SECRET is set
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Please provide process.env.NEXTAUTH_SECRET');
}

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
        try {
          console.log('Received credentials:', credentials);
          
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials');
            throw new Error('Please enter both email and password');
          }

          const user = demoUsers.find(u => 
            u.email === credentials.email && 
            u.password === credentials.password
          );

          console.log('Found demo user:', user);

          if (!user) {
            console.log('No matching demo user found');
            throw new Error('Invalid email or password');
          }

          try {
            // Check if user exists in database
            let dbUser = await prisma.user.findUnique({
              where: { email: user.email },
            });

            console.log('Database user check:', dbUser);

            // If user doesn't exist, create one
            if (!dbUser) {
              console.log('Creating new user in database');
              dbUser = await prisma.user.create({
                data: {
                  email: user.email,
                  name: user.name,
                  role: user.role,
                },
              });
              console.log('Created new user:', dbUser);
            }

            return {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              role: dbUser.role
            };
          } catch (dbError) {
            console.error('Database error:', dbError);
            // If database operation fails, still allow login with demo credentials
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            };
          }
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // If you're updating the session via the update trigger
      if (trigger === "update" && token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;

        // Double-check with database
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        
        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.role = dbUser.role;
          session.user.name = dbUser.name;
        }

        console.log('Session after modification:', session);
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name,
                role: "teacher", // Default role for Google sign-in
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return true;
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
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 