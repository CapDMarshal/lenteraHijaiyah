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

function getOptionalEnv(name: string, fallback = "") {
  return process.env[name] ?? fallback;
}

export const env: AppEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  databaseUrl: getRequiredEnv("DATABASE_URL"),
  authSecret: getRequiredEnv("AUTH_SECRET"),
  // MinIO is optional — only required when file upload/download features are used
  minioEndpoint: getOptionalEnv("MINIO_ENDPOINT"),
  minioRegion: getOptionalEnv("MINIO_REGION", "us-east-1"),
  minioAccessKey: getOptionalEnv("MINIO_ACCESS_KEY"),
  minioSecretKey: getOptionalEnv("MINIO_SECRET_KEY"),
  minioBucket: getOptionalEnv("MINIO_BUCKET"),
  minioPublicUrl: getOptionalEnv("MINIO_PUBLIC_URL"),
  minioSslVerify: process.env.MINIO_SSL_VERIFY !== "false",
};
