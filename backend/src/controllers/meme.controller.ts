import { MemeService } from "../service/meme.service";

export class MemeController {
  private memeService: MemeService;

  constructor() {
    this.memeService = new MemeService();
  }

  async getMemes(req: any) {
    const userId = req.user.userId;
    console.log(req.query.latest === "1");
    
    const getLatest = req.query.latest === "1";
    return await this.memeService.getMemes(userId, getLatest);
  }

  async createMeme(req: any) {
    const fileData = {
      userId: req.user.userId,
      name: req.file.filename,
      originalName: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date(),
      tags: req.body.tags
    };
    return await this.memeService.createMeme(fileData);
  }

  async getMeme(memeId: string, userId?: string){
    return await this.memeService.getMeme(memeId, userId)
  }
}
