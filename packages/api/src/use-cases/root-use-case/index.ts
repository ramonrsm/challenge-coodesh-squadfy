import { RootController } from "./root-controller";
import { RootUseCase } from "./root-use-case";
import { RootRoute } from "./root-use-route";

const rootUseCase = new RootUseCase();

const rootController = new RootController(rootUseCase);

export const rootRoute = new RootRoute({
  controller: rootController,
});
