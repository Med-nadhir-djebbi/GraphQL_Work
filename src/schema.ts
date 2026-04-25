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
            designation: String!
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
            getAllCvs: (_parent, _args, context) => context.prisma.cv.findMany(),
            getCv: (_parent, { id }, context) =>
                context.prisma.cv.findUnique({
                    where: { id }
                })
        },
        Mutation: {
            addCv: (_, { CvInput }, context) => {
                const { userId, job, title, age, skillsIds } = CvInput;
                const linkedSkills = skillsIds.map((skillId: number) => ({
                    skill: { connect: { id: skillId } }
                }));

                return context.prisma.cv.create({
                    data: {
                        title,
                        job,
                        age,
                        user: { connect: { id: userId } },
                        skills: { create: linkedSkills }
                    }
                });
            },
            updateCv: (_, { UpdateInput }, context) => {
                const { id, age, job, title, skillsIds } = UpdateInput;

                const updateData: {
                    age?: number;
                    job?: string;
                    title?: string;
                    skills?: {
                        deleteMany: {};
                        create: Array<{ skill: { connect: { id: number } } }>;
                    };
                } = {};

                if (age !== undefined) updateData.age = age;
                if (job !== undefined) updateData.job = job;
                if (title !== undefined) updateData.title = title;

                if (skillsIds !== undefined) {
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
            user: async (parent, _args, context) => {
                const cvQuery = context.prisma.cv.findUnique({ where: { id: parent.id } });
                return cvQuery.user();
            },
            skills: async (parent, _args, context) => {
                const cvWithSkills = await context.prisma.cv
                    .findUnique({ where: { id: parent.id } })
                    .skills({ include: { skill: true } });

                return cvWithSkills?.map((link) => link.skill) ?? [];
            }
        },
        User: {
            cvs: (parent, _args, context) => {
                return context.prisma.user.findUnique({ where: { id: parent.id } }).cvs();
            }
        },
        Skill: {
            cvs: async (parent, _args, context) => {
                const skillWithCvs = await context.prisma.skill
                    .findUnique({ where: { id: parent.id } })
                    .cvs({ include: { cv: true } });

                return skillWithCvs?.map((link) => link.cv) ?? [];
            }
        },
        Role: {
            USER: "USER",
            ADMIN: "ADMIN"
        }
    }
});