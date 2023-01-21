import { Model } from 'objection';
import { IJournalist } from '../../interfaces/journalist-interface';

export class Journalist extends Model implements IJournalist {
    id: number;
    name: string;
    user: string;
    localityId: number;
    createTime?: string;
    updateTime?: string;

    static get tableName() {
        return 'journalist';
    }

    static jsonSchema = {
        type: 'object',
        required: [ 'id','name', 'user', 'localityId'],

        properties: {
            id: { type: 'integer' },
            name: { type: 'string', maxLength: 50 },
            user: { type: 'string', maxLength: 70 },
            localityId: { type: 'integer' },
            createTime: { type: 'string', format: 'date-time' },
            updateTime: { type: 'string', format: 'date-time' }
        }
    }

}