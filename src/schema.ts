import { createSchema } from 'graphql-yoga';
import { db } from './db';
import { getCvService } from './services';
import { pubSub } from './pubsub';

type Contextdb = {
  db: typeof db
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
            job:String!
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
        input CreateCvInput{
            userId:Int!
            title:String!
            age:Int!
            job:String!
            skillsIds:[Int!]!
        }
        input UpdateCvInput{
            id:Int!
            title:String
            age:Int
            job:String
            skillsIds:[Int!]
        }
        type Mutation{
            addCv(CvInput:CreateCvInput!):Cv
            updateCv(UpdateInput:UpdateCvInput!):Cv
            deleteCv(id:Int!):String
        }
        enum CvMutationType{
            CREATED
            UPDATED
            DELETED
        }
        type CvMutationPayload{
            mutationType: CvMutationType!
            cv: Cv
        }
        type Subscription{
            cvChanged: CvMutationPayload!
        }
    `,
  resolvers: {
    Mutation: {
      addCv(_, { CvInput }, context) {
        if (!context.db.users.some((u) => u.id === CvInput.userId))
          throw new Error("User not found");
        const newId = Math.max(...context.db.cvs.map((c) => c.id)) + 1;
        const newCv = {
          id: newId,
          userId: CvInput.userId,
          title: CvInput.title,
          age: CvInput.age,
          job: CvInput.job
        };
        context.db.cvs.push(newCv);
        for (const skill of CvInput.skillsIds) {
          if (context.db.skills.some((s) => s.id === skill))
            context.db.cvSkills.push({ cvId: newId, skillId: skill });
        }
        pubSub.publish('CV_CHANGED', { mutationType: 'CREATED', cv: newCv });
        return newCv;
      },
      updateCv(_, { UpdateInput }, context) {
        let cv = getCvService(UpdateInput.id);
        if (!cv)
          throw new Error("Cv not found");
        if (UpdateInput.title !== undefined) cv.title = UpdateInput.title;
        if (UpdateInput.age !== undefined) cv.age = UpdateInput.age;
        if (UpdateInput.job !== undefined) cv.job = UpdateInput.job;
        if (UpdateInput.skillsIds) {
          for (const skill of UpdateInput.skillsIds) {
            if (context.db.skills.some((s) => s.id == skill && !context.db.cvSkills.some((sk) => sk.skillId == skill)))
              context.db.cvSkills.push({ cvId: cv.id, skillId: skill });
          }
        }
        const index = context.db.cvs.findIndex((c) => c.id === cv.id);
        context.db.cvs[index] = cv;
        pubSub.publish('CV_CHANGED', { mutationType: 'UPDATED', cv: cv });
        return cv;
      },
      deleteCv(_, { id }, context) {
        let index = context.db.cvs.findIndex((c) => c.id === id);
        if (index === -1)
          throw new Error("Cv not Found");
        const deleted = context.db.cvs[index];
        context.db.cvs.splice(index, 1);
        pubSub.publish('CV_CHANGED', { mutationType: 'DELETED', cv: deleted });
        return "Cv deleted";
      }
    },
    Role: {
      USER: "User",
      ADMIN: "Admin"
    },
    Query: {
      getAllCvs(_, __, context) {
        return context.db.cvs;
      },
      getCv(_, args, context) {
        return getCvService(args.id);
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
    },
    Subscription: {
      cvChanged: {
        subscribe: () => pubSub.subscribe('CV_CHANGED'),
        resolve: (payload: { mutationType: string; cv: any }) => payload,
      }
    }
  }
});
