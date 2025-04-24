import * as jose from "jose"

export type JWTPayload = {
  exp: number
  iat: number
  userType: "ADMIN"
}

type CryptoOptions = {
  jwtSecret: string
  jwtTokenDuration: string
  hashAlgo: string
  saltLen: number
}

const CRYPTO_CONFIG: CryptoOptions = {
  jwtSecret: process.env.JWT_SECRET ?? "",
  jwtTokenDuration: process.env.JWT_TOKEN_DURATION ?? "",
  hashAlgo: "sha256",
  saltLen: 10,
}

async function createUserJwtToken(
  expiresIn = CRYPTO_CONFIG.jwtTokenDuration,
  jwtSecret = CRYPTO_CONFIG.jwtSecret
): Promise<string> {
  const secret = new TextEncoder().encode(jwtSecret)
  const alg = "HS256"

  return new jose.SignJWT({
    userType: "ADMIN",
  })
    .setProtectedHeader({ alg })
    .setExpirationTime(expiresIn)
    .sign(secret)
}

async function verifyJWT(token: string): Promise<JWTPayload> {
  const secret = new TextEncoder().encode(CRYPTO_CONFIG.jwtSecret)
  const { payload } = await jose.jwtVerify(token, secret)
  return payload as JWTPayload
}

export { createUserJwtToken, verifyJWT }
