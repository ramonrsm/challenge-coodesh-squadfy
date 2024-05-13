/* eslint-disable no-magic-numbers */
import { type HttpRequestType, type HttpResponseType, type IHttpResponse } from "@services/server/http-route";
import { HttpStatusCode } from "@services/server/utils/http-status";
import { describe, expect, test, vi } from "vitest";
import { mock } from "vitest-mock-extended";
import { HealthController } from "./health-controller";
import { HealthRoute } from "./health-route";
import {
  type HealthRouteOutputData,
  type HealthUseCaseOutputData,
  type IApiDetails,
  type IDatabaseStatus,
  type IMemoryUsage,
  type IUptime,
} from "./health-types";
import { HealthUseCase } from "./health-use-case";
import { HealthUseCaseDto } from "./health-use-case-dto";
import { type IDatabaseProvider } from "@services/database";

describe("Rota GET /", () => {
  test("HealthUseCase", async () => {
    const databaseMock = mock<IDatabaseProvider>({
      isConnected: () => true,
    });

    // Arrange
    const rootUseCase = new HealthUseCase(databaseMock);

    const databaseStatusMock = mock<IDatabaseStatus>({
      isConnected: true,
    });

    rootUseCase.databaseStatus = vi.fn().mockReturnValue(databaseStatusMock);

    const lastCRONExecution = "2024-05-13T00:36:35.326Z";

    rootUseCase.lastCRONExecution = vi.fn().mockReturnValue(lastCRONExecution);

    const apiDetailsMock = mock<IApiDetails>({
      name: "@challenge-coodesh-squadfy/api",
      version: "0.0.1",
    });

    rootUseCase.apiDetails = vi.fn().mockReturnValue(apiDetailsMock);

    const uptimeMock = mock<IUptime>({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    rootUseCase.uptime = vi.fn().mockReturnValue(uptimeMock);

    const memoryUsageMock = mock<IMemoryUsage>({
      rss: 0,
      heapTotal: 0,
      heapUsed: 0,
    });

    rootUseCase.memoryUsage = vi.fn().mockReturnValue(memoryUsageMock);

    const rootController = new HealthController(rootUseCase);

    HealthUseCaseDto.execute = vi.fn<[HealthUseCaseOutputData], HealthRouteOutputData>().mockImplementation(data => {
      return {
        name: data.apiDetails.name,
        version: data.apiDetails.version,
        uptime: `${data.uptime.hours}h ${data.uptime.minutes}m ${data.uptime.seconds}s`,
        memoryUsage: `rss: ${data.memoryUsage.rss} MB, heapTotal: ${data.memoryUsage.heapTotal} MB, heapUsed: ${data.memoryUsage.heapUsed} MB`,
        databaseStatus: data.databaseStatus.isConnected ? "Connected" : "Disconnected",
        lastCRONExecution,
      };
    });

    const rootRoute = new HealthRoute({
      controller: rootController,
    });

    const requestMock = mock<HttpRequestType>();

    const responseMock = mock<HttpResponseType>();

    responseMock.send.mockImplementation(data => {
      return {
        data,
      };
    });

    // Act
    await rootRoute.handle(requestMock, responseMock);

    // Assert
    expect(rootUseCase.apiDetails).toBeCalledTimes(1);

    expect(rootUseCase.uptime).toBeCalledTimes(1);

    expect(rootUseCase.memoryUsage).toBeCalledTimes(1);

    expect(rootUseCase.databaseStatus).toBeCalledTimes(1);

    expect(rootUseCase.lastCRONExecution).toBeCalledTimes(1);

    expect(HealthUseCaseDto.execute).toBeCalledTimes(1);

    expect(HealthUseCaseDto.execute).toBeCalledWith<[HealthUseCaseOutputData]>({
      apiDetails: apiDetailsMock,
      uptime: uptimeMock,
      memoryUsage: memoryUsageMock,
      databaseStatus: databaseStatusMock,
      lastCRONExecution,
    });

    expect(responseMock.send).toBeCalledWith<[IHttpResponse<HealthRouteOutputData>]>({
      statusCode: HttpStatusCode.OK,
      message: "Serviço disponível",
      data: {
        name: "@challenge-coodesh-squadfy/api",
        version: "0.0.1",
        uptime: "0h 0m 0s",
        memoryUsage: "rss: 0 MB, heapTotal: 0 MB, heapUsed: 0 MB",
        databaseStatus: "Connected",
        lastCRONExecution,
      },
    });
  });
});
