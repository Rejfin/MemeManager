import { rename, existsSync, mkdirSync } from "node:fs";

export const fileMiddleware = (req: any, res: any, next: any) => {
  const fileName = req.file.filename + "." + req.file.originalname.split(".")[1]
  const newPath =req.file.destination + req.user.userId + "/" + fileName;

  if (!existsSync(req.file.destination + req.user.userId)) {
    mkdirSync(req.file.destination + req.user.userId);
  }

  rename(req.file.path, newPath, function (err) {
    if (err) {
      console.log(err);
    }
    req.file.filename = fileName;
    next();
  });
};
