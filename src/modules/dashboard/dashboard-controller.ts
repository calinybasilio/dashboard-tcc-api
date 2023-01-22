import { Request, Response } from "express";

import { IIncidenceOfWordsPerJournalists } from "../../interfaces/filter-incidence-of-words-per-journalists.interface";
import { IGeneralStatistics } from "../../interfaces/general-statistics.interface";
import { IncidenceOfWords } from "../incidence-of-words/incidence-of-words-model";

export default class DashboardController {
  async incidenceOfWordsPerJournalists(request: Request, response: Response) {
    try {
      const filters: IIncidenceOfWordsPerJournalists = request.query as any;

      const statistic: IGeneralStatistics = {
        labels: [],
        datasets: [
          {
            label: "Incidência",
            data: [],
          },
        ],
      };

      const query = IncidenceOfWords.query().alias("i");

      if (!isNaN(+filters.journalistId)) {
        query.where("i.journalistId", +filters.journalistId);
      }

      if (!isNaN(+filters.iteractionType)) {
        query.where("i.iteractionType", +filters.iteractionType);
      }

      if (!isNaN(+filters.localityId)) {
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
