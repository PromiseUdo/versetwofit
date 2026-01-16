// import NextAuth, { DefaultSession } from 'next-auth';
// import { JWT } from 'next-auth/jwt';

// declare module 'next-auth' {
//   interface User {
//     id: string;
//     role: string;
//   }

//   interface Session {
//     user: {
//       id: string;
//       role: string;
//     } & DefaultSession['user'];
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id: string;
//     role: string;
//   }
// }

// src/types/next-auth.d.ts (or wherever your types are)
import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    image?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      image?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
