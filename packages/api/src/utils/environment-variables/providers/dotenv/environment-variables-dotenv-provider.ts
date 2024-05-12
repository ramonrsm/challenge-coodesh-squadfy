import dotenv, { type DotenvConfigOptions } from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { TerminalLogger } from "../../../terminal-logger";

type LoadEnvironmentParams = {
  path?: string;
  ambient?: NodeJS.ProcessEnv["NODE_ENV"];
};

export type Env = {
  NODE_ENV: "development" | "production" | "test";
  API_HOST: string;
  API_PORT: number;
};

export class EnvironmentVariablesDotEnvProvider {
  private _env: Env | null;

  constructor() {
    this._env = null;
  }

  get env() {
    return this._env;
  }

  public async load(params?: LoadEnvironmentParams) {
    const dotenvConfigOptions: DotenvConfigOptions = {};

    if (params?.ambient) {
      dotenvConfigOptions.path = path.resolve(process.cwd(), `.env.${params?.ambient}`);
    }

    if (params?.path) {
      dotenvConfigOptions.path = params?.path;
    }

    const dotenvResult = dotenv.config(dotenvConfigOptions);

    if (dotenvResult.error) {
      if ((dotenvResult.error as NodeJS.ErrnoException)?.code === "ENOENT") {
        TerminalLogger.log(
          "🚧 Arquivo '.env' não encontrado. Verifique o arquivo '.env.exemple'",
          {
            level: "ERROR",
            scope: "UTILS",
          },
          JSON.stringify(dotenvResult.error)
        );

        process.exit();
      }

      throw dotenvResult.error;
    }

    if (!dotenvResult.parsed) {
      throw new Error("Adicione um arquivo '.env' na raiz do projeto. Verifique o arquivo '.env.exemple'");
    }

    this.verifyEnvironments(dotenvResult.parsed);

    const entries = Object.entries(dotenvResult.parsed);

    for (const [key, value] of entries) {
      try {
        if (!value) {
          dotenvResult.parsed[key] = value;
          continue;
        }

        const parsedValue = JSON.parse(value.match(/^([0-9]*|false|true)$/g) ? value : `"${value}"`);

        dotenvResult.parsed[key] = parsedValue;
      } catch (error) {
        throw new Error(`Erro ao converter a variável de ambiente '${key}'`);
      }
    }

    this._env = dotenvResult.parsed as unknown as Env;

    TerminalLogger.log("⚙️  Variáveis de ambiente carregadas com sucesso.", { scope: "UTILS" });

    return this._env;
  }

  verifyEnvironments(parsedEnvironments: { [name: string]: string } | undefined) {
    if (!parsedEnvironments) {
      throw new Error("Nenhuma variável de ambiente encontrada.");
    }

    const environments = Object.keys(parsedEnvironments);

    const pathEnvExemple = path.resolve(".env.exemple");

    const envExemple = dotenv.parse(fs.readFileSync(pathEnvExemple));

    const environmentsRequired = Object.keys(envExemple);

    for (const environmentRequired of environmentsRequired) {
      if (!environments.find(environment => environment === environmentRequired)) {
        TerminalLogger.log(
          `Variável de ambiente '${environmentRequired}' não encontrada. Verifique o arquivo '.env.exemple'`,
          {
            level: "ERROR",
            scope: "UTILS",
          }
        );
      }
    }
  }
}
