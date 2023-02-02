import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const ACCESS_TOKEN = process.env.TOKEN_SECRET!;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  jwt.verify(token, ACCESS_TOKEN, (err: any, data: any) => {
    if (err) {
      return res.sendStatus(401);
    }

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    (req as any).user = data;
    next();
  });
};
