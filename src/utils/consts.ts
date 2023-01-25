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

export const mappingLabelsMonths: {[month: string]: string} = {
  ['01']: 'Janeiro',
  ['02']: 'Fevereiro',
  ['03']: 'Março',
  ['04']: 'Abril',
  ['05']: 'Maio',
  ['06']: 'Junho',
  ['07']: 'Julho',
  ['08']: 'Agosto',
  ['09']: 'Setembro',
  ['10']: 'Outubro',
  ['11']: 'Novembro',
  ['12']: 'Dezembro'
}