// import 'dotenv/config';
// import type { PrismaConfig } from 'prisma';
// import { env } from 'prisma/config';

// export default {
//   schema: 'prisma/schema.prisma',
//   migrations: {
//     path: 'prisma/migrations',
//     seed: 'tsx prisma/seed.ts',
//   },
//   datasource: {
//     url: env('DATABASE_URL'),
//   },
// } satisfies PrismaConfig;

import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'), // <- this is now the correct place
  },
});
