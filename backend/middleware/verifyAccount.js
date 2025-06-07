
import { verifyToken } from '../utils/jwt.js';


export function verifyAccount(req, res, next) {
  const authHeader = req.headers.authorization;

  // Kiểm tra header Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Xác thực token
    const decoded = verifyToken(token);

    // Gán thông tin người dùng vào request
    req.userId = decoded.id;

    next(); // Cho phép đi tiếp
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
}
