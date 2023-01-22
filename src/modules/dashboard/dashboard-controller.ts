import { Request, Response } from "express";

import { IFilterIncidenceOfWordsPerJournalists } from "../../interfaces/filter-incidence-of-words-per-journalists.interface";
import { IGeneralStatistics } from "../../interfaces/general-statistics.interface";

import { IncidenceOfWords } from "../incidence-of-words/incidence-of-words-model";

import { mappingIteractionTypeToFolderName } from "../../utils/consts";

export default class DashboardController {
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
            data: []
          }
        ]
      };

      const query = IncidenceOfWords.query().alias("i");

      if (
        !isNaN(+filters.journalistId) &&
        filters.journalistId !== null &&
        filters.journalistId !== undefined &&
        (filters.journalistId as any) !== ""
      ) {
        query.where("i.journalistId", +filters.journalistId);
      }

      if (
        !isNaN(+filters.iteractionType) &&
        filters.iteractionType !== null &&
        filters.iteractionType !== undefined &&
        (filters.iteractionType as any) !== ""
      ) {
        query.where("i.iteractionType", +filters.iteractionType);
      }

      if (
        !isNaN(+filters.localityId) &&
        filters.localityId !== null &&
        filters.localityId !== undefined &&
        (filters.localityId as any) !== ""
      ) {
        query.where("j.localityId", +filters.localityId);
      }

      const incidences = await query
        .select("w.word")
        .joinRelated("journalist", { alias: "j" })
        .joinRelated("word", { alias: "w" })
        .sum("i.count")
        .groupBy("w.word")
        .limit(20)
        .orderBy("sum", "DESC");

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
}
