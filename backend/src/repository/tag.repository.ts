import { connect } from '../config/db.config';
import { Tag } from '../models/tag.model';

export class TagRepository {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private db: any = {};
  private tagRespository: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  constructor() {
    this.db = connect();
    this.db.sequelize;
    this.tagRespository = this.db.sequelize.getRepository(Tag);
  }

  async getTags(userId: string) {
    try {
      const tags = await this.tagRespository.findAll({
        where: { userId: userId },
        attributes: ['id', 'name'],
      });
      return tags;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async getTag(tagName: string) {
    try {
      return await this.tagRespository.findOne({
        where: { name: tagName },
        attributes: ['id', 'name'],
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async createTag(tagName: string, userId: string) {
    let data = {};
    try {
      data = await this.tagRespository.create({ name: tagName, userId: userId });
    } catch (err) {
      console.log(err);
    }
    return data;
  }
}
