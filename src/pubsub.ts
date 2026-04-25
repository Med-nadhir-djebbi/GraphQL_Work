import { createPubSub } from 'graphql-yoga';

export type CvMutationType = 'CREATED' | 'UPDATED' | 'DELETED';

type PubSubChannels = {
    CV_CHANGED: [{ mutationType: CvMutationType; cv: { id: number } | null }];
};

export const pubSub = createPubSub<PubSubChannels>();
