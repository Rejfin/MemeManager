import { MemeService } from "../service/meme.service";

export class MemeController {
  private memeService: MemeService;

  constructor() {
    this.memeService = new MemeService();
  }

  async getMemes(userId: string) {
    return await this.memeService.getMemes(userId);
  }

  async createMeme(req: any) {
    const fileData = {
      userId: req.user.userId,
      name: req.file.originalname,
      originalName: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date(),
      tags: req.body.tags
    };
    console.log(fileData.tags);
    

    return await this.memeService.createMeme(fileData);
  }
}
