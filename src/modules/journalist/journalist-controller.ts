import { Request, Response } from 'express';
import { Transaction } from 'objection';
import { IJournalist } from '../../interfaces/journalist-interface';
import { Journalist } from './journalist-model';

export default class JournalistController {
    async import(request: Request, response: Response) {
        let transaction: Transaction = null;

        try {
            const data: IJournalist[] = request.body;
            transaction = await Journalist.startTransaction();

            if(!data?.length){
                throw new Error('Dados dos Jornalistas não foram informados!');
            }
           
            for(const journalist of data){
                await Journalist.query(transaction).insert({
                    id: journalist.id,
                    name: journalist.name,
                    user: journalist.user,
                    localityId: journalist.localityId
                });
            }

            await transaction.commit();
            return response.status(201).send(true);
        } catch (error: any) {
            if (transaction) {
                await transaction.rollback();
            }
            return response.status(400).json({ error: 'Erro ao importar jornalistas', message: error.message });
        }
    }

    async find(request: Request, response: Response) {
        try {
            const journalists = await Journalist.query().select().orderBy('id', 'ASC');
            return response.status(200).send(journalists);
        } catch (error: any) {
            return response.status(400).json({ error: 'Erro ao consultar usuários', message: error.message });
        }
    }
}