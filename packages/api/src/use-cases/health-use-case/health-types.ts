import { type IDatabaseProvider } from "@services/database";

export interface IDatabaseStatus {
  isConnected: boolean;
}

export interface IApiDetails {
  name: string;
  version: string;
}

export interface IUptime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface IMemoryUsage {
  rss: number;
  heapTotal: number;
  heapUsed: number;
}

export interface HealthUseCaseInputData {
  database: IDatabaseProvider;
}

export type HealthUseCaseOutputData = {
  apiDetails: IApiDetails;
  uptime: IUptime;
  memoryUsage: IMemoryUsage;
  databaseStatus: IDatabaseStatus;
  lastCRONExecution: string;
};

export type HealthRouteOutputData = {
  name: string;
  version: string;
  uptime: string;
  memoryUsage: string;
  databaseStatus: string;
  lastCRONExecution: string;
};
