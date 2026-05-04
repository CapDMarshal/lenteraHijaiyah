import { env } from "@/lib/config/env";

const normalizeKey = (key: string) => key.replace(/^\/+/, "");

export const getMinioPublicUrl = (key: string) => {
  if (!key) {
    return "";
  }

  if (/^https?:\/\//i.test(key)) {
    return key;
  }

  const baseUrl = env.minioPublicUrl.replace(/\/+$/, "");
  const objectKey = normalizeKey(key);

  return `${baseUrl}/${env.minioBucket}/${objectKey}`;
};
