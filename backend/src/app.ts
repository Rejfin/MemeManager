import * as bodyParser from "body-parser";
import express from "express";
import { AuthController } from "./controllers/auth.controller";
import { MemeController } from "./controllers/meme.controller";
import { TagController } from "./controllers/tag.controller";
import { authMiddleware } from "./middlewares/authMiddleware";
import { fileMiddleware } from "./middlewares/fileMiddleware";
import { validatorMiddleware} from "./middlewares/validatorMiddleware";
const multer  = require('multer')
const upload = multer({ dest: __dirname + '/memes/' })
const cors = require('cors')

class App {
  public express: express.Application;
  public memeController: MemeController;
  public tagController: TagController;
  public authController: AuthController;

  constructor() {
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
    this.express.use(cors())
  }

  private routes(): void {
    this.express.post("/api/auth/signin", validatorMiddleware(["login", "password"]), (req, res) => {
      this.authController.signInUser(req.body, res);
    });

    this.express.post("/api/auth/signup", validatorMiddleware(["login", "password"]), (req, res) => {
      this.authController.registerUser(req.body, res);
    });

    this.express.post("/api/auth/refresh-token", validatorMiddleware(["token"]), (req, res) => {
      this.authController.refreshAccessToken(req.body, res)
    });

    this.express.get("/api/tags", authMiddleware, (req: any, res) => {
      this.tagController.getTags(req.user.userId).then((data) => res.json(data));
    });

    this.express.post("/api/tags", [authMiddleware, validatorMiddleware(["name"])], (req: any, res: any) => {
      this.tagController.createTag(req.body.name, req.user.userId).then((data) => res.json(data));
    });

    this.express.get("/api/memes", authMiddleware, (req: any, res) => {
      this.memeController.getMemes(req.user.userId).then((data) => res.json(data));
    });

    this.express.post("/api/memes", [authMiddleware, upload.single('meme'), fileMiddleware], (req: any, res: any) => {
      this.memeController.createMeme(req).then((data) => res.json(data))
    })

    this.express.get("/api/memes/:memeId", authMiddleware, (req: any, res)=>{
      this.memeController.getMeme(req.user.userId, req.params.memeId).then((data) => res.json(data))
    })

    this.express.get("/api/memes/file/:memeId", authMiddleware, (req: any, res)=>{
      this.memeController.getMeme(req.user.userId, req.params.memeId).then((data) => {
        res.sendFile("/memes/" + req.user.userId + "/" + data.name, { root: __dirname })})
    })

    // handle undefined routes
    this.express.use("*", (req, res) => {
      res.send("Make sure url is correct!!!");
    });
  }
}

export default new App().express;
