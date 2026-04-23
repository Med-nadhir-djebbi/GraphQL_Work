import {createYoga} from 'graphql-yoga';
import {createServer} from 'node:http';
import {schema} from './schema';
import {context} from './context';

const yoga= createYoga({schema,context});
const server = createServer(yoga);

server.listen(4000,()=>{
    console.log('Server is running on http://localhost:4000/graphql');
});