import { HttpRouter } from "./http-router";
import { expressServerProvider } from "./providers/express";

export const httpServer = expressServerProvider;

export const httpRouter = new HttpRouter(httpServer);
