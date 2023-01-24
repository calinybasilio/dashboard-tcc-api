const fs = require("fs");

import { Request, Response } from "express";

import { IImportTweets } from "../../interfaces/import-tweets.interface";

import { mappingLocalityToFolderName } from "../../utils/consts";
import { Transaction } from "objection";
import { ELocalities } from "../../utils/enums";
import { Tweet } from "./tweet-model";
import moment from "moment";

export default class TweetsController {
  async import(request: Request, response: Response) {
    let transaction: Transaction = null;

    try {
      const data: IImportTweets = request.body;

      if (
        [ELocalities.BELO_HORIZONTE, ELocalities.MONTEVIDEO].indexOf(
          data.localityId
        ) === -1
      ) {
        throw new Error("Indenfiticador da Localidade inválido!");
      }

      const path = `src/utils/jsons/tweets/${
        mappingLocalityToFolderName[data.localityId]
      }.json`;
      const jsonString = fs.readFileSync(path);
      const jsonParsed: any = JSON.parse(jsonString);

      transaction = await Tweet.startTransaction();

      response.status(200).send(true);

      const numberOftweets = Object.keys(
        jsonParsed[Object.keys(jsonParsed)[0]]
      ).length;

      let countImported = 0;

      for (var index = 0; index < numberOftweets; index++) {
        countImported++;
        const tweetId = String(jsonParsed["tw_id"][index]);
        const tweet: Tweet[] = await Tweet.query(transaction)
          .select("tweet.id")
          .where("id", tweetId);

        if (tweet?.length) {
          await Tweet.query(transaction)
            .findById(tweetId)
            .patch({
              tweet: jsonParsed["texto"][index],
              likes: jsonParsed["likes"][index],
              replys: jsonParsed["replys"][index],
              retweets: jsonParsed["retweets"][index],
              dateTweet: moment(jsonParsed["data"][index]).format("YYYY-MM-DD"),
              journalistId: jsonParsed["autor"][index],
            });
        } else {
          await Tweet.query(transaction).insert({
            id: tweetId,
            tweet: jsonParsed["texto"][index],
            likes: jsonParsed["likes"][index],
            replys: jsonParsed["replys"][index],
            retweets: jsonParsed["retweets"][index],
            dateTweet: moment(jsonParsed["data"][index]).format("YYYY-MM-DD"),
            journalistId: jsonParsed["autor"][index],
          });
        }

        console.log(`Importando tweet ${countImported} de ${numberOftweets}!`);
      }
      await transaction.commit();
      console.log(`Importação finalizada!`);
    } catch (error: any) {
      if (transaction) {
        await transaction.rollback();
      }
      return response.status(400).json({
        error: "Erro ao importar tweets",
        message: error.message,
      });
    }
  }
}
