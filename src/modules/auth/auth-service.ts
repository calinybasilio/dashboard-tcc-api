import moment from 'moment';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import database from '../../database/connection';

import { IAuthenticateBody } from '../../interfaces/authenticate-body-interface';
import { ILoginResult } from '../../interfaces/login-result';
import { IUser } from '../../interfaces/user-interface';

import CriptPasswordSerive from '../../utils/cript-password-service';
import ValidadoresSerive from '../../utils/validadores-service';

import { User } from '../usuario/user-model';

dotenv.config();

export default class AuthService {
    constructor() { };

    async authenticate(filters: IAuthenticateBody): Promise<ILoginResult> {
        try {
            ValidadoresSerive.validEmail((filters as IAuthenticateBody).email);
            ValidadoresSerive.validPassword((filters as IAuthenticateBody).password);
            const user: User[] = await database('user')
                .select('user.*')
                .where('user.email', (filters as IAuthenticateBody).email)
                .limit(1)
                .offset(0);

            if (Array.isArray(user) && user.length > 0) {
                if (!user[0].active) {
                    throw new Error('Usuário foi desativado!');
                }
                
                let isUserValid: boolean = CriptPasswordSerive.decrypt((filters as IAuthenticateBody).password, (user[0] as IUser).password as string);

                if (isUserValid) {
                    const { token, decoded } = this.signToken({ id: user[0].id });

                    return {
                        token,
                        expiresIn: moment.unix(decoded.exp).toDate(),
                        user: {
                            id: user[0].id,
                            name: user[0].name,
                        }
                    } as ILoginResult;
                } else {
                    throw new Error('Credenciais inválidas!');
                }
            } else {
                throw new Error('Não existe um usuário para o Email informado!');
            }
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