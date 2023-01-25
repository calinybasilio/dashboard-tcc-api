import { ELocalities } from "../utils/enums";

export interface IFilterTweetsPerMonth {
  journalistId: number;
  localityId: ELocalities;
}
