import cors from "cors";
import { type Express } from "express";

export default class Cors {
  constructor(app: Express) {
    app.use(cors());
  }
}
