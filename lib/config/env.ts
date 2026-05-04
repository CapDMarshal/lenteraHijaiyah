type AppEnv = {
  appUrl: string;
  databaseUrl: string;
  authSecret: string;
  minioEndpoint: string;
  minioRegion: string;
  minioAccessKey: string;
  minioSecretKey: string;
  minioBucket: string;
  minioPublicUrl: string;
  minioSslVerify: boolean;
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
  minioEndpoint: getRequiredEnv("MINIO_ENDPOINT"),
  minioRegion: getRequiredEnv("MINIO_REGION"),
  minioAccessKey: getRequiredEnv("MINIO_ACCESS_KEY"),
  minioSecretKey: getRequiredEnv("MINIO_SECRET_KEY"),
  minioBucket: getRequiredEnv("MINIO_BUCKET"),
  minioPublicUrl: getRequiredEnv("MINIO_PUBLIC_URL"),
  minioSslVerify: process.env.MINIO_SSL_VERIFY !== "false",
};
