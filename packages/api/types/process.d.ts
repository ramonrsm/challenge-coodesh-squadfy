declare namespace NodeJS {
  interface ProcessEnv extends Dict<string> {
    API_PORT: number;
    NODE_ENV: "development" | "production" | "test";
    API_HOST: string;
    DATABASE_URL: string;
    DATABASE_URL_DEFAULT: string;
    DATABASE_CLIENT: string;
    DATABASE_SCHEMA: string;
  }
}
