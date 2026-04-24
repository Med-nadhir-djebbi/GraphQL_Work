import {createYoga} from 'graphql-yoga';
import {createServer, request} from 'node:http';
import {schema} from './schema';
import {db} from './db';

const yoga = createYoga({
  schema,
  context: () => {
    return { db };
  },
});
const server = createServer(yoga);

server.listen(4000,()=>{
    console.log('Server is running on http://localhost:4000/graphql');
});