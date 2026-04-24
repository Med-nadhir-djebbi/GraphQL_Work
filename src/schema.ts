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
            role:Role!
            Cvs:[Cv!]!
        }
        type Skill{
        
            id:Int!
            designation:String!
            Cvs:[Cv!]!

        }
        
    `,
    resolvers: {
        Role: {
            USER: "User",
            ADMIN: "Admin"
        },
        Query: {
            getAllCvs(_, __, context) {
            return context.db.cvs;
            },
            getCv(_, args, context) {
            return context.db.cvs.find(cv => cv.id === args.id);
            }
        },
        Cv: {
            user(parent, _, context) {
            return context.db.users.find(u => u.id === parent.userId);
            },
            skills(parent, _, context) {
            const cvskills = context.db.cvSkills.filter(c => c.cvId === parent.id);
            return cvskills
                .map(c => context.db.skills.find(s => s.id === c.skillId))
                .filter(Boolean);
            }
        },
        User: {
            Cvs(parent, _, context) {
            return context.db.cvs.filter(cv => cv.userId === parent.id);
            }
        },
        Skill: {
            Cvs(parent, _, context) {
            const links = context.db.cvSkills.filter(c => c.skillId === parent.id);
            return links
                .map(l => context.db.cvs.find(cv => cv.id === l.cvId))
                .filter(Boolean);
            }
        }
    }
});