/* eslint-disable no-magic-numbers */
import { describe, test } from "vitest";

import { httpRouter, httpServer } from "@services/server";
import supertest from "supertest";

httpRouter.load();

const request = supertest(httpServer.app);

describe("Rota GET /", () => {
  test("HealthRoute", async () => {
    request.get("/").expect(200);
  });
});
