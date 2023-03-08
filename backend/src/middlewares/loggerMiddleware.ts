import { NextFunction, Response, Request } from 'express';
import logger from '../config/logger';

export const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`request to: ${req.originalUrl.split('?')[0]}`);
  next();
};
