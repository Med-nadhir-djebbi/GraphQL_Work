import { createSchema } from 'graphql-yoga';
import type { GraphQLContext } from './server';

export const schema = createSchema<GraphQLContext>({
    typeDefs: `
        type Query {
            getAllCvs: [Cv!]!
            getCv(id: Int!): Cv
        }

        type Cv {
            id: Int!
            title: String!
            job: String!
            age: Int!
            user: User!
            skills: [Skill!]!
        }

        enum Role {
            USER
            ADMIN
        }

        type User {
            id: Int!
            name: String!
            email: String!
            role: Role!
            cvs: [Cv!]!
        }

        type Skill {
            id: Int!
            name: String!
            cvs: [Cv!]!
        }

        input CreateCvInput {
            userId: Int!
            job: String!
            title: String!
            age: Int!
            skillsIds: [Int!]!
        }

        input UpdateCvInput {
            id: Int!
            age: Int
            job: String
            title: String
            skillsIds: [Int!]
        }

        type Mutation {
            addCv(CvInput: CreateCvInput!): Cv
            updateCv(UpdateInput: UpdateCvInput!): Cv
            deleteCv(id: Int!): String
        }
    `,
    resolvers: {
        Query: {
            getAllCvs: (_, __, context) => {
                return context.prisma.cv.findMany();
            },
            getCv: (_, args, context) => {
                return context.prisma.cv.findUnique({
                    where: { id: args.id }
                });
            }
        },
        Mutation: {
            addCv: (_, { CvInput }, context) => {
                const { userId, job, title, age, skillsIds } = CvInput;
                return context.prisma.cv.create({
                    data: {
                        title,
                        job,
                        age,
                        user: { connect: { id: userId } },
                        skills: {
                            create: skillsIds.map((skillId: number) => ({
                                skill: { connect: { id: skillId } }
                            }))
                        }
                    }
                });
            },
            updateCv: (_, { UpdateInput }, context) => {
                const { id, age, job, title, skillsIds } = UpdateInput;
                
                const updateData: any = {
                    age: age ?? undefined,
                    job: job ?? undefined,
                    title: title ?? undefined
                };

                if (skillsIds) {
                    updateData.skills = {
                        deleteMany: {}, 
                        create: skillsIds.map((skillId: number) => ({
                            skill: { connect: { id: skillId } }
                        }))
                    };
                }

                return context.prisma.cv.update({
                    where: { id },
                    data: updateData
                });
            },
            deleteCv: async (_, { id }, context) => {
                await context.prisma.cv.delete({
                    where: { id }
                });
                return `CV with ID ${id} was successfully deleted.`;
            }
        },
        Cv: {
            user: (parent, _, context) => {
                return context.prisma.cv.findUnique({ where: { id: parent.id } }).user();
            },
            skills: async (parent, _, context) => {
                const cvSkills = await context.prisma.cv
                    .findUnique({ where: { id: parent.id } })
                    .skills({ include: { skill: true } });
                
                return cvSkills?.map(joinRecord => joinRecord.skill) || [];
            }
        },
        User: {
            cvs: (parent, _, context) => {
                return context.prisma.user.findUnique({ where: { id: parent.id } }).cvs();
            }
        },
        Skill: {
            cvs: async (parent, _, context) => {
                const skillCvs = await context.prisma.skill
                    .findUnique({ where: { id: parent.id } })
                    .cvs({ include: { cv: true } });
                
                return skillCvs?.map(joinRecord => joinRecord.cv) || [];
            }
        },
        Role: {
            USER: "USER",
            ADMIN: "ADMIN"
        }
    }
});