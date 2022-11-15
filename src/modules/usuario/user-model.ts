import { Model } from 'objection';
import { IUser } from '../../interfaces/user-interface';

export class User extends Model implements IUser {
    id?: number;
    name: string;
    email: string;
    password?: string;
    active: boolean;
    createTime?: string;
    updateTime?: string;

    static get tableName() {
        return 'user';
    }

    static jsonSchema = {
        type: 'object',
        required: ['name', 'email'],

        properties: {
            id: { type: 'integer' },
            name: { type: 'string', maxLength: 50 },
            email: { type: 'string', maxLength: 70 },
            password: { type: ['string', 'null'], maxLength: 70 },
            active: { type: 'boolean', default: true },
            createTime: { type: 'string', format: 'date-time' },
            updateTime: { type: 'string', format: 'date-time' }
        }
    }

    private async uniqueViolations(update: boolean = false) {
        let users: User[];
        if (update) {
            users = await User.query().select()
                .where('id', '!=', this.id)
                .where('email', '=', this.email);
        } else {
            users = await User.query().select()
                .where('email', '=', this.email);
        }

        if (Array.isArray(users) && users.length > 0) {
            throw new Error('Já existe um usuário com o email informado!');
        }
    }

    async $beforeInsert() {
        this.createTime = new Date().toISOString();
        await this.uniqueViolations();

    }

    async $beforeUpdate() {
        this.updateTime = new Date().toISOString();
        await this.uniqueViolations(true);
    }

}