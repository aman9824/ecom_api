/* eslint-disable import/prefer-default-export */
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const createAccessToken = (user) => {
  const token = jwt.sign(
    user,
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  return token;
};

export const createRefreshToken = (user) => {
  const token = jwt.sign(
    user,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  return token;
};

export const createActivationToken = (user) => {
  const token = jwt.sign(
    user,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '5m' }
  );
  return token;
};
