import { environmentVariables } from "@utils/environment-variables";
import { KnexDatabaseProvider } from "./providers/knex/knex-database-provider";

export interface IDatabaseProvider {
  connect(): void;
  disconnect(): void;
  isConnected(): boolean;
}

environmentVariables.load();

export const database = new KnexDatabaseProvider({
  client: process.env.DATABASE_CLIENT,
  connection: process.env.DATABASE_URL,
});
