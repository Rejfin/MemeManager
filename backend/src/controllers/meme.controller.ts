import { MemeService } from '../service/meme.service';

export class MemeController {
  private memeService: MemeService;

  constructor() {
    this.memeService = new MemeService();
  }

  async getMemes(req: { user: { userId: string }; query: { size?: number; page?: number; latest?: string } }) {
    const userId = req.user.userId;
    let limit = req.query.size || 10;
    let page = req.query.page || 0;
    page = page * 1;
    limit = limit * 1;

    const getLatest = req.query.latest === '1';
    const memesList = await this.memeService.getMemes(userId, getLatest, limit, page);
    memesList.currentPage = page;
    memesList.nextPage = memesList.count - (page + 1) * limit > 0 ? page + 1 : Math.ceil(memesList.count / limit) - 1;
    memesList.maxPage = Math.ceil(memesList.count / limit) - 1;
    if (memesList.nextPage < 0) {
      memesList.nextPage = 0;
    }

    return memesList;
  }

  async createMeme(req: {
    user: { userId: string };
    file: {
      filename: string;
      originalname: string;
      mimetype: string;
      size: number;
      width: number;
      height: number;
      blurHash: string;
    };
    body: {
      modifiedDate: string;
      tags: [];
    };
  }) {
    const fileData = {
      userId: req.user.userId,
      name: req.file.filename,
      originalName: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      width: req.file.width,
      height: req.file.height,
      uploadDate: new Date(),
      modifiedDate: new Date(req.body.modifiedDate) || new Date(),
      blurHash: req.file.blurHash,
      tags: req.body.tags,
    };
    return await this.memeService.createMeme(fileData);
  }

  async getMeme(memeId: string, userId?: string) {
    return await this.memeService.getMeme(memeId, userId);
  }
}
