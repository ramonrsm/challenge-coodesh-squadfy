import { HttpStatusCode } from "@services/server/utils/http-status";
import { Router } from "express";
import { type HttpRoute, type HttpRequestType } from "../http-route";
import { type LoggerLevel, TerminalLogger } from "@utils/terminal-logger";

export class ExpressRouteAdapter {
  private constructor() {}

  static execute<Body, Params, Query>(route: HttpRoute<Body, Params, Query>): Router {
    const router = Router({
      strict: true,
      caseSensitive: true,
    });

    router[route.method](route.path, async (request, response, next) => {
      try {
        const routeRequest: HttpRequestType<Body, Params, Query> = {
          headers: request.headers,
          body: request.body as Body,
          params: request.params as Params,
          query: request.query as Query,
          method: request.method,
          url: request.url,
        };

        const result = await route.handle(
          {
            headers: request.headers,
            body: request.body as Body,
            params: request.params as Params,
            query: request.query as Query,
            method: request.method,
            url: request.url,
          },
          {
            send: data => {
              let level: LoggerLevel;

              if (
                data.statusCode >= HttpStatusCode.BAD_REQUEST &&
                data.statusCode < HttpStatusCode.INTERNAL_SERVER_ERROR
              ) {
                level = "WARN";
              } else if (data.statusCode >= HttpStatusCode.INTERNAL_SERVER_ERROR) {
                level = "ERROR";
              } else if (data.statusCode >= HttpStatusCode.OK && data.statusCode < HttpStatusCode.MULTIPLE_CHOICES) {
                level = "SUCCESS";
              } else {
                level = "DEBUG";
              }

              TerminalLogger.log(
                `[${data.statusCode}] ${route.method.toUpperCase()} ${route.path}`,
                {
                  level,
                  scope: "REST",
                },
                JSON.stringify(routeRequest)
              );

              response.status(data.statusCode).json(data);
            },
          }
        );

        response.send(result);
      } catch (error) {
        next(error);
      }
    });

    return router;
  }
}
