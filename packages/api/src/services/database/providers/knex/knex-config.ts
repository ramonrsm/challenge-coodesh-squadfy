import { environmentVariables } from "../../../../utils/environment-variables";
import { type Knex } from "knex";
import path from "node:path";

environmentVariables.load({
  path: path.resolve(process.cwd(), "..", "..", "..", "..", "..", ".env"),
});

export const knexConfig: Knex.Config = {
  client: process.env.DATABASE_CLIENT,
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: path.resolve(__dirname, "migrations"),
    schemaName: process.env.DATABASE_SCHEMA,
    tableName: "knex_migrations",
  },
  useNullAsDefault: true,
};

const seedsDirectory = path.resolve(__dirname, "seeds");

module.exports = {
  development: {
    client: process.env.DATABASE_CLIENT,
    connection: process.env.DATABASE_URL,
    seeds: {
      directory: seedsDirectory,
    },
  },
  production: {
    client: process.env.DATABASE_CLIENT,
    connection: process.env.DATABASE_URL,
    seeds: {
      directory: seedsDirectory,
    },
  },
};
