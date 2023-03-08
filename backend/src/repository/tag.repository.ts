import { connect } from '../config/db.config';
import { Tag } from '../models/tag.model';
import { Op } from 'sequelize';
import logger from '../config/logger';

export class TagRepository {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private db: any = {};
  private tagRepository: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  constructor() {
    this.db = connect();
    this.db.sequelize;
    this.tagRepository = this.db.sequelize.getRepository(Tag);
  }

  async getTags(userId: string, tagName: string, limit: number, page: number) {
    try {
      const tags = await this.tagRepository.findAndCountAll({
        where: { userId: userId, name: { [Op.like]: `${tagName}%` } },
        attributes: ['id', 'name'],
        limit: limit,
        offset: page * limit,
        order: [['id', 'DESC']],
      });
      return tags;
    } catch (err) {
      logger.error(err);
      return [];
    }
  }

  async getTag(tagName: string) {
    try {
      return await this.tagRepository.findOne({
        where: { name: tagName },
        attributes: ['id', 'name'],
      });
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  async createTag(tagName: string, userId: string) {
    let data = {};
    try {
      data = await this.tagRepository.create({ name: tagName, userId: userId });
    } catch (err) {
      logger.error(err);
    }
    return data;
  }

  async removeTag(tagId: number, userId: string) {
    try {
      return await this.tagRepository.destroy({ where: { userId: userId, id: tagId } });
    } catch (err) {
      logger.error(err);
      return null;
    }
  }
}
