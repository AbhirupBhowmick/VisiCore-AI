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
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else {
    try {
      const url = new URL(request.url);
      token = url.searchParams.get('token');
    } catch {
      // Ignore URL parsing errors
    }
  }

  if (!token) {
    return null;
  }
  return verifyToken(token);
}
