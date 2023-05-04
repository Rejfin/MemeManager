import { Response } from 'express';
import logger from '../config/logger';
import { ApiResponse } from '../models/apiResponse.model';
import { PaginatedData } from '../models/PaginatedData.model';
import { Tag } from '../models/tag.model';
import { TagService } from '../service/tag.service';

export class TagController {
  private tagService: TagService;

  constructor() {
    this.tagService = new TagService();
  }

  /**
   * function used for fetching tags from database
   * @param req - consists of a user and query object.
   * The user object conveys data about the user.
   * The query, on the other hand, stores such information as the number of records to return,
   * the pagination page and the beginning of the tag name to search for
   */
  async getTags(
    req: { user: { userId: string }; query: { limit?: number; page?: number; name?: string } },
    res: Response,
  ) {
    const response = new ApiResponse<PaginatedData<Tag>>();

    let limit = req.query.limit || 10;
    let page = req.query.page || 0;
    page = page * 1;
    limit = limit * 1;
    const name = req.query.name || '';

    const tagsList = await this.tagService.getTags(req.user.userId, name, page, limit);

    response.data = new PaginatedData(
      tagsList.rows,
      tagsList.count,
      page,
      tagsList.count - (page + 1) * limit > 0 ? page + 1 : Math.ceil(tagsList.count / limit) - 1,
      Math.ceil(tagsList.count / limit) - 1,
    );

    if (response.data.maxPage < 0) {
      response.data.maxPage = 0;
    }
    if (response.data.nextPage < 0) {
      response.data.nextPage = 0;
    }
    logger.info(
      `User with id: ${req.user.userId} retrieved a list of tags, (page: ${page}/${response.data.maxPage}, amount: ${response.data.count}/${limit})`,
    );
    res.status(200);
    res.json(response);
    return tagsList;
  }

  /**
   * function used to create tag
   * @param tag name of tag
   * @param userId
   */
  async createTag(tag: string, userId: string, res: Response) {
    const response = new ApiResponse<Partial<Tag>>();
    const newTag = await this.tagService.createTag(tag, userId);
    if (newTag) {
      response.data = { id: newTag.id, name: newTag.name };
      logger.info(`Created new tag ("${newTag.name}") by user: ${userId}`);
      res.status(200);
      res.json(response);
    } else {
      response.isSuccess = false;
      response.message = `No new tag named ${tag} was created`;
      logger.warn(`No new tag named ${tag} was created`);
      res.status(400);
      res.json(response);
    }
  }

  async removeTag(tagId: number, userId: string, res: Response) {
    const response = new ApiResponse();
    const data = await this.tagService.removeTag(tagId, userId);
    if (data) {
      response.data = data;
      response.message = 'Tag successfully removed';
      res.status(200);
      res.json(response);
    } else {
      response.isSuccess = false;
      response.message = 'There was a problem while deleting the tag';
      logger.warn(`There was a problem while deleting the tag (tagId: ${tagId}, userId: ${userId})`);
      res.status(400);
      res.json(response);
    }
  }
}
