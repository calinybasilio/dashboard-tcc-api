import { Request, Response } from 'express';

import CriptPasswordSerive from '../../utils/cript-password-service';
import ValidadoresSerive from '../../utils/validadores-service';

export default class UserController {
    async create(request: Request, response: Response) {
        try {
            const data: any = request.body;

            ValidadoresSerive.validEmail(data.email);
            ValidadoresSerive.validPassword(data.senha as string);
            if (data.senha !== data.confirmarSenha) {
                throw new Error('Senha não confere com a confirmação!');
            }

            const senhaEncriptada = CriptPasswordSerive.encrypt(data.senha);
        
            return response.status(201).send({senhaEncriptada});
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao criar usuário', message: error.message });
        }
    }
}