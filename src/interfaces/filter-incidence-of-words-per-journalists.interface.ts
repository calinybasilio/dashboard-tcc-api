import { EIteractionType, ELocalities } from "../utils/enums";

export interface IFilterIncidenceOfWordsPerJournalists {
  journalistId: number;
  iteractionType: EIteractionType;
  localityId: ELocalities;
  month: string;
}
