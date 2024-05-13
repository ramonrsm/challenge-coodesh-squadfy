import { HealthController } from "./health-controller";
import { HealthUseCase } from "./health-use-case";
import { HealthRoute } from "./health-route";

const healthUseCase = new HealthUseCase();

const healthController = new HealthController(healthUseCase);

export const rootRoute = new HealthRoute({
  controller: healthController,
});
