import { Model } from 'objection';
import { Journalist } from '../journalist/journalist-model';
import { ITweet } from '../../interfaces/tweets.interface';

export class Tweet extends Model implements ITweet {
    id: string;
    tweet: string;
    likes: number;
    replys: number;
    retweets: number;
    dateTweet: Date | string;
    journalistId: number;   

    static get tableName() {
        return 'tweet';
    }

    static jsonSchema = {
        type: 'object',
        required: ['id', 'tweet','replys', 'retweets', 'dateTweet', 'journalistId'],

        properties: {
            id: { type: 'string', maxLength: 19 },
            tweet: { type: 'string' },
            likes: { type: 'integer' },
            replys: { type: 'integer' },
            retweets: { type: 'integer' },
            dateTweet: { type: 'string', format: 'date' },
            journalistId: { type: 'integer' }
        }
    }

    static relationMappings = {
        journalist: {
            relation: Model.HasOneRelation,
            modelClass: Journalist,
            join: {
                from: 'tweet.journalistId',
                to: 'journalist.id'
            }
        }
    };

}