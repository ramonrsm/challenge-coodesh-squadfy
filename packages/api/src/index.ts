import { database } from "@services/database";
import { httpRouter, httpServer } from "@services/server";
import { healthRoute } from "src/routes/health";
import { environmentVariables } from "@utils/environment-variables";
import { TerminalLogger } from "@utils/terminal-logger";

async function main() {
  const env = await environmentVariables.load();

  await httpRouter.load();

  await httpServer.listen(env.API_PORT);

  const isProduction = env?.NODE_ENV === "production";

  await database.connect();

  TerminalLogger.log(
    `🚀 API rodando em ${isProduction ? "https" : "http"}://${env?.API_HOST}${
      isProduction ? `/api/v1${healthRoute.path}` : `:${env?.API_PORT}/api/v1${healthRoute.path}`
    }`
  );
}

main();
