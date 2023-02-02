import { NextFunction, Request, Response } from 'express';

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
