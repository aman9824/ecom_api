import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        return next();
      } catch (e) {
        return next(createError(403, 'invalid token'));
      }
    }
  }
  return next(createError(403, 'authorization header must be provided'));
};

export default auth;
