import { SignJWT, jwtVerify } from "jose";

const getJwtSecretKey = () => {
  // Kita gunakan AUTH_SECRET yang sudah Anda buat di file .env
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length === 0) {
    throw new Error("Missing AUTH_SECRET environment variable. Pastikan sudah diatur di file .env");
  }

  return secret;
};

export const signJwt = async (
  payload: { id: string; role: string },
  expiresIn: string | number = "7d"
) => {
  const secretKey = new TextEncoder().encode(getJwtSecretKey());

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn as string | number)
    .sign(secretKey);

  return token;
};

export const verifyJwt = async <T>(token: string): Promise<T | null> => {
  try {
    const secretKey = new TextEncoder().encode(getJwtSecretKey());
    const { payload } = await jwtVerify(token, secretKey);
    return payload as T;
  } catch (error) {
    // Kadaluarsa atau token tidak valid
    return null;
  }
};
