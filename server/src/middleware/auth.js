import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  try {
    req.userId = jwt.verify(token, process.env.JWT_SECRET || 'taskflow-dev-secret').userId;
    next();
  } catch {
    res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
}
