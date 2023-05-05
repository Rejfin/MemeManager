import { Response } from 'express';
import logger from '../config/logger';
import { ApiResponse } from '../models/apiResponse.model';
import { Meme } from '../models/meme.model';
import { PaginatedData } from '../models/PaginatedData.model';
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
        unindexed?: string;
        latest?: number;
        tags?: string;
      };
    },
    res: Response,
  ) {
    const response = new ApiResponse<PaginatedData<Meme>>();

    const userId = req.user.userId;
    let limit = req.query.limit || 10;
    let page = req.query.page || 0;
    const latest = req.query.latest == 1;
    const tagsList = req.query.tags?.split(',').map((x) => parseInt(x)) || [];

    //change string to numbers
    page = page * 1;
    limit = limit * 1;

    let memeList: { count: number; rows: Meme[] };

    if (req.query.unindexed === '1') {
      memeList = await this.memeService.getUnindexedMemes(userId, limit, page);
    } else {
      memeList = await this.memeService.getMemes(userId, limit, page, latest, tagsList);
    }

    // maxPage return not entire maxPage, it return maxPage based on current loaded data
    const maxPage = memeList.count - (page + 1) * limit > 0 ? page + 1 : Math.ceil(memeList.count / limit) - 1;

    logger.info(
      `User with id: ${userId} retrieved a list of memes (page: ${page}/${maxPage}, amount: ${memeList.count}/${limit})`,
    );

    response.data = new PaginatedData(
      memeList.rows,
      memeList.count,
      page,
      maxPage,
      Math.ceil(memeList.count / limit) - 1,
    );
    if (response.data.maxPage < 0) {
      response.data.maxPage = 0;
    }
    if (response.data.nextPage < 0) {
      response.data.nextPage = 0;
    }

    res.status(200);
    res.json(response);
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
    const response = new ApiResponse<Meme>();
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
        response.data = meme;
        res.status(200);
        res.json(response);
      } else {
        logger.warn(`Meme could not be created`);
        response.isSuccess = false;
        response.message = 'Meme could not be created';
        res.status(400);
        res.json(response);
      }
    } catch (err) {
      logger.warn(`Meme could not be created`);
      response.isSuccess = false;
      response.message = 'Meme could not be created';
      res.status(400);
      res.json(response);
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

    const response = new ApiResponse<Meme>();

    if (data) {
      if (!originalName) {
        data.name = data.thumbnailName || data.name;
      }
      logger.info(`Retrieved meme data with id: ${memeId}`);
      if (file) {
        res.sendFile('/memes/' + data.userId + '/' + data.name, { root: global.DIR_ROOT });
      } else {
        res.status(200);
        response.data = data;
        res.json(response);
      }
    } else {
      logger.warn('Could not retrive meme data');
      response.isSuccess = false;
      response.message = 'Could not retrive meme data';
      res.status(400);
      res.json(response);
    }
  }

  async updateMeme(memeId: string, userId: string, tags: Tag[], res: Response) {
    logger.info(`Updating meme data with id: ${memeId}`);
    const data = await this.memeService.updateMeme(userId, memeId, tags);
    const response = new ApiResponse<Meme>();
    response.data = data;
    res.status(200);
    res.json(response);
  }

  async getStatistics(userId: string, res: Response) {
    logger.info(`User with id: ${userId} retrieving statistics`);
    const data = await this.memeService.getStatistics(userId);
    const response = new ApiResponse<{
      sizes: { image: number; video: number; other: number };
      counts: { image: number; video: number; other: number };
    }>();
    if (data) {
      logger.info('statistics were successfully retrived');
      response.data = data;
      res.status(200);
      res.json(response);
    } else {
      logger.warn('statistics were not successfully retrived');
      response.isSuccess = false;
      response.message = 'statistics were not successfully retrived';
      res.status(400);
      res.json(response);
    }
  }

  async removeMeme(memeId: string, userId: string, res: Response) {
    const isSuccess = await this.memeService.removeMeme(memeId, userId);
    const response = new ApiResponse();

    if (isSuccess.length === 1 && isSuccess[0]) {
      logger.info(`Meme sucessfully deleted (id: ${memeId})`);
      res.status(200);
      response.message = 'Meme sucessfully deleted';
      res.json(response);
    } else if (isSuccess.length > 1) {
      if (isSuccess.every((x) => x === true)) {
        logger.info(`Meme sucessfully deleted (id: ${memeId})`);
        res.status(200);
        response.message = 'Meme sucessfully deleted';
        res.json(response);
      } else {
        logger.warn(`Failed to delete meme file or its thumbnail (id: ${memeId})`);
        res.status(400);
        response.isSuccess = false;
        response.message = 'Failed to delete meme file or its thumbnail';
        res.json(response);
      }
    } else {
      logger.warn(`Failed to delete meme (id: ${memeId})`);
      res.status(400);
      response.isSuccess = false;
      response.message = 'Failed to delete meme';
      res.json(response);
    }
  }
}
