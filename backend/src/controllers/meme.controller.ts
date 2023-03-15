import { Response } from 'express';
import logger from '../config/logger';
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
  async getMemes(
    req: {
      user: { userId: string };
      query: {
        limit?: number;
        page?: number;
        countUnindexed?: string;
        unindexed?: string;
        latest?: number;
        tags?: string;
      };
    },
    res: Response,
  ) {
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
      if (memesList.maxPage < 0) {
        memesList.maxPage = 0;
      }
      if (memesList.nextPage < 0) {
        memesList.nextPage = 0;
      }
      if (promisesList.length > 0) {
        memesList.unindexedAmount = results[1];
      } else {
        delete memesList.unindexedAmount;
      }
      logger.info(
        `User with id: ${userId} retrieved a list of memes (page: ${page}/${memesList.maxPage}, amount: ${memesList.rows.length}/${limit})`,
      );
      res.status(200);
      res.send(memesList);
    });
  }

  /**
   * @returns Meme model of created entry in database
   */
  async createMeme(
    req: {
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
    },
    res: Response,
  ) {
    try {
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
      const meme = await this.memeService.createMeme(fileData);
      if (meme) {
        logger.info(`New meme created by user with id: ${req.user.userId}`);
        res.status(200);
        res.send(meme);
      } else {
        logger.warn(`Meme could not be created`);
        res.status(400);
        res.send({ message: 'Meme could not be created' });
      }
    } catch (err) {
      logger.warn(`Meme could not be created`);
      res.status(400);
      res.send({ message: 'Meme could not be created' });
    }
  }

  // return thumbnail of file of original file (if image doesnt matter)
  async getMeme(
    req: { user?: { userId: string }; params: { memeId: string }; query: { o?: number } },
    res: Response,
    file = false,
  ) {
    const memeId = req.params.memeId;
    const userId = req.user?.userId;
    const originalName = req.query.o == 1;
    const data = await this.memeService.getMeme(memeId, userId);
    if (data) {
      if (!originalName) {
        data.name = data.thumbnailName || data.name;
      }
      logger.info(`Retrieved meme data with id: ${memeId}`);
      if (file) {
        res.sendFile('/memes/' + data.userId + '/' + data.name, { root: global.DIR_ROOT });
      } else {
        res.status(200);
        res.send(data);
      }
    } else {
      logger.warn('Could not retrive meme data');
      res.status(400);
      res.send({ message: 'Could not retrive meme data' });
    }
  }

  async updateMeme(memeId: string, userId: string, tags: Tag[], res: Response) {
    logger.info(`Updating meme data with id: ${memeId}`);
    const data = await this.memeService.updateMeme(userId, memeId, tags);
    res.status(200);
    res.send(data);
  }

  async getStatistics(userId: string, res: Response) {
    logger.info(`User with id: ${userId} retrieving statistics`);
    const data = await this.memeService.getStatistics(userId);
    if (data) {
      logger.info('statistics were successfully retrived');
      res.status(200);
      res.send(data);
    } else {
      logger.warn('statistics were not successfully retrived');
      res.status(400);
      res.send({ message: 'statistics were not successfully retrived' });
    }
  }

  async removeMeme(memeId: string, userId: string, res: Response) {
    const isSuccess = await this.memeService.removeMeme(memeId, userId);

    if (isSuccess.length === 1 && isSuccess[0]) {
      logger.info(`Meme sucessfully deleted (id: ${memeId})`);
      res.status(200)
      res.send({ message: 'Meme sucessfully deleted' });
    } else if (isSuccess.length > 1) {
      if (isSuccess.every((x) => x === true)) {
        logger.info(`Meme sucessfully deleted (id: ${memeId})`);
        res.status(200);
        res.send({ message: 'Meme sucessfully deleted' });
      } else {
        logger.warn(`Failed to delete meme file or its thumbnail (id: ${memeId})`);
        res.status(400);
        res.send({ message: 'Failed to delete meme file or its thumbnail' });
      }
    } else {
      logger.warn(`Failed to delete meme (id: ${memeId})`);
      res.status(400);
      res.send({ message: 'Failed to delete meme' });
    }
  }
}
