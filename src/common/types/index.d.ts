declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    JWT_SECRET: string;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_PORT: string;
    DB_SSL: string;
  }
}
