import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import moment from 'moment';

import { IAuthenticateBody } from '../../interfaces/authenticate-body-interface';
import { IAuthenticatedUser } from '../../interfaces/authenticated-user.interface';
import { ILoginResult } from '../../interfaces/login-result';

dotenv.config();

export default class AuthService {
    constructor() { };

    async authenticate(filters: IAuthenticateBody): Promise<ILoginResult> {
        try {
            let user: IAuthenticatedUser = {
                id: 1,
                name: 'Caliny Basilio'
            };

            console.log('process.env.EMAIL->', process.env.EMAIL);
            console.log('process.env.PASSWORD_ENCRYPTED->', process.env.PASSWORD_ENCRYPTED);

            if (filters.email !== process.env.EMAIL
                || filters.password !== process.env.PASSWORD_ENCRYPTED) {
                throw new Error('Credenciais inválidas!');
            }

            const { token, decoded } = this.signToken({ id: user.id });

            return {
                token,
                expiresIn: moment.unix(decoded.exp).toDate(),
                user
            } as ILoginResult;
        } catch (error) {
            throw error;
        }
    }

    private signToken(dataToken: any, expires: string = '14d') {
        const token = jwt.sign(dataToken, `${process.env.JWT_KEY}`, { expiresIn: expires });
        const decoded = jwt.decode(token) as any;
        return { token, decoded };
    }
}