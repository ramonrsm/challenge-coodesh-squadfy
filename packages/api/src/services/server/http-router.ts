import { rootRoute } from "@use-cases/health-use-case";
import { type HttpRoute } from "./http-route";
import { type HttpServer } from "./http-server";

export class HttpRouter<Application> {
  httpServer: HttpServer<Application>;
  routes: Map<string, HttpRoute> = new Map();

  constructor(httpServer: HttpServer<Application>) {
    this.httpServer = httpServer;
    this.registerRoutes();
  }

  async load() {
    for (const route of this.routes.values()) {
      this.httpServer.addRoute(route);
    }
  }

  verifyRoute<Body, Params, Query>(route: HttpRoute<Body, Params, Query>) {
    const key = route.method.concat(route.path);

    if (this.routes.has(key)) {
      throw new Error(`Route with key ${key} already exists`);
    }

    this.routes.set(key, route as HttpRoute);
  }

  registerRoutes() {
    // root
    this.verifyRoute(rootRoute);
  }
}
