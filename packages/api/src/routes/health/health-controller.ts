import { type IController } from "@services/server/http-controller";
import { type IHttpResponse } from "@services/server/http-route";
import { type HealthRouteOutputData } from "./health-routes-types";
import { type HealthUseCase } from "@use-cases/health-use-case/health-use-case";
import { HealthUseCaseDto } from "@use-cases/health-use-case/health-use-case-dto";

export class HealthController implements IController<unknown, unknown, unknown, HealthRouteOutputData> {
  rootUseCase: HealthUseCase;

  constructor(rootUseCase: HealthUseCase) {
    this.rootUseCase = rootUseCase;
  }

  async handler(): Promise<IHttpResponse<HealthRouteOutputData>> {
    const data = await this.rootUseCase.execute();

    return {
      statusCode: 200,
      message: "Serviço disponível",
      data: HealthUseCaseDto.execute(data),
    };
  }
}
