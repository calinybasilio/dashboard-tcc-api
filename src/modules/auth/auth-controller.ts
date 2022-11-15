import { Request, Response } from 'express';
import { IAuthenticateBody } from '../../interfaces/authenticate-body-interface';
import { ILoginResult } from '../../interfaces/login-result';
import AuthService from './auth-service';

export default class AuthController {

    constructor() { };

    async authenticate(request: Request, response: Response) {
        try {
            const filters: IAuthenticateBody = request.body;
            const service = new AuthService();
            const data: ILoginResult = await service.authenticate(filters);
            return response.status(200).send(data);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao realizar autenticação', message: error.message });
        }
    }

}