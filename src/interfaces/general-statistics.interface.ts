import { IGeneralDatasetsStatistics } from "./general-datasets-statistics.interface";

export interface IGeneralStatistics {
  labels: string[];
  datasets: IGeneralDatasetsStatistics[];
}
