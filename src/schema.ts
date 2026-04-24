import { createSchema } from 'graphql-yoga';
import { db } from './db';

type Contextdb={
    db : typeof db
}


export const schema = createSchema<Contextdb>({
    typeDefs: `
        type Query{
            getAllCvs:[Cv]
            getCv(id:Int!):Cv
        }
        type Cv{
            id:Int!
            user:User!
            title:String!
            skills:[Skill!]!
            age:Int!
            Job:String!
        }
        enum Role{
            USER
            ADMIN
        }
        type User{
            id:Int!
            name:String!
            email:String!
            Role:Role!
            Cvs:[Cv!]!
        }
        type Skill{
        
            id:Int!
            designation:String!
            Cvs:[Cv!]!

        }
        
    `,
    resolvers: {
        Query: {
            getAllCvs(parents, args, context) {
                return context.db.cvs;
            },
            getCv(parents, args, context) {
                return context.db.cvs.find((cv) => cv.id == args.id);
            }
        }
        
    }
});