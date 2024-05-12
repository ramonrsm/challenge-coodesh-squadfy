import { type Express } from "express";
import helmet from "helmet";

export default class Helmet {
  constructor(app: Express) {
    app.use(helmet.dnsPrefetchControl());
    app.use(helmet.hidePoweredBy());
    app.use(helmet.hsts());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noSniff());
    app.use(helmet.permittedCrossDomainPolicies());
    app.use(helmet.referrerPolicy());
    app.use(helmet.xssFilter());
  }
}
