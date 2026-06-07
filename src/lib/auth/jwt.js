import { jwtVerify, SignJWT } from 'jose';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return new TextEncoder().encode(secret);
}

export async function signJwt(payload) {
  const claims = JSON.parse(JSON.stringify(payload));
  return new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(getSecret());
}

export async function verifyJwt(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export function hasRole(payload, role) {
  if (!payload?.role) return false;
  const roles = Array.isArray(payload.role) ? payload.role : [payload.role];
  return roles.includes(role);
}
