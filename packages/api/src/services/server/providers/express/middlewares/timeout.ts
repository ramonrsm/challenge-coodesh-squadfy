import { UnavailableServiceError } from "@services/server/utils/http-exceptions";
import { type Request, type Response, type Express, type NextFunction } from "express";
import timeout from "express-timeout-handler";

export default class Timeout {
  constructor(app: Express) {
    app.use(
      timeout.handler({
        timeout: 60000,
        onTimeout: (_request: Request, response: Response, _next: NextFunction) => {
          response.status(UnavailableServiceError.code).send("Serviço indisponível. Tente novamente mais tarde.");
        },
        disable: ["write", "setHeaders", "send", "json", "end"],
      })
    );
  }
}
