export enum RequestStatus {
  NONE = "NONE",
  FETCHING = "FETCHING",
  FAILURE = "FAILURE",
  SUCCESS = "SUCCESS",
}

export type ById<T> = { [key: string]: T };

export interface MegalithError {
  status?: number;
  error?: string;
  message: string;
}

export interface User {
  id: number;
  uuid: string;
  accessChatToken: string;
  emailMarketingOptin: boolean;
  appToken: string;
  email: string;
  givenName: string;
}

export interface Card {
  status?: string;
  serialNo: string;
  cardType: string;
  cardHolder: string;
  cardNumber: string;
  cardExpMonth: string;
  cardExpYear: string;
}

export interface PaymentInformation {
  accountId: string;
  card: Card;
}

export interface Ingredient {
  name: string;
  percentage: number;
  type: string;
}

export interface CoaReport {
  id: string;
  thcTotalPercent: number;
  cannabinoidTotalPercent: number;
  cbdTotalPercent: number;
  terpenesTotalPercent: number;
  laboratoryName: string;
  laboratoryLicense: string;
  heavyMetalsResult: string;
  microbialsResult: string;
  mycotoxinsResult: string;
  pesticidesResult: string;
  solventsResult: string;
  coaDate: string;
  coaUrl: string;
  ingredients: Ingredient[];
}

export interface Batch {
  id: string;
  heatingSetting: number;
  maxOilCounter: number;
  coaReport: CoaReport;
  rndOnly: boolean;
}

export interface Pod {
  id: string;
  serialNumber: string;
  chipId: string;
  batch: Batch;
}

export interface ActivatedPod {
  chipId: string;
  batchId: string;
  activationDate: string;
}
