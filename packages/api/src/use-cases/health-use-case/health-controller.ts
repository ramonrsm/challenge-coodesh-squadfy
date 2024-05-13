import { type IController } from "@services/server/http-controller";
import { type IHttpResponse } from "@services/server/http-route";
import { type HealthUseCase } from "./health-use-case";
import { type HealthRouteOutputData } from "./health-types";
import { HealthUseCaseDto } from "./health-use-case-dto";

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
