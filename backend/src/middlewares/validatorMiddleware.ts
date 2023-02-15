import { NextFunction, Request, Response } from 'express';

/**
 * middleware checks is all required fileds are presents
 * @param requiredFields list of required fileds as string
 */
export const validatorMiddleware = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const field of requiredFields) {
      if (!Object.hasOwn(req.body, field)) {
        return res.sendStatus(400);
      }
    }
    next();
  };
};
