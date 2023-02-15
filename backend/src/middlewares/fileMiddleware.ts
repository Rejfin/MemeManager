import { rename, existsSync, mkdirSync, utimesSync, closeSync, openSync } from 'node:fs';
import { encode } from 'blurhash';
import sharp from 'sharp';
import { NextFunction, Request, Response } from 'express';

class FileRequest extends Request {
  user!: { userId: string };
  file!: {
    filename: string;
    originalname: string;
    destination: string;
    path: string;
    blurHash: string;
    width: number;
    height: number;
  };
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  body!: any;
}

/**
 * This middleware change file original name to the generate one
 * if the correct date of the last modification of the file is sent,
 * then it is saved this way for the created fileMiddleware also generates blurhash
 * for the uploaded file (if the file is an image)
 */
export const fileMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const mReq = req as unknown as FileRequest;
  if (req.file) {
    const fileName = req.file.filename + '.' + req.file.originalname.split('.')[1];
    const newPath = req.file.destination + mReq.user.userId + '/' + fileName;

    if (!existsSync(req.file.destination + mReq.user.userId)) {
      mkdirSync(req.file.destination + mReq.user.userId);
    }

    rename(req.file.path, newPath, async function (err) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      mReq.file.filename = fileName;

      const { data, info } = await sharp(newPath).ensureAlpha().raw().toBuffer({
        resolveWithObject: true,
      });

      const modDate = mReq.body.modifiedDate || new Date();
      mReq.body.modifiedDate = modDate;
      try {
        const date = new Date(modDate);
        utimesSync(newPath, date, date);
      } catch (err) {
        closeSync(openSync(newPath, 'w'));
      }

      const encoded = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
      mReq.file.blurHash = encoded;
      mReq.file.width = info.width;
      mReq.file.height = info.height;
      next();
    });
  } else {
    return res.sendStatus(400);
  }
};
