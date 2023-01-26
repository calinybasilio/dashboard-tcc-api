import { EIteractionType } from "../utils/enums";

export interface IIncidence {
  id?: number;
  count: number;
  month: string;
  wordId: number;
  journalistId: number;
  iteractionType: EIteractionType;
}
