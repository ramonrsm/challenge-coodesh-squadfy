import { type IDatabaseProvider } from "@services/database";
import packageJson from "../../../package.json";
import {
  type IMemoryUsage,
  type IApiDetails,
  type IDatabaseStatus,
  type HealthUseCaseOutputData,
} from "./health-use-case-types";

const ONE_HOUR_IN_SECONDS = 3600;
const ONE_MINUTE_IN_SECONDS = 60;
const ONE_KILOBYTE = 1024;

export class HealthUseCase {
  database: IDatabaseProvider;

  constructor(database: IDatabaseProvider) {
    this.database = database;
  }

  async databaseStatus(): Promise<IDatabaseStatus> {
    return {
      isConnected: this.database.isConnected(),
    };
  }

  lastCRONExecution(): string {
    return new Date().toISOString();
  }

  apiDetails(): IApiDetails {
    return {
      name: packageJson.name,
      version: packageJson.version,
    };
  }

  uptime() {
    const uptime = Math.floor(process.uptime());

    const hours = Math.floor(uptime / ONE_HOUR_IN_SECONDS);
    const minutes = Math.floor((uptime % ONE_HOUR_IN_SECONDS) / ONE_MINUTE_IN_SECONDS);
    const seconds = Math.floor(uptime % ONE_MINUTE_IN_SECONDS);

    return {
      hours,
      minutes,
      seconds,
    };
  }

  /**
   * Retorna informações sobre o tempo de atividade do processo.
   * @returns {IMemoryUsage} Objeto contendo informações sobre o tempo de atividade.
   * @property {string} uptime - O tempo de atividade formatado como uma string no formato "Xh Xm Xs".
   * @property {number} rss - A quantidade total de memória física usada pelo processo, em megabytes (MB).
   * @property {number} heapTotal - O tamanho total da região de memória alocada para o heap do processo, em megabytes (MB).
   * @property {number} heapUsed - A quantidade de memória atualmente usada pelo heap do processo, em megabytes (MB).
   */
  memoryUsage(): IMemoryUsage {
    const memoryUsage = process.memoryUsage();

    const rssInMB = Math.floor(memoryUsage.rss / ONE_KILOBYTE / ONE_KILOBYTE);
    const heapTotalInMB = Math.floor(memoryUsage.heapTotal / ONE_KILOBYTE / ONE_KILOBYTE);
    const heapUsedInMB = Math.floor(memoryUsage.heapUsed / ONE_KILOBYTE / ONE_KILOBYTE);

    return {
      rss: rssInMB,
      heapTotal: heapTotalInMB,
      heapUsed: heapUsedInMB,
    };
  }

  async execute(): Promise<HealthUseCaseOutputData> {
    const uptime = this.uptime();
    const memoryUsage = this.memoryUsage();
    const apiDetails = this.apiDetails();
    const databaseStatus = await this.databaseStatus();
    const lastCRONExecution = this.lastCRONExecution();

    return {
      databaseStatus,
      lastCRONExecution,
      apiDetails,
      uptime,
      memoryUsage,
    };
  }
}
