import * as bodyParser from 'body-parser';
import express, { ErrorRequestHandler, Request, Response } from 'express';
import { AuthController } from './controllers/auth.controller';
import { MemeController } from './controllers/meme.controller';
import { TagController } from './controllers/tag.controller';
import { authMiddleware } from './middlewares/authMiddleware';
import { fileMiddleware } from './middlewares/fileMiddleware';
import { validatorMiddleware } from './middlewares/validatorMiddleware';
import multer from 'multer';
const upload = multer({ dest: global.DIR_ROOT + '/memes/' });
import cors from 'cors';
import logger from './config/logger';
import { loggerMiddleware } from './middlewares/loggerMiddleware';

/* eslint-disable @typescript-eslint/no-explicit-any */
class App {
  public express: express.Application;
  public memeController: MemeController;
  public tagController: TagController;
  public authController: AuthController;

  constructor() {
    logger.info('Loading MemeManager API components ...');
    this.express = express();
    this.middleware();
    this.routes();
    this.memeController = new MemeController();
    this.tagController = new TagController();
    this.authController = new AuthController();
  }

  // Configure Express middleware.
  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cors());
    this.express.use(loggerMiddleware);
  }

  private routes(): void {
    this.express.post('/api/auth/signin', validatorMiddleware(['login', 'password']), (req, res) => {
      this.authController.signInUser(req.body, res);
    });

    this.express.post('/api/auth/signup', validatorMiddleware(['login', 'password']), (req, res) => {
      this.authController.registerUser(req.body, res);
    });

    this.express.post('/api/auth/refresh-token', validatorMiddleware(['refreshToken']), (req, res) => {
      this.authController.refreshAccessToken(req.body, res);
    });

    this.express.post('/api/auth/logout', validatorMiddleware(['refreshToken']), (req, res) => {
      this.authController.logOut(req.body.refreshToken).then(() => res.sendStatus(200));
    });

    this.express.delete(
      '/api/auth/deleteme',
      [authMiddleware, validatorMiddleware(['password'])],
      (req: any, res: any) => {
        this.authController.deleteMe(req, res);
      },
    );

    this.express.delete('/api/auth/clear', [authMiddleware, validatorMiddleware(['password'])], (req:any, res: any) => {
      this.authController.cleanAccount(req, res);
    })

    this.express.get('/api/tags', authMiddleware, (req: any, res) => {
      this.tagController.getTags(req, res);
    });

    this.express.post('/api/tags', [authMiddleware, validatorMiddleware(['name'])], (req: any, res: any) => {
      this.tagController.createTag(req.body.name, req.user.userId, res);
    });

    this.express.delete('/api/tags/:tagId', authMiddleware, (req: any, res: any) => {
      this.tagController.removeTag(req.params.tagId, req.user.userId, res);
    });

    this.express.get('/api/memes', authMiddleware, (req: any, res) => {
      this.memeController.getMemes(req, res);
    });

    this.express.post('/api/memes', [authMiddleware, upload.single('meme'), fileMiddleware], (req: any, res: any) => {
      this.memeController.createMeme(req, res);
    });

    this.express.delete('/api/memes/:memeId', authMiddleware, (req: any, res) => {
      this.memeController.removeMeme(req.params.memeId, req.user.userId, res);
    });

    this.express.get('/api/memes/stats', authMiddleware, (req: any, res) => {
      this.memeController.getStatistics(req.user.userId, res);
    });

    this.express.get('/api/memes/:memeId', authMiddleware, (req: any, res) => {
      this.memeController.getMeme(req, res);
    });

    this.express.put('/api/memes/:memeId', authMiddleware, (req: any, res) => {
      this.memeController.updateMeme(req.params.memeId, req.user.userId, req.body.tags, res);
    });

    this.express.get('/api/memes/file/:memeId', (req: any, res) => {
      this.memeController.getMeme(req, res, true);
    });

    // handle undefined routes
    this.express.use('*', (req, res) => {
      res.send('Make sure url is correct!!!');
    });

    // handle errors
    this.express.use((err: ErrorRequestHandler, req: Request, res: Response) => {
      if (err instanceof multer.MulterError) {
        return res.status(418).json({
          err_code: err.code,
          err_message: err.message,
        });
      } else {
        return res.status(500).json({
          err_code: 409,
          err_message: 'Something went wrong!',
        });
      }
    });
  }
}

export default new App().express;
