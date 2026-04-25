import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import { schema } from './schema';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DATABASE_URL?.replace('file:', '') || './dev.db';
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });
export type GraphQLContext = {
  prisma: PrismaClient;
};
const yoga = createYoga<GraphQLContext>({
  schema,
  context: () => {
    return { prisma };
  },
});

const server = createServer(yoga);

server.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/graphql');
});