import * as bodyParser from "body-parser";
import express from "express";
import { AuthController } from "./controllers/auth.controller";
import { MemeController } from "./controllers/meme.controller";
import { TagController } from "./controllers/tag.controller";
import { authMiddleware } from "./middlewares/authMiddleware";

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
  }

  private routes(): void {
    this.express.post("/api/auth/signin", (req, res) => {
      this.authController.signInUser(req.body, res);
    });

    this.express.post("/api/auth/signup", (req, res) => {
      this.authController.registerUser(req.body, res);
    });

    this.express.post("/api/auth/refresh-token", (req, res) => {
      this.authController.refreshAccessToken(req.body, res)
    });

    this.express.get("/api/memes", authMiddleware, (req, res) => {
      this.memeController.getMemes().then((data) => res.json(data));
    });

    this.express.get("/api/tags", (req, res) => {
      this.tagController.getTags().then((data) => res.json(data));
    });

    this.express.post("/api/tags", (req, res) => {
      this.tagController.createTag(req.body.tag).then((data) => res.json(data));
    });

    // handle undefined routes
    this.express.use("*", (req, res) => {
      res.send("Make sure url is correct!!!");
    });
  }
}

export default new App().express;
