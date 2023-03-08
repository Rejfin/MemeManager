import { Response } from 'express';
import logger from '../config/logger';
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
  async getTags(req: { user: { userId: string }; query: { limit?: number; page?: number; name?: string } }) {
    let limit = req.query.limit || 10;
    let page = req.query.page || 0;
    page = page * 1;
    limit = limit * 1;
    const name = req.query.name || '';
    const tagsList = await this.tagService.getTags(req.user.userId, name, page, limit);
    tagsList.currentPage = page;
    tagsList.nextPage = tagsList.count - (page + 1) * limit > 0 ? page + 1 : Math.ceil(tagsList.count / limit) - 1;
    tagsList.maxPage = Math.ceil(tagsList.count / limit) - 1;
    if (tagsList.maxPage < 0) {
      tagsList.maxPage = 0;
    }
    if (tagsList.nextPage < 0) {
      tagsList.nextPage = 0;
    }
    logger.info(
      `User with id: ${req.user.userId} retrieved a list of tags, (page: ${page}/${tagsList.maxPage}, amount: ${tagsList.rows.length}/${limit})`,
    );
    return tagsList;
  }

  /**
   * function used to create tag
   * @param tag name of tag
   * @param userId
   * @returns Tag object if tag created sucessfully
   * @returns null if tag not created
   */
  async createTag(tag: string, userId: string, res: Response) {
    const newTag = await this.tagService.createTag(tag, userId);
    if (newTag) {
      logger.info(`Created new tag ("${newTag.name}") by user: ${userId}`);
      res.status(200).send({ id: newTag.id, name: newTag.name });
    } else {
      logger.warn(`No new tag named ${tag} was created`);
      res.status(400).send(`No new tag named ${tag} was created`);
    }
  }

  async removeTag(tagId: number, userId: string, res: Response) {
    const data = await this.tagService.removeTag(tagId, userId);
    if (data) {
      res.status(200).send(data);
    } else {
      logger.warn(`There was a problem while deleting the tag (tagId: ${tagId}, userId: ${userId})`);
      res.status(400).send({ message: 'There was a problem while deleting the tag' });
    }
  }
}
