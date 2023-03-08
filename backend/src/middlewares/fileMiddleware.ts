import { rename, existsSync, mkdirSync, utimesSync, closeSync, openSync } from 'node:fs';
import { encode } from 'blurhash';
import sharp from 'sharp';
import { NextFunction, Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import logger from '../config/logger';

// eslint-disable-next-line  @typescript-eslint/no-var-requires
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

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
    mimetype: string;
    thumbnailname: string;
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
    const fileName = req.file.filename + '.' + req.file.originalname.split('.').pop();
    const newPath = req.file.destination + mReq.user.userId + '/' + fileName;

    if (!existsSync(req.file.destination + mReq.user.userId)) {
      mkdirSync(req.file.destination + mReq.user.userId);
    }

    /**
     * function generates blurhash for passed file
     * @param pathToFile path to file
     * @param thumbnailname name of thumbnail file
     */
    const createBlurHash = async (pathToFile: string, thumbnailname: string) => {
      const { data, info } = await sharp(pathToFile).ensureAlpha().raw().toBuffer({
        resolveWithObject: true,
      });
      const encoded = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
      mReq.file.blurHash = encoded;
      mReq.file.width = info.width;
      mReq.file.height = info.height;
      mReq.file.thumbnailname = thumbnailname;
      logger.info({ url: req.originalUrl }, `Blurhash for the file (${fileName}) was created successfully`);
    };

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    rename(req.file.path, newPath, async function (err: any) {
      if (err) {
        logger.error({ url: req.originalUrl }, err);
        return res.sendStatus(500);
      }
      mReq.file.filename = fileName;

      try {
        if (mReq.file.mimetype.startsWith('image')) {
          await createBlurHash(newPath, fileName);
        } else if (mReq.file.mimetype.startsWith('video')) {
          await new Promise<void>((resolve, reject) => {
            ffmpeg(newPath)
              .on('end', async function () {
                await createBlurHash(
                  `${mReq.file.destination + mReq.user.userId}/${mReq.file.filename}.png`,
                  mReq.file.filename + '.png',
                );
                resolve();
              })
              .on('error', function (err: string) {
                logger.error({ url: req.originalUrl }, err);
                reject(err);
              })
              .screenshots({
                timemarks: ['3'],
                filename: `${mReq.file.filename}.png`,
                folder: mReq.file.destination + mReq.user.userId,
              });
          });
        }
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      } catch (err: any) {
        logger.error({ url: req.originalUrl }, err);
      }

      const modDate = mReq.body.modifiedDate || new Date();
      mReq.body.modifiedDate = modDate;
      try {
        const date = new Date(modDate);
        utimesSync(newPath, date, date);
        // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      } catch (err: any) {
        closeSync(openSync(newPath, 'w'));
        logger.error({ url: req.originalUrl }, err);
      }
      next();
    });
  } else {
    logger.warn({ url: req.originalUrl }, 'file object not sended');
    return res.sendStatus(400);
  }
};
