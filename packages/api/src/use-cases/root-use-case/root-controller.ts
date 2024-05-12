import { type IController } from "@services/server/http-controller";
import { type IHttpResponse } from "@services/server/http-route";
import { type RootUseCase } from "./root-use-case";

interface IHealthControllerResponse {
  uptime: string;
}

export class RootController implements IController {
  rootUseCase: RootUseCase;

  constructor(rootUseCase: RootUseCase) {
    this.rootUseCase = rootUseCase;
  }

  async handler(): Promise<IHttpResponse<IHealthControllerResponse>> {
    const uptime = await this.rootUseCase.execute();

    return {
      statusCode: 200,
      message: "Serviço disponível",
      data: {
        uptime,
      },
    };
  }
}
