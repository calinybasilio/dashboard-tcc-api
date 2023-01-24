import { EIteractionType, ELocalities } from "./enums";

export const LIMIT_MAXIMO = 50;

export const LIMIT_DEFAULT = 15;

export const mappingIteractionTypeToFolderName: {
  [iteractionType: number]: string;
} = {
  [EIteractionType.Tweets]: "tweets",
  [EIteractionType.Replys]: "replys",
  [EIteractionType.Likes]: "likes",
};

export const mappingLocalityToFolderName: {
  [locality: number]: string;
} = {
  [ELocalities.BELO_HORIZONTE]: "dados_bh_data",
  [ELocalities.MONTEVIDEO]: "dados_mv_data"
};