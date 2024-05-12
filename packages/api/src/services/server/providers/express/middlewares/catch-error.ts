import { InternalServerError } from "@services/server/utils/http-exceptions";
import { HttpResponse } from "@services/server/utils/http-response";
import { ExecutionTime } from "@utils/execution-time";
import { TerminalLogger } from "@utils/terminal-logger";
import { type Express, type NextFunction, type Request, type Response } from "express";

export default class CatchError {
  constructor(app: Express) {
    app.use((error: Error, request: Request, response: Response, _next: NextFunction) => {
      const httpResponse = HttpResponse.error(error);

      if (httpResponse.statusCode >= InternalServerError.code) {
        const elapsedTime = ExecutionTime.end(
          (request as unknown as { labelExecutionRoute: string }).labelExecutionRoute
        );

        TerminalLogger.log(
          `[${httpResponse.statusCode}] ${request.method.toUpperCase()} ${request.url} - ${elapsedTime}`,
          {
            scope: "REST",
            level: "ERROR",
          },
          `\n{"stack": "${error.stack}"}`,
          JSON.stringify({
            headers: request.headers,
            params: request.params,
            query: request.query,
            body: request.body,
            message: error.message,
          })
        );
      }

      response.status(httpResponse.statusCode).json(httpResponse);
    });
  }
}
