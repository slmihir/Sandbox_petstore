import jwt, { type Secret } from 'jsonwebtoken';
import { env } from '../config/env.js';

interface TokenPayload {
  userId: string;
  role: string;
}

export function signToken(payload: TokenPayload): string {
  const secret = env.JWT_SECRET as unknown as Secret;
  const options = {
    expiresIn: env.JWT_EXPIRES_IN,
  } as any;
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): TokenPayload {
  const secret = env.JWT_SECRET as unknown as Secret;
  return jwt.verify(token, secret) as TokenPayload;
}
