import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/jwtPayload";

const JWT_SECRET = process.env.JWT_SECRET || "SEGREDO_BEM-SECRETO";

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
