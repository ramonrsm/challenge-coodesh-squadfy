import { type Express, json, urlencoded } from "express";

export default class BodyParser {
  constructor(app: Express) {
    app.use(json());
    app.use(urlencoded({ extended: true, limit: "50mb", parameterLimit: 1000000 }));
  }
}
