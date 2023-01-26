const fs = require("fs");

import { Request, Response } from "express";
import { Transaction } from "objection";

import { IImportIncidence } from "../../interfaces/import-incidence.interface";
import {
  mappingIteractionTypeToFolderName,
  monthsImportations,
} from "../../utils/consts";

import { Journalist } from "../journalist/journalist-model";
import { Word } from "../word/word-model";
import { Incidence } from "./incidence-model";

export default class IncidenceController {
  async import(request: Request, response: Response) {
    let transaction: Transaction = null;

    try {
      const data: IImportIncidence = request.body;
      const journalist = await Journalist.query()
        .select()
        .where("id", +data.journalistId);

      if (!journalist?.length) {
        throw new Error("Indenfiticador do Jornalista inválido!");
      }

      response.status(200).send(true);
      transaction = await Journalist.startTransaction();

      for (const month of monthsImportations) {
        const path = IncidenceController.mountPathFile(+data.journalistId, +data.iteractionType, month);

        let jsonString;
        try {
          jsonString = fs.readFileSync(path);
        } catch (error:any) {
          if (error.message.includes('no such file or directory')) {
            continue;
          }
          throw error;
        }

        const jsonParsed: any = JSON.parse(jsonString);

        const numberOfWordsMonth = Object.keys(jsonParsed).length;
        let countImported = 0;
        for (const wordKey in jsonParsed) {
          countImported++;
          const word: Word[] = await Word.query(transaction)
            .select("word.*")
            .where("word", wordKey);

          let wordToUse: Word;
          if (!word.length) {
            wordToUse = await Word.query(transaction).insert({
              word: wordKey,
            });
          } else {
            wordToUse = word[0];
          }

          await Incidence.query(transaction).insert({
            count: jsonParsed[wordKey][0],
            month: month,
            wordId: +(wordToUse as any).id,
            journalistId: +data.journalistId,
            iteractionType: +data.iteractionType,
          });
          console.log(
            `Importando palavra ${countImported} de ${numberOfWordsMonth} do mês ${month}!`
          );
        }
      }

      await transaction.commit();
      console.log(`Importação finalizada!`);
    } catch (error: any) {
      if (transaction) {
        await transaction.rollback();
      }
      console.log({
        error: "Erro ao importar jornalistas",
        message: error.message,
      });
    }
  }

  static mountPathFile(journalistId: number, iteractionType: number, month:string): string{
    return `src/utils/jsons/incidence-of-words-journalists/${
      mappingIteractionTypeToFolderName[iteractionType]
    }/${journalistId}_${month}.json`;
  }

}
