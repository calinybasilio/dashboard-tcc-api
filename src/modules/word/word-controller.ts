import { Request, Response } from "express";
import { raw } from "objection";
import { IFindWord } from "../../interfaces/find-word-interface";
import { LIMIT_DEFAULT, LIMIT_MAXIMO } from "../../utils/consts";
import ValidadoresSerive from "../../utils/validadores-service";
import { Incidence } from "../incidence/incidence-model";

export default class WordController {
  async find(request: Request, response: Response) {
    try {
      const filters: IFindWord = request.query as any;
      const limit: number =
        filters.limit && !isNaN(+filters.limit) && filters.limit < LIMIT_MAXIMO
          ? +filters.limit
          : LIMIT_DEFAULT;
      const offset: number = filters.offset || 0;
      const query = Incidence.query().alias("i");
      const queryCount = Incidence.query().alias("i");

      if (ValidadoresSerive.validNumberQueryParam(filters.localityId)) {
        query.where("j.localityId", +filters.localityId);
        queryCount.where("j.localityId", +filters.localityId);
      }

      const rows = await query
        .select("w.word")
        .joinRelated("journalist", { alias: "j" })
        .joinRelated("word", { alias: "w" })
        .sum("i.count")
        .groupBy("w.word")
        .limit(limit)
        .offset(offset)
        .orderBy("sum", "DESC")
        .orderBy("w.word", "ASC");

      const count: any[] = await queryCount.select("w.word")
      .joinRelated("journalist", { alias: "j" })
      .joinRelated("word", { alias: "w" })
      .sum("i.count")
      .groupBy("w.word");
        
      return response.status(200).send({
        rows,
        count: Array.isArray(count) && count.length > 0 ? +count.length : 0,
      });
    } catch (error: any) {
      return response
        .status(400)
        .json({ error: "Erro ao consultar palavras", message: error.message });
    }
  }
}
