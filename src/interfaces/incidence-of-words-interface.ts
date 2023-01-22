import { EIteractionType } from "../utils/enums";

export interface IIncidenceOfWords {
    id?: number;
    count: number;
    wordId: number;
    journalistId: number;    
    iteractionType: EIteractionType;
}