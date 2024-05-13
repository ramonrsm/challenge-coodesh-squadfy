import { type HealthRouteOutputData, type HealthUseCaseOutputData } from "./health-types";

export class HealthUseCaseDto {
  private constructor() {}

  static execute({
    apiDetails,
    memoryUsage,
    uptime,
    databaseStatus,
    lastCRONExecution,
  }: HealthUseCaseOutputData): HealthRouteOutputData {
    const dto = {
      name: apiDetails.name,
      version: apiDetails.version,
      uptime: `${uptime.hours}h ${uptime.minutes}m ${uptime.seconds}s`,
      memoryUsage: `rss: ${memoryUsage.rss} MB, heapTotal: ${memoryUsage.heapTotal} MB, heapUsed: ${memoryUsage.heapUsed} MB`,
      databaseStatus: {
        read: databaseStatus.read ? "OK" : "FAIL",
        write: databaseStatus.write ? "OK" : "FAIL",
      },
      lastCRONExecution,
    };

    return dto;
  }
}
