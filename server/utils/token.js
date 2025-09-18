import jwt from 'jsonwebtoken';

export const generateToken = (id, user) => {
  return jwt.sign({ id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
  });
};