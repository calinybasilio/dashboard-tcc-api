import { Model } from 'objection';
import { IWord } from '../../interfaces/word-interface';

export class Word extends Model implements IWord {
    id?: number;
    word: string;

    static get tableName() {
        return 'word';
    }

    static jsonSchema = {
        type: 'object',
        required: ['word'],

        properties: {
            id: { type: 'integer' },
            word: { type: 'string', maxLength: 70 }
        }
    }

}