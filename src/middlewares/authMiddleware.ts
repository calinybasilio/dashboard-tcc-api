import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { User } from '../modules/usuario/user-model';

import { ITokenPayload } from '../interfaces/token-payload-interface';

import dotenv from 'dotenv';

dotenv.config();

export default async function authMiddleware(request: Request, response: Response, next: NextFunction) {
    let token, decodedToken, userId;
    try {
        const { authorization } = request.headers;
        if (!authorization) {
            response.sendStatus(401);
            return;
        }

        token = authorization?.replace('Bearer', '').trim();
        decodedToken = jwt.verify(token as string, `${process.env.JWT_KEY}`);
        userId = (decodedToken as ITokenPayload).id;

        const user = await User.query().findById(userId);
        request.user = user;

        next();
    } catch (error: any) {
        response.sendStatus(401);
    }
};