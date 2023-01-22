const fs = require("fs");

import { Request, Response } from "express";
import { Transaction } from "objection";

import { IImportIncidenceOfWords } from "../../interfaces/import-incidence-of-words.interface";
import { mappingIteractionTypeToFolderName } from "../../utils/consts";

import { Journalist } from "../journalist/journalist-model";
import { Word } from "../word/word-model";
import { IncidenceOfWords } from "./incidence-of-words-model";

export default class IncidenceOfWordsController {
  async import(request: Request, response: Response) {
    let transaction: Transaction = null;

    try {
      const data: IImportIncidenceOfWords = request.body;
      const journalist = await Journalist.query()
        .select()
        .where("id", +data.journalistId);

      if (!journalist?.length) {
        throw new Error("Indenfiticador do Jornalista inválido!");
      }

      const path = `src/utils/jsons/incidence-of-words-journalists/${
        mappingIteractionTypeToFolderName[data.iteractionType]
      }/${data.journalistId}.json`;
      const jsonString = fs.readFileSync(path);
      const jsonParsed: any = JSON.parse(jsonString);

      transaction = await Journalist.startTransaction();

      if (!journalist?.length) {
        throw new Error("Dados dos Jornalistas não foram informados!");
      }

      response.status(200).send(true);

      const numberOfWords = Object.keys(jsonParsed).length;
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

        await IncidenceOfWords.query(transaction).insert({
          count: jsonParsed[wordKey][0],
          wordId: +(wordToUse as any).id,
          journalistId: +data.journalistId,
          iteractionType: +data.iteractionType,
        });
        console.log(`Importando palavra ${countImported} de ${numberOfWords}!`);
      }
      await transaction.commit();
      console.log(`Importação finalizada!`);
    } catch (error: any) {
      if (transaction) {
        await transaction.rollback();
      }
      return response.status(400).json({
        error: "Erro ao importar jornalistas",
        message: error.message,
      });
    }
  }
}
