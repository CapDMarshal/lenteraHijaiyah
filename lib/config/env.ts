type AppEnv = {
  appUrl: string;
  databaseUrl: string;
  authSecret: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env: AppEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  databaseUrl: getRequiredEnv("DATABASE_URL"),
  authSecret: getRequiredEnv("AUTH_SECRET"),
};
