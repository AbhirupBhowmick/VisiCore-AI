import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'ThisIsAVerySecretKeyForJwtGenerationMakeSureItIsLongEnough';

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: UserPayload): string {
  return jwt.sign(
    {
      sub: user.email,
      id: user.id,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: '10h' }
  );
}

export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;
    return {
      id: decoded.id,
      email: decoded.sub || decoded.email,
      role: decoded.role || 'USER',
    };
  } catch {
    return null;
  }
}

export function getUserFromRequest(request: Request): UserPayload | null {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  return verifyToken(token);
}
