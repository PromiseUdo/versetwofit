// import { NextAuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import bcrypt from 'bcryptjs';
// import { prisma } from './prisma';

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma) as any,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       profile(profile) {
//         return {
//           id: profile.sub,
//           name: profile.name,
//           email: profile.email,
//           image: profile.picture,
//           role: 'CUSTOMER',
//         };
//       },
//     }),
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error('Invalid credentials');
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email },
//         });

//         if (!user || !user.password) {
//           throw new Error('Invalid credentials');
//         }

//         const isCorrectPassword = await bcrypt.compare(
//           credentials.password,
//           user.password
//         );

//         if (!isCorrectPassword) {
//           throw new Error('Invalid credentials');
//         }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//           image: user.image,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, account }) {
//       // For OAuth providers, ensure user has a role
//       if (account?.provider === 'google') {
//         const existingUser = await prisma.user.findUnique({
//           where: { email: user.email! },
//         });

//         // If user exists but has no role, set default role
//         if (existingUser && !existingUser.role) {
//           await prisma.user.update({
//             where: { id: existingUser.id },
//             data: { role: 'CUSTOMER' },
//           });
//         }
//       }
//       return true;
//     },
//     async jwt({ token, user, trigger, session }) {
//       if (user) {
//         token.role = user.role;
//         token.id = user.id;
//       }

//       // Handle session updates
//       if (trigger === 'update' && session) {
//         token = { ...token, ...session };
//       }

//       return token;
//     },
//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.role = token.role as string;
//         session.user.id = token.id as string;
//       }
//       return session;
//     },
//     async redirect({ url, baseUrl }) {
//       // Allow relative callback URLs
//       if (url.startsWith('/')) return `${baseUrl}${url}`;
//       // Allow callback URLs on the same origin
//       else if (new URL(url).origin === baseUrl) return url;
//       return baseUrl;
//     },
//   },
//   pages: {
//     signIn: '/login',
//     error: '/login',
//   },
//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   debug: process.env.NODE_ENV === 'development',
// };

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'CUSTOMER',
        };
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        }

        // ✅ FIX: Convert null to empty string or provide default values
        return {
          id: user.id,
          email: user.email,
          name: user.name || 'User', // Convert null to default value
          role: user.role,
          image: user.image || undefined, // Convert null to undefined
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser && !existingUser.role) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { role: 'CUSTOMER' },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }

      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string | undefined;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
