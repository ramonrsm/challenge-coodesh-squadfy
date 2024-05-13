/* eslint-disable no-magic-numbers */
import { type IDatabaseProvider } from "@services/database";
import { describe, expect, test, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { HealthUseCase } from "./health-use-case";
import { type IApiDetails, type IDatabaseStatus, type IMemoryUsage, type IUptime } from "./health-use-case-types";

describe("Rota GET /", () => {
  test("HealthUseCase", async () => {
    const databaseMock = mock<IDatabaseProvider>({
      isConnected: () => true,
    });

    // Arrange
    const healthUseCase = new HealthUseCase(databaseMock);

    const databaseStatusMock = mock<IDatabaseStatus>({
      isConnected: true,
    });

    healthUseCase.databaseStatus = vi.fn().mockReturnValue(databaseStatusMock);

    const lastCRONExecution = "2024-05-13T00:36:35.326Z";

    healthUseCase.lastCRONExecution = vi.fn().mockReturnValue(lastCRONExecution);

    const apiDetailsMock = mock<IApiDetails>({
      name: "@challenge-coodesh-squadfy/api",
      version: "0.0.1",
    });

    healthUseCase.apiDetails = vi.fn().mockReturnValue(apiDetailsMock);

    const uptimeMock = mock<IUptime>({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    healthUseCase.uptime = vi.fn().mockReturnValue(uptimeMock);

    const memoryUsageMock = mock<IMemoryUsage>({
      rss: 0,
      heapTotal: 0,
      heapUsed: 0,
    });

    healthUseCase.memoryUsage = vi.fn().mockReturnValue(memoryUsageMock);

    // Act
    const result = await healthUseCase.execute();

    // Assert
    expect(healthUseCase.apiDetails).toBeCalledTimes(1);

    expect(healthUseCase.uptime).toBeCalledTimes(1);

    expect(healthUseCase.memoryUsage).toBeCalledTimes(1);

    expect(healthUseCase.databaseStatus).toBeCalledTimes(1);

    expect(healthUseCase.lastCRONExecution).toBeCalledTimes(1);

    expect(result).toEqual({
      api: {
        name: "@challenge-coodesh-squadfy/api",
        version: "0.0.1",
      },
      uptime: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      memoryUsage: {
        rss: 0,
        heapTotal: 0,
        heapUsed: 0,
      },
      database: {
        isConnected: true,
      },
      lastCRONExecution: "2024-05-13T00:36:35.326Z",
    });
  });
});
