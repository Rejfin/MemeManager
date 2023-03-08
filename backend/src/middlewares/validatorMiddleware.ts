import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';

/**
 * middleware checks is all required fileds are presents
 * @param requiredFields list of required fileds as string
 */
export const validatorMiddleware = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of requiredFields) {
      if (!Object.hasOwn(req.body, field)) {
        logger.warn({ url: req.originalUrl }, 'Request does not have all the required data');
        return res.sendStatus(400);
      }
    }
    next();
  };
};
