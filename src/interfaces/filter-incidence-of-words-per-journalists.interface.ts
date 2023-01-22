import { EventIntegration } from "aws-sdk/clients/appintegrations";

export interface IIncidenceOfWordsPerJournalists {
  journalistId: number;
  iteractionType: EventIntegration;
  localityId: number;
}
