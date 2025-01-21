import { JwtPayload } from './jwt-payload';
import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}