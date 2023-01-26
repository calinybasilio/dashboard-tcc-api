import { Request, Response } from "express";

import { IFilterIncidenceOfWordsPerJournalists } from "../../interfaces/filter-incidence-of-words-per-journalists.interface";
import { IGeneralStatistics } from "../../interfaces/general-statistics.interface";
import { ITweetsStatistics } from "../../interfaces/tweets-statistics-result.interface";
import {
  mappingIteractionTypeToFolderName,
  mappingLabelsMonths,
  monthsImportations,
} from "../../utils/consts";
import { Tweet } from "../tweets/tweet-model";
import { raw } from "objection";
import { IFilterTweetsPerMonth } from "../../interfaces/filter-tweets-per-month.interface";
import ValidadoresSerive from "../../utils/validadores-service";
import { Incidence } from "../incidence/incidence-model";

export default class DashboardController {
  async tweetStatistics(request: Request, response: Response) {
    try {
      const query = Tweet.query().alias("t");

      const result = await query
        .select("j.localityId")
        .joinRelated("journalist", { alias: "j" })
        .count("*")
        .groupBy("j.localityId")
        .orderBy("j.localityId", "ASC");

      const totalBhTweets = result?.length ? +(result[0] as any).count : 0;
      const totalMvTweets = result?.length ? +(result[1] as any).count : 0;
      return response.status(200).send({
        totalTweets: totalBhTweets + totalMvTweets,
        totalBhTweets,
        totalMvTweets,
      } as ITweetsStatistics);
    } catch (error: any) {
      return response.status(400).json({
        error: "Erro ao buscar estatísticas",
        message: error.message,
      });
    }
  }

  async incidenceOfWordsPerJournalists(request: Request, response: Response) {
    try {
      const filters: IFilterIncidenceOfWordsPerJournalists =
        request.body as any;

      const statistic: IGeneralStatistics = {
        labels: [],
        datasets: [
          {
            label: `Incidência (${
              mappingIteractionTypeToFolderName[filters.iteractionType]
            })`,
            data: [],
          },
        ],
      };

      const query = Incidence.query().alias("i");

      if (ValidadoresSerive.validNumberQueryParam(filters.journalistId)) {
        query.where("i.journalistId", +filters.journalistId);
      }

      if (ValidadoresSerive.validNumberQueryParam(filters.iteractionType)) {
        query.where("i.iteractionType", +filters.iteractionType);
      }

      if (ValidadoresSerive.validNumberQueryParam(filters.localityId)) {
        query.where("j.localityId", +filters.localityId);
      }

      if (monthsImportations.indexOf(filters.month) > -1) {
        query.where("i.month", filters.month);
      }

      const incidences = await query
        .select("w.word")
        .joinRelated("journalist", { alias: "j" })
        .joinRelated("word", { alias: "w" })
        .sum("i.count")
        .groupBy("w.word")
        .limit(20)
        .orderBy("sum", "DESC")
        .orderBy("w.word", "ASC");

      (incidences || []).forEach((item) => {
        statistic.labels.push((item as any).word);
        statistic.datasets[0].data.push((item as any).sum);
      });

      return response.status(200).send(statistic);
    } catch (error: any) {
      return response.status(400).json({
        error: "Erro ao buscar estatísticas",
        message: error.message,
      });
    }
  }

  async tweetPerMonth(request: Request, response: Response) {
    try {
      const filters: IFilterTweetsPerMonth = request.query as any;

      const query = Tweet.query().alias("t");

      if (ValidadoresSerive.validNumberQueryParam(filters.journalistId)) {
        query.where("t.journalistId", +filters.journalistId);
      }

      if (ValidadoresSerive.validNumberQueryParam(filters.localityId)) {
        query.where("j.localityId", filters.localityId);
      }

      const result = await query
        .select(raw("to_char(t.date_tweet, 'MM') as month"))
        .count("*")
        .joinRelated("journalist", { alias: "j" })
        .groupBy(raw("to_char(t.date_tweet, 'MM')"))
        .orderBy(raw("to_char(t.date_tweet, 'MM')"), "ASC");

      const statistic: IGeneralStatistics = {
        labels: [],
        datasets: [
          {
            label: `Tweets`,
            data: [],
          },
        ],
      };

      (result || []).forEach((item) => {
        statistic.labels.push(mappingLabelsMonths[(item as any).month]);
        statistic.datasets[0].data.push((item as any).count);
      });

      return response.status(200).send(statistic);
    } catch (error: any) {
      return response.status(400).json({
        error: "Erro ao buscar estatísticas",
        message: error.message,
      });
    }
  }
}
