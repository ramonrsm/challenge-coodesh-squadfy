import { knexConfig } from "./providers/knex/knex-config";
import { KnexDatabaseProvider } from "./providers/knex/knex-database-provider";

export interface IDatabaseProvider {
  connect(): void;
  disconnect(): void;
  isConnected(): boolean;
}

export const database = new KnexDatabaseProvider(knexConfig);
