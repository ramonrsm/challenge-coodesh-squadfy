import { HealthController } from "./health-controller";
import { HealthUseCase } from "../../use-cases/health-use-case/health-use-case";
import { HealthRoute } from "./health-route";
import { database } from "@services/database";

const healthUseCase = new HealthUseCase(database);

const healthController = new HealthController(healthUseCase);

export const healthRoute = new HealthRoute({
  controller: healthController,
});
