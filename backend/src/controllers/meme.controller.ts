import { Meme } from '../models/meme.model';
import { Tag } from '../models/tag.model';
import { MemeService } from '../service/meme.service';

export class MemeController {
  private memeService: MemeService;

  constructor() {
    this.memeService = new MemeService();
  }

  /**
   * function used for fetching memes from database
   * @param req - consists of a user and query object.
   * The user object conveys data about the user.
   * The query, on the other hand, stores such information as the number of records to return,
   * the pagination page, unindexed switch
   */
  async getMemes(req: {
    user: { userId: string };
    query: {
      limit?: number;
      page?: number;
      countUnindexed?: string;
      unindexed?: string;
      latest?: number;
      tags?: string;
    };
  }) {
    const userId = req.user.userId;
    let limit = req.query.limit || 10;
    let page = req.query.page || 0;
    const latest = req.query.latest == 1;
    const tagsList = req.query.tags?.split(',').map((x) => parseInt(x)) || [];

    //change string to numbers
    page = page * 1;
    limit = limit * 1;

    let memesList: {
      count: number;
      rows: Meme[];
      currentPage: number;
      nextPage: number;
      maxPage: number;
      unindexedAmount?: number;
    } = {
      count: 0,
      rows: [],
      currentPage: 0,
      nextPage: 0,
      maxPage: 0,
      unindexedAmount: 0,
    };

    // create list of database query based on request query
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const promisesList: Promise<any>[] = [];

    if (req.query.unindexed === '1') {
      promisesList.push(this.memeService.getUnindexedMemes(userId, limit, page));
    } else {
      promisesList.push(this.memeService.getMemes(userId, limit, page, latest, tagsList));
    }

    if (req.query.countUnindexed === '1') {
      promisesList.push(this.memeService.getUnindexedAmount(userId));
    }

    // wait for all promisess, then construct object and return it
    return await Promise.all(promisesList).then((results) => {
      memesList = results[0];
      memesList.currentPage = page;
      memesList.nextPage = memesList.count - (page + 1) * limit > 0 ? page + 1 : Math.ceil(memesList.count / limit) - 1;
      memesList.maxPage = Math.ceil(memesList.count / limit) - 1;
      if (memesList.nextPage < 0) {
        memesList.nextPage = 0;
      }
      if (promisesList.length > 0) {
        memesList.unindexedAmount = results[1];
      } else {
        delete memesList.unindexedAmount;
      }
      return memesList;
    });
  }

  /**
   * @returns Meme model of created entry in database
   */
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
      thumbnailname?: string;
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
      thumbnailName: req.file.thumbnailname,
    };
    return await this.memeService.createMeme(fileData);
  }

  // return thumbnail of file of original file (if image doesnt matter)
  async getMeme(req: { user?: { userId: string }; params: { memeId: string }; query: { o?: number } }) {
    const memeId = req.params.memeId;
    const userId = req.user?.userId;
    const originalName = req.query.o == 1;
    const data = await this.memeService.getMeme(memeId, userId);
    if (!originalName) {
      data.name = data.thumbnailName || data.name;
    }
    return data;
  }

  async updateMeme(memeId: string, userId: string, tags: Tag[]) {
    return await this.memeService.updateMeme(userId, memeId, tags);
  }

  async getStatistics(userId: string) {
    return await this.memeService.getStatistics(userId);
  }
}
