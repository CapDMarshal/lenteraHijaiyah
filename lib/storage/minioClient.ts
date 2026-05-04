import https from "https";
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { env } from "@/lib/config/env";

let cachedClient: S3Client | null = null;

export const getMinioClient = () => {
  if (cachedClient) {
    return cachedClient;
  }

  const requestHandler = env.minioSslVerify
    ? undefined
    : new NodeHttpHandler({
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      });

  cachedClient = new S3Client({
    endpoint: env.minioEndpoint,
    region: env.minioRegion,
    credentials: {
      accessKeyId: env.minioAccessKey,
      secretAccessKey: env.minioSecretKey,
    },
    forcePathStyle: true,
    requestHandler,
  });

  return cachedClient;
};

export const buildLearningPdfKey = (fileName: string, folder?: string) => {
  const sanitizedFolder = folder
    ? folder.replace(/[^a-zA-Z0-9/_-]/g, "").replace(/^\/+|\/+$/g, "")
    : "";

  const safeName = fileName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");

  const withExtension = safeName.toLowerCase().endsWith(".pdf")
    ? safeName
    : `${safeName}.pdf`;

  const timestamp = Date.now();
  const prefix = sanitizedFolder ? `learning/${sanitizedFolder}` : "learning";

  return `${prefix}/${timestamp}-${withExtension}`;
};
