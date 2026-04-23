import {createSchema} from 'graphql-yoga';

export const schema =createSchema({
    typeDefs:`{
        type Query{
            getAllCvs():[Cv],
            getCv(id:Int!):Cv
        }
        type Cv{
            id:Int!,
            userId:Int!,
            title:String!,
            age:Int!,
            Job:String!
        }
        enum Role{
            USER,
            ADMIN
        }
        type User{
            id:Int!,
            name:String!,
            email:String!,
            Role:Role!
        }
        type Skill{
        {
            id:Int!,
            designation:String!,
        }
        type CvSkill{
            cvId:Int!,
            skillId:Int!
        }
        type Mutation{
            // reached this part 
        }
    }`,
    resolvers:{

    }
});