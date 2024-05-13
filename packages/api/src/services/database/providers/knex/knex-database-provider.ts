import { type IDatabaseProvider } from "@services/database";
import { TerminalLogger } from "@utils/terminal-logger";
import knex, { type Knex } from "knex";

type SchemaName = {
  schema_name: string;
};

type KnexRawResponse<T> = {
  rows: T[];
};

export class KnexDatabaseProvider implements IDatabaseProvider {
  private connection: Knex | null;

  constructor(private config: Knex.Config) {
    this.connection = null;
  }
  checkRead(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  checkWrite(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }

  async verifySchema(): Promise<boolean> {
    try {
      if (this.connection) return true;

      const connection = knex({
        client: process.env.DATABASE_CLIENT,
        connection: process.env.DATABASE_URL_DEFAULT,
      });

      const result = await connection.raw<KnexRawResponse<SchemaName>>(
        "SELECT schema_name FROM information_schema.schemata"
      );

      const databaseSchema = process.env.DATABASE_SCHEMA;

      const schema = result.rows.find(schema => schema.schema_name === databaseSchema);

      if (!schema) {
        await connection.raw(`CREATE SCHEMA IF NOT EXISTS "${databaseSchema}"`);

        TerminalLogger.log(`🎲 Schema ${databaseSchema} criado com sucesso.`, {
          level: "DEBUG",
          scope: "DATABASE",
        });
      }

      await connection.destroy();

      return true;
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      TerminalLogger.log(
        "🎲 Erro ao conectar com o banco de dados.",
        {
          level: "ERROR",
          scope: "DATABASE",
        },
        JSON.stringify(error)
      );

      return false;
    }
  }

  async connect(): Promise<void> {
    if (this.connection) return;

    try {
      const isVerified = await this.verifySchema();

      if (!isVerified) return;

      this.connection = knex(this.config);

      await this.connection.raw("SELECT 1+1 as result");

      TerminalLogger.log(`🎲 Conexão com o banco de dados: "${process.env.DATABASE_SCHEMA}" estabelecida.`, {
        level: "INFO",
        scope: "DATABASE",
      });
    } catch (error) {
      if (!(error instanceof Error)) throw error;

      TerminalLogger.log(
        "🎲 Erro ao conectar com o banco de dados.",
        {
          level: "ERROR",
          scope: "DATABASE",
        },
        JSON.stringify(error)
      );
    }
  }

  disconnect(): void {
    if (this.connection) {
      this.connection.destroy();
      this.connection = null;
    }
  }

  isConnected(): boolean {
    return !!this.connection;
  }
}
