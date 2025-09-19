import { JwtPayload } from "../jwtPayload";

declare global {
  namespace Express {
    export interface Request {
      user: JwtPayload;
    }
  }
}
