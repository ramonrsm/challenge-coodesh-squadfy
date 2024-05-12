declare namespace NodeJS {
  interface ProcessEnv extends Dict<string> {
    API_PORT: number;
    NODE_ENV: "development" | "production" | "test";
    API_HOST: string;
  }
}
