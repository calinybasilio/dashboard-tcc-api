import { Model } from 'objection';
import { IIncidenceOfWords } from '../../interfaces/incidence-of-words-interface';

import { Word } from '../word/word-model';
import { Journalist } from '../journalist/journalist-model';

export class IncidenceOfWords extends Model implements IIncidenceOfWords {
    id?: number;
    count: number;
    wordId: number;
    journalistId: number;   

    static get tableName() {
        return 'incidence_of_words';
    }

    static jsonSchema = {
        type: 'object',
        required: ['count','wordId', 'journalistId'],

        properties: {
            id: { type: 'integer' },
            count: { type: 'integer' },
            wordId: { type: 'integer' },
            journalistId: { type: 'integer' },
        }
    }

    static relationMappings = {
        word: {
            relation: Model.HasOneRelation,
            modelClass: Word,
            join: {
                from: 'incidence_of_words.wordId',
                to: 'word.id'
            }
        },
        journalist: {
            relation: Model.HasOneRelation,
            modelClass: Journalist,
            join: {
                from: 'incidence_of_words.journalistId',
                to: 'journalist.id'
            }
        }
    };

}