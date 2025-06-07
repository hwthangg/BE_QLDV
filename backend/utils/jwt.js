import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
configDotenv()
const SECRET_KEY = process.env.SECRET_KEY; // Nên để trong biến môi trường

export function signToken(payload, expiresIn = '1d') {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
}
