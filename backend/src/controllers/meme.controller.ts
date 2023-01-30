import { MemeService } from "../service/meme.service";

export class MemeController {
  private memeService: MemeService;

  constructor() {
    this.memeService = new MemeService();
  }

  async getMemes(req: any) {
    const userId = req.user.userId;
    let limit = req.query.size || 10;
    let page = req.query.page || 0;
    page = page * 1;
    limit = limit * 1;
    
    const getLatest = req.query.latest === "1";
    const memesList = await this.memeService.getMemes(userId, getLatest, limit, page);
    memesList.currentPage = page;
    memesList.nextPage = memesList.count - ((page + 1) * limit) > 0 ? page + 1 : Math.ceil(memesList.count / limit) - 1;
    memesList.maxPage = Math.ceil(memesList.count / limit) - 1;
    return memesList;
  }

  async createMeme(req: any) {
    const fileData = {
      userId: req.user.userId,
      name: req.file.filename,
      originalName: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date(),
      modifiedDate: new Date(req.body.modifiedDate) || new Date(),
      tags: req.body.tags
    };
    return await this.memeService.createMeme(fileData);
  }

  async getMeme(memeId: string, userId?: string){
    return await this.memeService.getMeme(memeId, userId)
  }
}
