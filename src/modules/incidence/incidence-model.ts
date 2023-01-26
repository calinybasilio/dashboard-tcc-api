import { Model } from "objection";
import { Word } from "../word/word-model";
import { Journalist } from "../journalist/journalist-model";
import { EIteractionType } from "../../utils/enums";
import { IIncidence } from "../../interfaces/incidence.interface";

export class Incidence extends Model implements IIncidence {
  id?: number;
  count: number;
  month: string;
  wordId: number;
  journalistId: number;
  iteractionType: EIteractionType;

  static get tableName() {
    return "incidence";
  }

  static jsonSchema = {
    type: "object",
    required: ["count", "wordId", "journalistId", "month", "iteractionType"],

    properties: {
      id: { type: "integer" },
      count: { type: "integer" },
      month: { type: "string", length: 2 },
      wordId: { type: "integer" },
      journalistId: { type: "integer" },
      iteractionType: { type: "integer" },
    },
  };

  static relationMappings = {
    word: {
      relation: Model.HasOneRelation,
      modelClass: Word,
      join: {
        from: "incidence.wordId",
        to: "word.id",
      },
    },
    journalist: {
      relation: Model.HasOneRelation,
      modelClass: Journalist,
      join: {
        from: "incidence.journalistId",
        to: "journalist.id",
      },
    },
  };
}
