import { col, fn, literal } from 'sequelize';
import { connect } from '../config/db.config';
import logger from '../config/logger';
import { Meme } from '../models/meme.model';
import { Tag } from '../models/tag.model';

export class MemeRepository {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private db: any = {};
  private memeRepository: any;
  private tagRepository: any;
  /* eslint-enable @typescript-eslint/no-explicit-any */

  constructor() {
    this.db = connect();
    this.memeRepository = this.db.sequelize.getRepository(Meme);
    this.tagRepository = this.db.sequelize.getRepository(Tag);
  }

  async getMemes(userId: string, limit: number, page: number, latest?: boolean, tagList?: number[]) {
    try {      
      const memes = await this.memeRepository.findAndCountAll({
        where: { userId: userId },
        limit: limit,
        offset: page * limit,
        include: [
          {
            model: this.tagRepository,
            attributes: ['id', 'name'],
            through: { attributes: [] },
            where: tagList && tagList?.length > 0 ? { id: tagList } : null,
          },
        ],
        order: [[latest ? 'uploadDate' : 'modifiedDate', 'DESC']],
        attributes: ['blurHash', 'width', 'height', 'id', 'modifiedDate', 'originalName', 'size', 'uploadDate', 'type'],
      });
      return memes;
    } catch (err) {
      logger.error(err);
      return [];
    }
  }

  async createMeme(fileData: {
    userId: string;
    name: string;
    originalName: string;
    type: string;
    size: number;
    uploadDate: Date;
    modifiedDate: Date;
    blurHash?: string;
    thumbnailName?: string;
    width?: number;
    height?: number;
    tags: [];
  }): Promise<Meme | null> {
    try {
      const meme = await this.memeRepository.create(fileData);
      if (fileData.tags) {
        fileData.tags.forEach((data) => {
          meme.$add('tags', data);
        });
      }
      return meme;
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  async getMeme(memeId: string, userId?: string): Promise<Meme | null> {
    try {
      if (userId) {
        return await this.memeRepository.findOne({
          where: { userId: userId, id: memeId },
          include: [
            {
              model: this.tagRepository,
              attributes: ['id', 'name'],
              through: { attributes: [] },
            },
          ],
        });
      } else {
        return await this.memeRepository.findOne({
          where: { id: memeId },
        });
      }
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  async countUnindexed(userId: string): Promise<number> {
    try {
      return await this.memeRepository.count({
        where: literal(`Tags IS NULL AND "Meme"."userId" = '${userId}'`),
        include: [
          {
            model: this.tagRepository,
          },
        ],
      });
    } catch (err) {
      logger.error(err);
      return 0;
    }
  }

  async updateMeme(userId: string, memeId: string, tags: Tag[]) {
    try {
      const meme = await this.memeRepository.findOne({
        where: { id: memeId, userId: userId },
        include: [{ model: this.tagRepository }],
      });
      if (meme) {
        const newTags: Tag[] = [];
        for (const tag of tags) {
          const [mTag] = await this.tagRepository.findOrCreate({
            where: { name: tag.name, userId: userId },
            defaults: {
              name: tag.name,
            },
          });

          if (!newTags.find((tag) => tag.id === mTag.id)) {
            newTags.push(mTag);
          }
        }
        await meme.setTags(newTags);

        return await this.memeRepository.findByPk(memeId, {
          attributes: { exclude: ['userId'] },
          include: [{ model: this.tagRepository, attributes: ['id', 'name'], through: { attributes: [] } }],
        });
      } else {
        return null;
      }
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  async getUnindexedMemes(userId: string, limit: number, page: number) {
    try {
      const memes = this.memeRepository.findAll({
        where: literal(
          `Tags IS NULL AND "Meme"."userId" = '${userId}' GROUP BY "Meme"."modifiedDate", "Meme"."id", "tags"."id" ORDER BY "Meme"."modifiedDate" DESC LIMIT ${limit} OFFSET ${
            page * limit
          }`,
        ),
        include: [
          {
            model: this.tagRepository,
            attributes: ['id', 'name'],
            through: { attributes: [] },
          },
        ],
      });
      const [memeList, count] = await Promise.all([memes, this.countUnindexed(userId)]);

      return { count: count, rows: memeList };
    } catch (err) {
      logger.error(err);
      return { count: 0, rows: [] };
    }
  }

  async getStatistics(
    userId: string,
  ): Promise<{ sizes: { type: string; size: string }[]; counts: { type: string; count: string }[] } | null> {
    try {
      const sizeData = this.memeRepository.findAll({
        where: { userId: userId },
        group: ['type'],
        raw: true,
        attributes: ['type', [fn('sum', col('size')), 'size']],
      });
      const countData = this.memeRepository.findAll({
        where: { userId: userId },
        group: ['type'],
        raw: true,
        attributes: ['type', [fn('COUNT', col('id')), 'count']],
      });
      return Promise.all([sizeData, countData]).then((data) => {
        return {
          sizes: data[0],
          counts: data[1],
        };
      });
    } catch (err) {
      logger.error(err);
      return null;
    }
  }

  async removeMeme(memeId: string, userId: string): Promise<Meme | null> {
    try {
      const meme = await this.memeRepository.findOne({ where: { userId: userId, id: memeId } });
      if (meme) {
        await meme.destroy();
      }
      return meme;
    } catch (err) {
      logger.error(err);
      return null;
    }
  }
}
