import { TerminalLogger } from "@utils/terminal-logger";
import express, { type Express } from "express";
import { type Server } from "http";
import { ExpressRouteAdapter } from "../../adapters/express-route-adapter";
import BodyParser from "./middlewares/body-parser";
import CatchError from "./middlewares/catch-error";
import Cors from "./middlewares/cors";
import Helmet from "./middlewares/helmet";
import Timeout from "./middlewares/timeout";
import { type HttpRoute } from "@services/server/http-route";
import { type HttpServer } from "@services/server/http-server";

const START_COUNTER = 0;

export class ExpressServerProvider implements HttpServer<Express> {
  server?: Server;
  app: Express;

  private routeCounter: number = START_COUNTER;

  constructor() {
    this.app = express();

    new Timeout(this.app);
    new Helmet(this.app);
    new BodyParser(this.app);
    new Cors(this.app);
  }

  async listen(port: number): Promise<void> {
    new CatchError(this.app);

    this.server = await new Promise<Server>((resolve, reject) => {
      const server = this.app.listen(port, (err?: Error) => {
        if (err) {
          reject(err);
        } else {
          return resolve(server);
        }
      });
    });
    TerminalLogger.log(`🔀 Rotas adicionadas: ${this.routeCounter}`, {
      scope: "REST",
    });

    TerminalLogger.log("✨ Provider: Express", {
      scope: "REST",
    });
  }

  public async close(): Promise<void> {
    if (this.server) {
      await new Promise<void>((resolve, reject) => {
        this.server?.close((err?: Error) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      TerminalLogger.log("Servidor fechado", {
        scope: "REST",
        level: "INFO",
      });
    }
  }

  async addRoute<Body, Params, Query>(route: HttpRoute<Body, Params, Query>): Promise<void> {
    try {
      this.app.use("/api/v1", ExpressRouteAdapter.execute(route));
      this.routeCounter++;
    } catch (error) {
      TerminalLogger.log(`Falha ao adicionar rota: ${route.method.toUpperCase()} ${route.path}`, {
        scope: "REST",
        level: "ERROR",
      });

      throw error;
    }
  }
}
