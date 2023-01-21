import { Request, Response } from 'express';

import { Word } from './word-model';

import { IFindWord } from '../../interfaces/find-word-interface';

import { LIMIT_DEFAULT, LIMIT_MAXIMO } from '../../utils/consts';

export default class JournalistController {
    async find(request: Request, response: Response) {
        try {
            const filters: IFindWord = request.query as any;
            const limit: number = filters.limit && !isNaN(+filters.limit) && filters.limit < LIMIT_MAXIMO ?
                +filters.limit : LIMIT_DEFAULT;
            const offset: number = filters.offset || 0;
            const query = Word.query();
            const queryCount = Word.query();

            if (filters.word) {
                query.where('word', 'like', `${filters.word}%`);
                queryCount.where('word', 'like', `${filters.word}%`);
            }

            const usuarios = await query.select().limit(limit).offset(offset).orderBy('id', 'ASC');
            const count: any[] = await queryCount.select().count();

            return response.status(200).send({ rows: usuarios, count: Array.isArray(count) && count.length > 0 ? +count[0].count : 0 });
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar palavras', message: error.message });
        }
    }
}